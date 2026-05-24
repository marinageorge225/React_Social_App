import React, { useState } from "react";

const PINK = "#e91e8c";
const PINK_SOFT = "#fdf0f6";
const PINK_BORDER = "#f5c6dd";
const PINK_MID = "#e991b8";
const PINK_TEXT = "#5a1a35";
const CARD_BORDER = "1px solid #f2d9e6";

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

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post?.likesCount ?? 0);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  console.log(post);
  if (!post) return null;

  const privacy = PRIVACY_META[post.privacy] ?? PRIVACY_META.public;

  function handleLike() {
    setLiked((p) => !p);
    setLikes((p) => (liked ? p - 1 : p + 1));
  }
  function handlePostWithoutImage(image, post) {
    if (!image) {
      return (
        <div className="w-full h-50 bg-blue-500 text-white flex items-center justify-center">
          <p className="text-2xl capitalize">{post}</p>
        </div>
      );
    }
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: CARD_BORDER,
        marginBottom: 14,
        overflow: "hidden",
        fontFamily: "-apple-system, 'Segoe UI', sans-serif",
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img
              src={post.user?.photo}
              alt={post.user?.name || "User"}
              onError={(e) => {
                e.target.src = `https://i.pravatar.cc/150?u=${post._id}`;
              }}
              style={{
                width: 42,
                height: 42,
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
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#22c55e",
                border: "2px solid #fff",
              }}
            />
          </div>
          <div style={{ marginLeft: 10 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: PINK_TEXT,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              {post.user?.name || "Unknown"}
              {post.bookmarked && (
                <span style={{ fontSize: 11, color: PINK }}>🔖</span>
              )}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#c291aa",
                marginTop: 2,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {timeAgo(post.createdAt)}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                  fontSize: 10,
                  color: PINK_MID,
                  background: PINK_SOFT,
                  border: `1px solid ${PINK_BORDER}`,
                  borderRadius: 999,
                  padding: "1px 7px",
                  marginLeft: 4,
                }}
              >
                {privacy.icon} {privacy.label}
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
            padding: "4px 6px",
            borderRadius: 8,
            lineHeight: 1,
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
          ···
        </button>
      </div>

      {/* Body text */}
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

      {/* Shared post preview */}
      {post.isShare && post.sharedPost && (
        <div
          style={{
            margin: "0 14px 12px",
            border: `1px solid ${PINK_BORDER}`,
            borderRadius: 10,
            padding: 10,
            background: PINK_SOFT,
            fontSize: 13,
            color: PINK_TEXT,
          }}
        >
          <strong>{post.sharedPost.user?.name}</strong>: {post.sharedPost.body}
        </div>
      )}

      {/* Image */}

      {post.image ? (
        <img
          src={post.image}
          alt="post-image"
          style={{
            width: "100%",
            maxHeight: 340,
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        handlePostWithoutImage(post.image, post.body)
      )}

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "7px 14px",
          fontSize: 12,
          color: "#c291aa",
          borderTop: "1px solid #f9eaf2",
          borderBottom: "1px solid #f9eaf2",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: PINK,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
            }}
          >
            ♥
          </span>
          {likes} {likes === 1 ? "like" : "likes"}
        </span>
        <span style={{ display: "flex", gap: 10 }}>
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
          {
            label: liked ? "Liked" : "Like",
            icon: "♥",
            action: handleLike,
            active: liked,
          },
          {
            label: "Comment",
            icon: "💬",
            action: () => setShowComment((p) => !p),
            active: showComment,
          },
          { label: "Share", icon: "↗", action: () => {}, active: false },
        ].map(({ label, icon, action, active }) => (
          <button
            key={label}
            onClick={action}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "9px 4px",
              background: "none",
              border: "none",
              cursor: "pointer",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: active ? 700 : 600,
              color: active ? PINK : "#c291aa",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = PINK_SOFT;
              e.currentTarget.style.color = PINK;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = active ? PINK : "#c291aa";
            }}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Comment input */}
      {showComment && (
        <div
          style={{
            padding: "10px 14px 13px",
            display: "flex",
            gap: 9,
            alignItems: "center",
            borderTop: "1px solid #f9eaf2",
          }}
        >
          <img
            src="https://i.pravatar.cc/150?u=me"
            alt="me"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: `2px solid ${PINK_MID}`,
              flexShrink: 0,
            }}
          />
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment…"
            style={{
              flex: 1,
              padding: "8px 13px",
              border: `1.5px solid ${PINK_BORDER}`,
              borderRadius: 20,
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
            style={{
              background: PINK,
              border: "none",
              borderRadius: 999,
              color: "#fff",
              fontWeight: 700,
              fontSize: 12,
              padding: "8px 14px",
              cursor: "pointer",
              flexShrink: 0,
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#c2185b")}
            onMouseLeave={(e) => (e.currentTarget.style.background = PINK)}
          >
            Send
          </button>
        </div>
      )}

      {showComment && post.topComment && (
        <div
          style={{
            padding: "0 14px 12px",
            fontSize: 12,
            color: "#c291aa",
          }}
        >
          ↳{" "}
          <strong style={{ color: PINK_TEXT }}>
            {post.topComment.commentCreator?.name}
          </strong>
          : {post.topComment.content}
        </div>
      )}
    </div>
  );
}
