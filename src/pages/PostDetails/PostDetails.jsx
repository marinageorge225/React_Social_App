import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getPostById } from "../../services/postServices";
import { getAllComments, createComment } from "../../services/commentsServises";
import { getAllLikes, toggleLike } from "../../services/likesServises"; // ✅ toggleLike imported

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

// ─── helpers ────────────────────────────────────────────────────────────────

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── sub-components ─────────────────────────────────────────────────────────

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
        border: `2px solid ${PB}`,
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
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
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
        <p style={{ fontSize: 14, margin: 0 }}>Loading post…</p>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, onClick, active, disabled }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flex: 1,
        padding: "10px 4px",
        background: hover ? PS : "none",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: active ? 700 : 600,
        color: active ? P : hover ? P : "#c291aa",
        fontFamily: "inherit",
        transition: "all 0.15s ease",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <span style={{ marginRight: 5 }}>{icon}</span>
      {label}
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
        transition: "background 0.15s",
      }}
    >
      <Avatar src={photo} id={c._id} size={34} />
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: PT }}>
            {name}
          </span>
          <span style={{ fontSize: 11, color: "#c291aa" }}>
            {timeAgo(c.createdAt)}
          </span>
        </div>
        <div style={{ fontSize: 13, color: "#3d1a28", lineHeight: 1.65 }}>
          {body}
        </div>
      </div>
    </div>
  );
}

