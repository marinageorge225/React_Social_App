import React, { useState, useContext } from "react";
import { Link } from "react-router";
import { getAllComments, createComment } from "../../services/commentsServises";
import { deletePost, UpdatePost } from "../../services/postServices";
import { AuthContext } from "../../context/AuthContext";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  addToast,
} from "@heroui/react";

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
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  // Use post._id with fallback to post.id for API compatibility
  const postId = post?._id ?? post?.id;
  const [postData, setPostData] = useState(post);
  const [updatedText, setUpdatedText] = useState(post?.body ?? "");
  const { profileData } = useContext(AuthContext);
  const [updatedImage, setUpdatedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(post?.image || "");
  const isOwner =
    profileData?._id === post?.user?._id || profileData?._id === post?.user?.id;

  // FIX: Guard after all hooks — avoids React "fewer hooks than expected" error
  if (!post || isDeleted) return null;

  async function loadComments(p) {
    setLoading(true);
    try {
      const { data } = await getAllComments(postId, p);
      const items = data?.data?.comments ?? data?.comments ?? [];
      const total = data?.data?.total ?? data?.total ?? 0;
      setComments((prev) => (p === 1 ? items : [...prev, ...items]));
      setPage(p);
      setHasMore(p * PAGE_SIZE < total);
      setLoaded(true);
    } catch (error) {
      console.error("Failed to load comments:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCommentSubmit() {
    if (!comment.trim()) return;
    try {
      await createComment(postId, { content: comment });
      setComment("");
      loadComments(1);
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  }

  function toggleComments() {
    setOpen((v) => !v);
    if (!loaded) loadComments(1);
  }

  // FIX: Use consistent postId; added loading state to prevent double-clicks
  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deletePost(postId);
      addToast({
        title: "Post deleted",
        description: "Your post was removed successfully.",
        color: "success",
      });
      setIsDeleted(true);
    } catch (error) {
      console.error("Failed to delete post:", error);
      addToast({
        title: "Delete failed",
        description: error?.response?.data?.message ?? "Please try again.",
        color: "danger",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  // FIX: Use consistent postId; added loading state and toast feedback
  async function handleUpdate(onClose) {
    if (!updatedText.trim()) return;

    setIsUpdating(true);

    try {
      const formData = new FormData();

      formData.append("body", updatedText);

      if (updatedImage) {
        formData.append("image", updatedImage);
      }

      const { data } = await UpdatePost(postId, formData);

      setPostData((prev) => ({
        ...prev,
        body: updatedText,
        image: imagePreview || prev.image,
      }));

      addToast({
        title: "Post updated",
        description: "Your changes were saved.",
        color: "success",
      });

      onClose();
    } catch (error) {
      console.error("Failed to update post:", error);

      addToast({
        title: "Update failed",
        description: error?.response?.data?.message ?? "Please try again.",
        color: "danger",
      });
    } finally {
      setIsUpdating(false);
    }
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
            <Avatar src={post.user?.photo} id={postId} />
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

        {/* Owner menu */}
        {isOwner && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowMenu((v) => !v)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#c291aa",
                fontSize: 20,
                lineHeight: 1,
                padding: "4px 8px",
              }}
            >
              ⋮
            </button>

            {/* FIX: Backdrop to close menu on outside click */}
            {showMenu && (
              <>
                <div
                  onClick={() => setShowMenu(false)}
                  style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 998,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 34,
                    background: "#fff",
                    border: "1px solid #eee",
                    borderRadius: 10,
                    overflow: "hidden",
                    boxShadow: "0 4px 16px rgba(0,0,0,.12)",
                    zIndex: 999,
                    minWidth: 130,
                  }}
                >
                  <button
                    onClick={() => {
                      setUpdatedText(postData.body ?? "");
                      setUpdatedImage(null);
                      setImagePreview(postData.image || "");
                      setShowUpdateModal(true);
                      setShowMenu(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      border: "none",
                      borderBottom: "1px solid #f3f3f3",
                      background: "white",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: 13,
                      color: PT,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = PS)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "white")
                    }
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => {
                      setShowDeleteModal(true);
                      setShowMenu(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      border: "none",
                      background: "white",
                      color: "#e53e3e",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: 13,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#fff5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "white")
                    }
                  >
                    🗑 Delete
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Body — FIX: render from postData so updates reflect immediately */}
      {postData.body && (
        <div
          style={{
            padding: "0 14px 12px",
            fontSize: 14,
            color: "#3d1a28",
            lineHeight: 1.65,
          }}
        >
          {postData.body}
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
      <Link to={`/post/${postId}`}>
        {postData.image ? (
          <img
            src={postData.image}
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
            {postData.body}
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
            <Avatar
              src={profileData?.photo ?? "https://i.pravatar.cc/150?u=me"}
              id="me"
              size={32}
            />
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
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
                background: comment.trim() ? P : PB,
                border: "none",
                borderRadius: 999,
                color: "#fff",
                fontWeight: 700,
                fontSize: 12,
                padding: "8px 14px",
                cursor: comment.trim() ? "pointer" : "not-allowed",
                transition: "background 0.2s",
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
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
              }}
            >
              {loading ? "Loading…" : "View more comments"}
            </button>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        className="bg-pink-50"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader style={{ color: PT }}>Delete Post</ModalHeader>
              <ModalBody style={{ fontSize: 14, color: "#3d1a28" }}>
                Are you sure you want to delete this post? This action cannot be
                undone.
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  isDisabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={isDeleting}
                  onPress={async () => {
                    await handleDelete();
                    onClose();
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Update Post Modal */}
      <Modal
        isOpen={showUpdateModal}
        onOpenChange={setShowUpdateModal}
        className="bg-pink-50"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader style={{ color: PT }}>Edit Post</ModalHeader>
              <ModalBody>
                <Textarea
                  label="Post content"
                  placeholder="What's on your mind?"
                  value={updatedText}
                  onChange={(e) => setUpdatedText(e.target.value)}
                  minRows={4}
                />

                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="preview"
                    style={{
                      width: "100%",
                      maxHeight: 250,
                      objectFit: "cover",
                      borderRadius: 12,
                      marginTop: 10,
                    }}
                  />
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (file) {
                      setUpdatedImage(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  style={{ marginTop: 10 }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  isDisabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={isUpdating}
                  isDisabled={!updatedText.trim()}
                  onPress={() => handleUpdate(onClose)}
                >
                  Save changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
