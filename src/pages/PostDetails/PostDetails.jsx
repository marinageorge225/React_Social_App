import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getPostById } from "../../services/postServices";
import PostCard from "../../components/PostCard/PostCard";

const PINK = "#e91e8c";
const PINK_SOFT = "#fdf0f6";
const PINK_BORDER = "#f5c6dd";
const PINK_MID = "#e991b8";
const PINK_TEXT = "#5a1a35";

function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    async function fetchPostDetails(postId) {
      try {
        let response = await getPostById(postId);
        const fetchedPost = response.data.data.post;
        setPost(fetchedPost);
        // If topComment exists seed the comments list
        if (fetchedPost.topComment) {
          setComments([fetchedPost.topComment]);
        }
      } catch (err) {
        console.error("Failed to fetch post:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPostDetails(id);
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #FFF0F3 0%, #FFE4EC 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", color: PINK_MID }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: `3px solid ${PINK_BORDER}`,
              borderTopColor: PINK,
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p
            style={{
              fontSize: 14,
              fontFamily: "-apple-system, 'Segoe UI', sans-serif",
            }}
          >
            Loading post…
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #FFF0F3 0%, #FFE4EC 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "-apple-system, 'Segoe UI', sans-serif",
          color: PINK_MID,
          fontSize: 15,
        }}
      >
        Post not found.
      </div>
    );
  }

  function timeAgo(iso) {
    const diff = (Date.now() - new Date(iso)) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  const PRIVACY_META = {
    public: { icon: "🌍", label: "Public" },
    friends: { icon: "👥", label: "Friends" },
    private: { icon: "🔒", label: "Only me" },
  };
  const privacy = PRIVACY_META[post.privacy] ?? PRIVACY_META.public;

  function handleAddComment() {
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        _id: Date.now().toString(),
        body: newComment.trim(),
        user: { name: "You", photo: "https://i.pravatar.cc/150?u=me" },
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewComment("");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #FFF0F3 0%, #FFE4EC 100%)",
        fontFamily: "-apple-system, 'Segoe UI', sans-serif",
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
            border: `1px solid ${PINK_BORDER}`,
            borderRadius: 999,
            padding: "7px 16px",
            color: PINK_TEXT,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: 18,
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = PINK_SOFT)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
        >
          ← Back
        </button>

        {/* ── Post card ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: `1px solid ${PINK_BORDER}`,
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          {/* Author header */}
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
                <img
                  src={
                    post.user?.photo ||
                    `https://i.pravatar.cc/150?u=${post._id}`
                  }
                  alt={post.user?.name}
                  onError={(e) => {
                    e.target.src = `https://i.pravatar.cc/150?u=${post._id}`;
                  }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `2px solid ${PINK_MID}`,
                    display: "block",
                  }}
                />
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
                <div
                  style={{ fontSize: 15, fontWeight: 700, color: PINK_TEXT }}
                >
                  {post.user?.name}
                  {post.user?.username && (
                    <span
                      style={{
                        fontWeight: 400,
                        color: PINK_MID,
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
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                      fontSize: 11,
                      color: PINK_MID,
                      background: PINK_SOFT,
                      border: `1px solid ${PINK_BORDER}`,
                      borderRadius: 999,
                      padding: "2px 8px",
                    }}
                  >
                    {privacy.icon} {privacy.label}
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

          {/* Shared post */}
          {post.isShare && post.sharedPost && (
            <div
              style={{
                margin: "0 16px 14px",
                border: `1px solid ${PINK_BORDER}`,
                borderRadius: 10,
                padding: 12,
                background: PINK_SOFT,
                fontSize: 14,
                color: PINK_TEXT,
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
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: PINK,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  color: "#fff",
                }}
              >
                ♥
              </span>
              {post.likesCount} {post.likesCount === 1 ? "like" : "likes"}
            </span>
            <span style={{ display: "flex", gap: 12 }}>
              <span>
                {post.commentsCount}{" "}
                {post.commentsCount === 1 ? "comment" : "comments"}
              </span>
              <span>
                {post.sharesCount} {post.sharesCount === 1 ? "share" : "shares"}
              </span>
            </span>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", padding: "2px 8px" }}>
            {[
              { label: "Like", icon: "♥" },
              { label: "Share", icon: "↗" },
            ].map(({ label, icon }) => (
              <button
                key={label}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "10px 4px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#c291aa",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = PINK_SOFT;
                  e.currentTarget.style.color = PINK;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.color = "#c291aa";
                }}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Comments section ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: `1px solid ${PINK_BORDER}`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 16px 10px",
              borderBottom: "1px solid #f9eaf2",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: PINK_TEXT,
              }}
            >
              Comments ({comments.length})
            </h3>
          </div>

          {/* Comment input */}
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              padding: "12px 16px",
              borderBottom: "1px solid #f9eaf2",
            }}
          >
            <img
              src="https://i.pravatar.cc/150?u=me"
              alt="me"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: `2px solid ${PINK_MID}`,
                flexShrink: 0,
              }}
            />
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              placeholder="Write a comment…"
              style={{
                flex: 1,
                padding: "9px 14px",
                border: `1.5px solid ${PINK_BORDER}`,
                borderRadius: 24,
                background: PINK_SOFT,
                outline: "none",
                fontSize: 13,
                color: "#3d1a28",
                fontFamily: "inherit",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = PINK;
                e.target.style.background = "#fff";
                e.target.style.boxShadow = "0 0 0 3px rgba(233,30,140,.08)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = PINK_BORDER;
                e.target.style.background = PINK_SOFT;
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              onClick={handleAddComment}
              style={{
                background: PINK,
                border: "none",
                borderRadius: 999,
                color: "#fff",
                fontWeight: 700,
                fontSize: 12,
                padding: "9px 16px",
                cursor: "pointer",
                flexShrink: 0,
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#c2185b")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = PINK)}
            >
              Post
            </button>
          </div>

          {/* Comments list */}
          {comments.length === 0 ? (
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
            <div>
              {comments.map((c) => (
                <div
                  key={c._id}
                  style={{
                    display: "flex",
                    gap: 10,
                    padding: "12px 16px",
                    borderBottom: "1px solid #f9eaf2",
                  }}
                >
                  <img
                    src={
                      c.user?.photo || `https://i.pravatar.cc/150?u=${c._id}`
                    }
                    alt={c.user?.name}
                    onError={(e) => {
                      e.target.src = `https://i.pravatar.cc/150?u=${c._id}`;
                    }}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      border: `2px solid ${PINK_MID}`,
                      flexShrink: 0,
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 3,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: PINK_TEXT,
                        }}
                      >
                        {c.user?.name}
                      </span>
                      <span style={{ fontSize: 11, color: "#c291aa" }}>
                        {timeAgo(c.createdAt)}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#3d1a28",
                        lineHeight: 1.6,
                      }}
                    >
                      {c.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetails;
