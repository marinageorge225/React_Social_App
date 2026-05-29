import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getPostById } from "../../services/postServices";
import { getAllComments, createComment } from "../../services/commentsServises";

const P = "#e91e8c";
const PS = "#fdf0f6";
const PB = "#f5c6dd";
const PT = "#5a1a35";
const PAGE_SIZE = 5;

const PRIVACY = {
  public: "🌍 Public",
  friends: "👥 Friends",
  private: "🔒 Only me",
};

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function Avatar({ src, id, size = 36 }) {
  return (
    <img
      src={src || `https://i.pravatar.cc/150?u=${id}`}
      onError={(e) => (e.target.src = `https://i.pravatar.cc/150?u=${id}`)}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        border: `2px solid #e991b8`,
        flexShrink: 0,
      }}
    />
  );
}

function Spinner() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg,#FFF0F3,#FFE4EC)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ textAlign: "center", color: "#e991b8" }}>
        <div
          style={{
            width: 40,
            height: 40,
            border: `3px solid ${PB}`,
            borderTopColor: P,
            borderRadius: "50%",
            animation: "spin .8s linear infinite",
            margin: "0 auto 12px",
          }}
        />
        <p style={{ fontSize: 14 }}>Loading post…</p>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, onClick, active }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flex: 1,
        padding: "10px 4px",
        background: hover ? PS : "none",
        border: "none",
        cursor: "pointer",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: active ? 700 : 600,
        color: active || hover ? P : "#c291aa",
        fontFamily: "inherit",
      }}
    >
      {icon} {label}
    </button>
  );
}