// ─── main ────────────────────────────────────────────────────────────────────

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
  const [likesCount, setLikesCount] = useState(0); // ✅ own state, not buried in post
  const [posting, setPosting] = useState(false);
  const [liking, setLiking] = useState(false); // ✅ prevent double-tap

  // ── fetch post ──────────────────────────────────────────────────────────
  useEffect(() => {
    getPostById(id)
      .then((res) => {
        const p = res.data.data.post;
        setPost(p);
        setLikesCount(p.likesCount ?? 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // ── fetch comments & likes on mount ────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    loadComments(1);
    loadLikes(); // ✅ was defined but never called before
  }, [id]);

  // ── load comments ───────────────────────────────────────────────────────
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

  // ── load likes ──────────────────────────────────────────────────────────
  async function loadLikes() {
    try {
      const res = await getAllLikes(id);
      const items = res?.data?.likes ?? res?.likes ?? [];
      setLikesCount(items.length);
    } catch (err) {
      console.error("Failed to load likes:", err);
    }
  }

  // ── toggle like ─────────────────────────────────────────────────────────
  async function handleLike() {
    if (liking) return;
    setLiking(true);

    // Optimistic update
    setLiked((prev) => {
      const next = !prev;
      setLikesCount((c) => c + (next ? 1 : -1)); // ✅ no stale-closure bug
      return next;
    });

    try {
      await toggleLike(id); // ✅ was called but never imported before
    } catch (err) {
      console.error(err);
      // Roll back on failure
      setLiked((prev) => {
        const rolled = !prev;
        setLikesCount((c) => c + (rolled ? 1 : -1));
        return rolled;
      });
    } finally {
      setLiking(false);
    }
  }

  // ── add comment ─────────────────────────────────────────────────────────
  async function handleAddComment() {
    if (!newComment.trim() || posting) return;
    setPosting(true);
    try {
      await createComment(id, { content: newComment });
      setNewComment("");
      await loadComments(1);
      setPost((prev) => ({
        ...prev,
        commentsCount: (prev.commentsCount || 0) + 1,
      }));
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setPosting(false);
    }
  }

  // ── guards ───────────────────────────────────────────────────────────────
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
          fontSize: 15,
          color: "#e991b8",
        }}
      >
        Post not found.
      </div>
    );

  // ── render ───────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg,#FFF0F3,#FFE4EC)",
        fontFamily: "'Nunito','Segoe UI',sans-serif",
        padding: "28px 16px",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#fff",
            border: `1.5px solid ${PB}`,
            borderRadius: 999,
            padding: "7px 18px",
            color: PT,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: 18,
            fontFamily: "inherit",
            boxShadow: "0 1px 4px rgba(233,30,140,0.07)",
          }}
        >
          ← Back
        </button>

        {/* ── Post card ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            border: `1.5px solid ${PB}`,
            overflow: "hidden",
            marginBottom: 16,
            boxShadow: "0 4px 24px rgba(233,30,140,0.07)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 18px 12px",
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
                    marginTop: 3,
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
                padding: "0 18px 16px",
                fontSize: 15,
                color: "#3d1a28",
                lineHeight: 1.75,
              }}
            >
              {post.body}
            </div>
          )}

          {/* Shared post */}
          {post.isShare && post.sharedPost && (
            <div
              style={{
                margin: "0 18px 16px",
                border: `1.5px solid ${PB}`,
                borderRadius: 12,
                padding: "12px 14px",
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

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 18px",
              fontSize: 13,
              color: "#c291aa",
              borderTop: "1px solid #f9eaf2",
              borderBottom: "1px solid #f9eaf2",
            }}
          >
            <span>
              ♥ {likesCount} {likesCount === 1 ? "like" : "likes"}
            </span>
            <span>
              {post.commentsCount ?? comments.length} comments ·{" "}
              {post.sharesCount ?? 0} shares
            </span>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", padding: "4px 10px" }}>
            <ActionBtn
              icon={liked ? "♥" : "♡"}
              label={liked ? "Liked" : "Like"}
              active={liked}
              disabled={liking}
              onClick={handleLike}
            />
            <ActionBtn icon="↗" label="Share" onClick={() => {}} />
          </div>
        </div>

        {/* ── Comments card ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            border: `1.5px solid ${PB}`,
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(233,30,140,0.07)",
          }}
        >
          {/* Section header */}
          <div
            style={{
              padding: "14px 18px 12px",
              borderBottom: "1px solid #f9eaf2",
            }}
          >
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: PT }}>
              Comments
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#e991b8",
                  background: PS,
                  border: `1px solid ${PB}`,
                  borderRadius: 999,
                  padding: "2px 8px",
                }}
              >
                {post.commentsCount ?? comments.length}
              </span>
            </h3>
          </div>

          {/* Comment input */}
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              padding: "12px 18px",
              borderBottom: "1px solid #f9eaf2",
            }}
          >
            <Avatar src="https://i.pravatar.cc/150?u=me" id="me" />
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleAddComment()
              }
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
                transition: "all 0.15s ease",
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
              disabled={posting || !newComment.trim()}
              style={{
                background: posting || !newComment.trim() ? PB : P,
                border: "none",
                borderRadius: 999,
                color: "#fff",
                fontWeight: 700,
                fontSize: 12,
                padding: "9px 16px",
                cursor:
                  posting || !newComment.trim() ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                transition: "background 0.15s ease",
              }}
            >
              {posting ? "…" : "Post"}
            </button>
          </div>

          {/* Comments list */}
          {loadingMore && comments.length === 0 ? (
            <div
              style={{
                padding: "24px 18px",
                textAlign: "center",
                color: "#e991b8",
                fontSize: 13,
              }}
            >
              Loading comments…
            </div>
          ) : comments.length === 0 ? (
            <div style={{ padding: "32px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
              <p style={{ margin: 0, fontSize: 13, color: "#c291aa" }}>
                No comments yet — be the first!
              </p>
            </div>
          ) : (
            comments.map((c) => <CommentItem key={c._id} c={c} />)
          )}

          {/* Load more */}
          {hasMore && (
            <div style={{ padding: "12px 18px" }}>
              <button
                onClick={() => loadComments(page + 1)}
                disabled={loadingMore}
                style={{
                  width: "100%",
                  padding: 10,
                  background: "none",
                  border: `1.5px solid ${PB}`,
                  borderRadius: 10,
                  color: P,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: loadingMore ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  transition: "background 0.15s ease",
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
