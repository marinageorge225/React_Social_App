import React, { useState } from "react";
import { Link } from "react-router";
import { getAllComments, createComment } from "../../services/commentsServises";

const P = "#e91e8c";
const PS = "#fdf0f6";
const PB = "#f5c6dd";
const PT = "#5a1a35";
const CARD = "1px solid #f2d9e6";
const PAGE_SIZE = 5;

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const PRIVACY = {
  public: "🌍 Public",
  friends: "👥 Friends",
  private: "🔒 Only me",
};

function Avatar({ src, id, size = 42 }) {
  return (
    <img
      src={src}
      onError={(e) => (e.target.src = `https://i.pravatar.cc/150?u=${id}`)}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        border: `2px solid #e991b8`,
      }}
    />
  );
}

function Comment({ c }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        marginBottom: 10,
        alignItems: "flex-start",
      }}
    >
      <Avatar src={c.commentCreator?.photo} id={c._id} size={30} />
      <div
        style={{
          background: PS,
          border: `1px solid ${PB}`,
          borderRadius: "0 12px 12px 12px",
          padding: "7px 11px",
          fontSize: 12,
          flex: 1,
        }}
      >
        <strong style={{ color: PT }}>
          {c.commentCreator?.name ?? "Unknown"}
        </strong>
        <span style={{ color: "#c291aa", marginLeft: 6, fontSize: 10 }}>
          {timeAgo(c.createdAt)}
        </span>
        <p style={{ margin: "3px 0 0", color: "#3d1a28" }}>{c.content}</p>
      </div>
    </div>
  );
}

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post?.likesCount ?? 0);
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!post) return null;

  async function loadComments(p) {
    setLoading(true);
    try {
      const { data } = await getAllComments(post._id ?? post.id, p);
      const items = data?.data?.comments ?? data?.comments ?? [];
      const total = data?.data?.total ?? data?.total ?? 0;
      setComments((prev) => (p === 1 ? items : [...prev, ...items]));
      setPage(p);
      setHasMore(p * PAGE_SIZE < total);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleCommentSubmit() {
    if (!comment.trim()) return;
    try {
      await createComment(post._id, {
        content: comment,
      });
      setComment("");
      loadComments(1);
    } catch (error) {
      console.error(error);
    }
  }

  function toggleComments() {
    setOpen((v) => !v);
    if (!loaded) loadComments(1);
  }

  const btn = (label, icon, action, active) => (
    <button
      key={label}
      onClick={action}
      style={{
        flex: 1,
        padding: "9px 4px",
        background: "none",
        border: "none",
        cursor: "pointer",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: active ? 700 : 600,
        color: active ? P : "#c291aa",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = PS;
        e.currentTarget.style.color = P;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "none";
        e.currentTarget.style.color = active ? P : "#c291aa";
      }}
    >
      {icon} {label}
    </button>
  );

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: CARD,
        marginBottom: 14,
        overflow: "hidden",
        fontFamily: "-apple-system,'Segoe UI',sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 14px 10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <Avatar src={post.user?.photo} id={post._id} />
            <span
              style={{
                position: "absolute",
                bottom: 1,
                right: 1,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#22c55e",
                border: "2px solid #fff",
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: PT }}>
              {post.user?.name ?? "Unknown"}
            </div>
            <div style={{ fontSize: 11, color: "#c291aa", marginTop: 2 }}>
              {timeAgo(post.createdAt)}
              <span
                style={{
                  marginLeft: 6,
                  fontSize: 10,
                  color: "#e991b8",
                  background: PS,
                  border: `1px solid ${PB}`,
                  borderRadius: 999,
                  padding: "1px 7px",
                }}
              >
                {PRIVACY[post.privacy] ?? PRIVACY.public}
              </span>
            </div>
          </div>
        </div>
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#c291aa",
            fontSize: 20,
          }}
        >
          ···
        </button>
      </div>

      {/* Body */}
      {post.body && (
        <div
          style={{
            padding: "0 14px 12px",
            fontSize: 14,
            color: "#3d1a28",
            lineHeight: 1.65,
          }}
        >
          {post.body}
        </div>
      )}

      {/* Shared post */}
      {post.isShare && post.sharedPost && (
        <div
          style={{
            margin: "0 14px 12px",
            border: `1px solid ${PB}`,
            borderRadius: 10,
            padding: 10,
            background: PS,
            fontSize: 13,
            color: PT,
          }}
        >
          <strong>{post.sharedPost.user?.name}</strong>: {post.sharedPost.body}
        </div>
      )}

      {/* Image */}
      <Link to={`/post/${post.id}`}>
        {post.image ? (
          <img
            src={post.image}
            alt="post"
            style={{
              width: "100%",
              maxHeight: 340,
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              background: PS,
              padding: 16,
              textAlign: "center",
              color: PT,
              fontSize: 15,
            }}
          >
            {post.body}
          </div>
        )}
      </Link>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "7px 14px",
          fontSize: 12,
          color: "#c291aa",
          borderTop: "1px solid #f9eaf2",
          borderBottom: "1px solid #f9eaf2",
        }}
      >
        <span>
          ♥ {likes} {likes === 1 ? "like" : "likes"}
        </span>
        <span>
          {post.commentsCount} comments · {post.sharesCount} shares
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", padding: "2px 8px" }}>
        {btn(
          liked ? "Liked" : "Like",
          "♥",
          () => {
            setLiked((v) => !v);
            setLikes((v) => (liked ? v - 1 : v + 1));
          },
          liked,
        )}
        {btn("Comment", "💬", toggleComments, open)}
        {btn("Share", "↗", () => {}, false)}
      </div>

      {/* Top comment (collapsed) */}
      {!open && post.topComment && (
        <div
          style={{
            padding: "8px 14px 12px",
            fontSize: 12,
            color: "#c291aa",
            borderTop: "1px solid #f9eaf2",
          }}
        >
          ↳{" "}
          <strong style={{ color: PT }}>
            {post.topComment.commentCreator?.name}
          </strong>
          : {post.topComment.content}
        </div>
      )}

      {/* Comments section (expanded) */}
      {open && (
        <div style={{ borderTop: "1px solid #f9eaf2", padding: "10px 14px" }}>
          {/* Input */}
          <div
            style={{
              display: "flex",
              gap: 9,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Avatar src="https://i.pravatar.cc/150?u=me" id="me" size={32} />
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment…"
              style={{
                flex: 1,
                padding: "8px 13px",
                border: `1.5px solid ${PB}`,
                borderRadius: 20,
                background: PS,
                outline: "none",
                fontSize: 13,
                fontFamily: "inherit",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = P;
                e.target.style.background = "#fff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = PB;
                e.target.style.background = PS;
              }}
            />
            <button
              onClick={handleCommentSubmit}
              disabled={!comment.trim()}
              style={{
                background: P,
                border: "none",
                borderRadius: 999,
                color: "#fff",
                fontWeight: 700,
                fontSize: 12,
                padding: "8px 14px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>

          {/* List */}
          {loading && comments.length === 0 ? (
            <p style={{ fontSize: 12, color: "#c291aa" }}>Loading…</p>
          ) : (
            comments.map((c) => <Comment key={c._id ?? c.id} c={c} />)
          )}
          {!loading && comments.length === 0 && loaded && (
            <p style={{ fontSize: 12, color: "#c291aa" }}>
              No comments yet. Be the first!
            </p>
          )}

          {/* View more */}
          {hasMore && (
            <button
              onClick={() => loadComments(page + 1)}
              disabled={loading}
              style={{
                width: "100%",
                padding: 8,
                background: "none",
                border: `1px solid ${PB}`,
                borderRadius: 8,
                color: P,
                fontWeight: 600,
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {loading ? "Loading…" : "View more comments"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