function CommentItem({ c }) {
  const name = c.commentCreator?.name ?? c.user?.name ?? "Unknown";
  const photo = c.commentCreator?.photo ?? c.user?.photo;
  const body = c.content ?? c.body;
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        padding: "12px 16px",
        borderBottom: "1px solid #f9eaf2",
      }}
    >
      <Avatar src={photo} id={c._id} size={34} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: PT }}>
            {name}
          </span>
          <span style={{ fontSize: 11, color: "#c291aa" }}>
            {timeAgo(c.createdAt)}
          </span>
        </div>
        <div style={{ fontSize: 13, color: "#3d1a28", lineHeight: 1.6 }}>
          {body}
        </div>
      </div>
    </div>
  );
}

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [liked, setLiked] = useState(false);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    getPostById(id)
      .then((res) => {
        const p = res.data.data.post;
        setPost(p);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    loadComments(1);
  }, [id]);

  async function loadComments(p) {
    setLoadingMore(true);
    try {
      const { data } = await getAllComments(id, p);
      const items = data?.data?.comments ?? data?.comments ?? [];
      const total = data?.data?.total ?? data?.total ?? 0;
      setComments((prev) => (p === 1 ? items : [...prev, ...items]));
      setPage(p);
      setHasMore(p * PAGE_SIZE < total);
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleAddComment() {
    if (!newComment.trim()) return;

    try {
      setPosting(true);

      await createComment(id, {
        content: newComment,
      });

      setNewComment("");
      await loadComments(1);
      setPost((prev) => ({
        ...prev,
        commentsCount: (prev.commentsCount || 0) + 1,
      }));
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setPosting(false);
    }
  }

  if (loading) return <Spinner />;
  if (!post)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg,#FFF0F3,#FFE4EC)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#e991b8",
        }}
      >
        Post not found.
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg,#FFF0F3,#FFE4EC)",
        fontFamily: "-apple-system,'Segoe UI',sans-serif",
        padding: "28px 16px",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Back */}
        <button
          onClick={() => window.history.back()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#fff",
            border: `1px solid ${PB}`,
            borderRadius: 999,
            padding: "7px 16px",
            color: PT,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: 18,
            fontFamily: "inherit",
          }}
        >
          ← Back
        </button>

        {/* Post card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: `1px solid ${PB}`,
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 16px 12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ position: "relative" }}>
                <Avatar src={post.user?.photo} id={post._id} size={48} />
                <span
                  style={{
                    position: "absolute",
                    bottom: 1,
                    right: 1,
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    background: "#22c55e",
                    border: "2px solid #fff",
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: PT }}>
                  {post.user?.name}
                  {post.user?.username && (
                    <span
                      style={{
                        fontWeight: 400,
                        color: "#e991b8",
                        fontSize: 13,
                        marginLeft: 6,
                      }}
                    >
                      @{post.user.username}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#c291aa",
                    marginTop: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {timeAgo(post.createdAt)}
                  <span
                    style={{
                      fontSize: 11,
                      color: "#e991b8",
                      background: PS,
                      border: `1px solid ${PB}`,
                      borderRadius: 999,
                      padding: "2px 8px",
                    }}
                  >
                    {PRIVACY[post.privacy] ?? PRIVACY.public}
                  </span>
                </div>
              </div>
            </div>
            {post.bookmarked && <span style={{ fontSize: 18 }}>🔖</span>}
          </div>

          {/* Body */}
          {post.body && (
            <div
              style={{
                padding: "0 16px 14px",
                fontSize: 15,
                color: "#3d1a28",
                lineHeight: 1.7,
              }}
            >
              {post.body}
            </div>
          )}

          {/* Shared */}
          {post.isShare && post.sharedPost && (
            <div
              style={{
                margin: "0 16px 14px",
                border: `1px solid ${PB}`,
                borderRadius: 10,
                padding: 12,
                background: PS,
                fontSize: 14,
                color: PT,
              }}
            >
              <strong>{post.sharedPost.user?.name}</strong>:{" "}
              {post.sharedPost.body}
            </div>
          )}

          {/* Image */}
          {post.image && (
            <img
              src={post.image}
              alt="post"
              style={{
                width: "100%",
                maxHeight: 480,
                objectFit: "cover",
                display: "block",
              }}
            />
          )}

          {/* Stats */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 16px",
              fontSize: 13,
              color: "#c291aa",
              borderTop: "1px solid #f9eaf2",
              borderBottom: "1px solid #f9eaf2",
            }}
          >
            <span>
              ♥ {post.likesCount} {post.likesCount === 1 ? "like" : "likes"}
            </span>
            <span>
              {post.commentsCount} comments · {post.sharesCount} shares
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", padding: "2px 8px" }}>
            <ActionBtn
              icon="♥"
              label={liked ? "Liked" : "Like"}
              active={liked}
              onClick={() => setLiked((v) => !v)}
            />
            <ActionBtn icon="↗" label="Share" onClick={() => {}} />
          </div>
        </div>

        {/* Comments section */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: `1px solid ${PB}`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 16px 10px",
              borderBottom: "1px solid #f9eaf2",
            }}
          >
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: PT }}>
              Comments ({comments.length})
            </h3>
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              padding: "12px 16px",
              borderBottom: "1px solid #f9eaf2",
            }}
          >
            <Avatar src="https://i.pravatar.cc/150?u=me" id="me" />
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              placeholder="Write a comment…"
              style={{
                flex: 1,
                padding: "9px 14px",
                border: `1.5px solid ${PB}`,
                borderRadius: 24,
                background: PS,
                outline: "none",
                fontSize: 13,
                color: "#3d1a28",
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
              onClick={handleAddComment}
              disabled={posting}
              style={{
                background: P,
                border: "none",
                borderRadius: 999,
                color: "#fff",
                fontWeight: 700,
                fontSize: 12,
                padding: "9px 16px",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Post
            </button>
          </div>

          {/* List */}
          {comments.length === 0 && !loadingMore ? (
            <div
              style={{
                padding: "24px 16px",
                textAlign: "center",
                fontSize: 13,
                color: "#c291aa",
              }}
            >
              No comments yet — be the first!
            </div>
          ) : (
            comments.map((c) => <CommentItem key={c._id} c={c} />)
          )}

          {/* View more */}
          {hasMore && (
            <div style={{ padding: "10px 16px" }}>
              <button
                onClick={() => loadComments(page + 1)}
                disabled={loadingMore}
                style={{
                  width: "100%",
                  padding: 9,
                  background: "none",
                  border: `1px solid ${PB}`,
                  borderRadius: 8,
                  color: P,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {loadingMore ? "Loading…" : "View more comments"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
