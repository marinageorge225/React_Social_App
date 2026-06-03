import React, { useEffect, useRef, useState } from "react";
import { getUserPosts } from "../../services/postServices";
import SideBar from "../../components/SideBar/SideBar";
import PostCard from "../../components/PostCard/PostCard";
import FriendReq from "../../components/FriendReq/FriendReq";
import PostSkeleton from "../../components/Skeletons/PostSkeleton";
import { getUserProfile } from "../../services/userServices";
import { UploadProfilePicture } from "../../services/userServices"; // adjust import path

/* ─── Design tokens ─────────────────────────────────────── */
const T = {
  pink: "#e91e8c",
  pinkDeep: "#c4157a",
  pinkSoft: "#fdf0f6",
  pinkPale: "#fff5fa",
  pinkBorder: "#f5c6dd",
  pinkGlow: "rgba(233,30,140,0.18)",
  dark: "#3a0d22",
  muted: "#b07090",
  white: "#ffffff",
};

/* ─── Keyframes injected once ───────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

  @keyframes fadeUp   { from { opacity:0; transform:translateY(22px) } to { opacity:1; transform:none } }
  @keyframes pulseRing{ 0%,100%{ box-shadow:0 0 0 0 rgba(233,30,140,0.35) } 50%{ box-shadow:0 0 0 10px rgba(233,30,140,0) } }
  @keyframes shimmer  { from{background-position:-200% 0} to{background-position:200% 0} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

  .fade-up { animation: fadeUp 0.55s cubic-bezier(.22,1,.36,1) both; }
  .fade-up-1{ animation-delay:0.08s }
  .fade-up-2{ animation-delay:0.16s }
  .fade-up-3{ animation-delay:0.24s }

  .photo-wrap:hover .photo-overlay{ opacity:1 !important; }
  .photo-wrap:hover img{ transform:scale(1.07); }

  .stat-pill:hover{ background:${T.pink}; transform:translateY(-2px); }
  .stat-pill:hover .stat-value, .stat-pill:hover .stat-label{ color:#fff !important; }

  .back-btn:hover{ background:${T.pinkSoft}; border-color:${T.pink}; color:${T.pink}; transform:translateX(-2px); }

  .cover-shimmer{
    background: linear-gradient(90deg, #f9d4e8 25%, #fde9f3 50%, #f9d4e8 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s infinite;
  }
`;

/* ─── Small helpers ─────────────────────────────────────── */
const BackButton = () => (
  <button
    className="back-btn"
    onClick={() => window.history.back()}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      background: T.white,
      border: `1.5px solid ${T.pinkBorder}`,
      borderRadius: 999,
      padding: "8px 20px",
      color: T.dark,
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer",
      fontFamily: "'DM Sans',sans-serif",
      transition: "all 0.2s ease",
      boxShadow: "0 2px 8px rgba(233,30,140,0.08)",
    }}
  >
    ← Back
  </button>
);

const StatPill = ({ label, value, icon }) => (
  <div
    className="stat-pill"
    style={{
      flex: 1,
      textAlign: "center",
      padding: "14px 10px",
      borderRadius: 14,
      transition: "all 0.22s ease",
      cursor: "default",
    }}
  >
    <div style={{ fontSize: 20, marginBottom: 2 }}>{icon}</div>
    <div
      className="stat-value"
      style={{
        fontSize: 22,
        fontWeight: 800,
        color: T.pink,
        lineHeight: 1,
        transition: "color 0.2s",
      }}
    >
      {value ?? 0}
    </div>
    <div
      className="stat-label"
      style={{
        fontSize: 10,
        color: T.muted,
        marginTop: 3,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        transition: "color 0.2s",
      }}
    >
      {label}
    </div>
  </div>
);

const Badge = ({ children }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      background: `linear-gradient(135deg,${T.pinkSoft},#fff0f8)`,
      border: `1px solid ${T.pinkBorder}`,
      borderRadius: 999,
      padding: "3px 12px",
      fontSize: 11,
      fontWeight: 700,
      color: T.pink,
      letterSpacing: "0.05em",
    }}
  >
    {children}
  </span>
);

const InfoRow = ({ icon, label, value }) =>
  value ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 0",
        borderBottom: `1px solid #fce8f2`,
      }}
    >
      <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>
        {icon}
      </span>
      <span
        style={{ fontSize: 12, color: T.muted, fontWeight: 600, minWidth: 80 }}
      >
        {label}
      </span>
      <span style={{ fontSize: 13, color: T.dark, fontWeight: 600 }}>
        {value}
      </span>
    </div>
  ) : null;

/* ─── Main component ────────────────────────────────────── */
const UserPosts = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await getUserPosts();
        setUserPosts(r.data.data.posts);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
    (async () => {
      try {
        const r = await getUserProfile();
        setUserProfile(r.data.data.user);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("File must be under 5 MB.");
      return;
    }

    setPhotoError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const res = await UploadProfilePicture(formData);
      const newPhoto =
        res?.data?.data?.user?.photo || URL.createObjectURL(file);
      setUserProfile((prev) => ({ ...prev, photo: newPhoto }));
    } catch (err) {
      setPhotoError("Upload failed. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const joinDate = userProfile?.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;
  const dob = userProfile?.dateOfBirth
    ? new Date(userProfile.dateOfBirth).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <>
      <style>{STYLES}</style>

      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(150deg,#fff0f6 0%,#ffe4ec 55%,#ffd6e7 100%)",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: "fixed",
            top: -120,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(233,30,140,0.12),transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: -80,
            left: -60,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(233,30,140,0.09),transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          style={{
            maxWidth: 1380,
            margin: "0 auto",
            padding: "28px 16px",
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "300px 1fr 300px",
            gap: 20,
            alignItems: "start",
          }}
        >
          {/* Left sidebar */}
          <aside style={{ position: "sticky", top: 28 }}>
            <SideBar />
          </aside>

          {/* Center feed */}
          <main
            style={{
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {/* Nav row */}
            <div
              className="fade-up"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <BackButton />
              <span style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>
                {userPosts.length > 0 &&
                  `${userPosts.length} post${userPosts.length !== 1 ? "s" : ""}`}
              </span>
            </div>

            {/* ── Profile card ── */}
            <div
              className="fade-up fade-up-1"
              style={{
                background: T.white,
                borderRadius: 24,
                border: `1.5px solid ${T.pinkBorder}`,
                overflow: "hidden",
                boxShadow:
                  "0 8px 40px rgba(233,30,140,0.10), 0 1px 0 rgba(255,255,255,0.9) inset",
              }}
            >
              {/* Cover banner */}
              <div
                style={{
                  height: 110,
                  position: "relative",
                  background: userProfile?.cover
                    ? `url(${userProfile.cover}) center/cover`
                    : `linear-gradient(135deg, #f9c5dd 0%, ${T.pink} 50%, #c4157a 100%)`,
                }}
              >
                {/* decorative dots */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      borderRadius: "50%",
                      width: 6 + i * 4,
                      height: 6 + i * 4,
                      background: "rgba(255,255,255,0.25)",
                      top: `${15 + i * 10}%`,
                      left: `${8 + i * 14}%`,
                      animation: `float ${2 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
                    }}
                  />
                ))}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.15))",
                  }}
                />
              </div>

              {/* Avatar + info */}
              <div style={{ padding: "0 28px 24px", position: "relative" }}>
                {/* Avatar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    marginTop: -44,
                  }}
                >
                  <div
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    {/* clickable photo */}
                    <div
                      className="photo-wrap"
                      onClick={() =>
                        !uploading && fileInputRef.current?.click()
                      }
                      style={{
                        width: 88,
                        height: 88,
                        borderRadius: "50%",
                        border: `4px solid ${T.white}`,
                        boxShadow: `0 0 0 3px ${T.pink}, 0 6px 24px ${T.pinkGlow}`,
                        cursor: uploading ? "not-allowed" : "pointer",
                        overflow: "hidden",
                        position: "relative",
                        animation: "pulseRing 2.8s ease-in-out infinite",
                      }}
                    >
                      <img
                        src={
                          userProfile?.photo ||
                          "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png"
                        }
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                          display: "block",
                        }}
                      />
                      {/* hover overlay */}
                      <div
                        className="photo-overlay"
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(233,30,140,0.62)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: uploading ? 1 : 0,
                          transition: "opacity 0.25s",
                          borderRadius: "50%",
                        }}
                      >
                        {uploading ? (
                          <div
                            style={{
                              width: 22,
                              height: 22,
                              border: "3px solid #fff",
                              borderTopColor: "transparent",
                              borderRadius: "50%",
                              animation: "spin 0.7s linear infinite",
                            }}
                          />
                        ) : (
                          <>
                            <span style={{ fontSize: 18 }}>📷</span>
                            <span
                              style={{
                                fontSize: 9,
                                color: "#fff",
                                fontWeight: 700,
                                marginTop: 2,
                                letterSpacing: "0.04em",
                              }}
                            >
                              CHANGE
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* camera badge */}
                    {!uploading && (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          position: "absolute",
                          bottom: 2,
                          right: 2,
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          background: T.pink,
                          border: `2px solid ${T.white}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          cursor: "pointer",
                          boxShadow: "0 2px 6px rgba(233,30,140,0.4)",
                        }}
                      >
                        📷
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handlePhotoChange}
                    />
                  </div>

                  {/* gender badge */}
                  {userProfile?.gender && (
                    <Badge>
                      {userProfile.gender === "female"
                        ? "♀ Female"
                        : userProfile.gender === "male"
                          ? "♂ Male"
                          : userProfile.gender}
                    </Badge>
                  )}
                </div>

                {/* error */}
                {photoError && (
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: 12,
                      color: "#e53e3e",
                      fontWeight: 600,
                    }}
                  >
                    ⚠ {photoError}
                  </p>
                )}

                {/* Name + username */}
                <div style={{ marginTop: 14 }}>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 24,
                      fontWeight: 900,
                      color: T.dark,
                      fontFamily: "'Playfair Display',serif",
                      letterSpacing: "-0.3px",
                      lineHeight: 1.15,
                    }}
                  >
                    {userProfile?.name || "—"}
                  </h2>
                  <p
                    style={{
                      margin: "3px 0 0",
                      fontSize: 13,
                      color: T.pink,
                      fontWeight: 700,
                      letterSpacing: "0.02em",
                    }}
                  >
                    @{userProfile?.username || "—"}
                  </p>
                </div>

                {/* Info rows */}
                <div
                  style={{
                    marginTop: 16,
                    borderRadius: 14,
                    overflow: "hidden",
                    background: T.pinkPale,
                    padding: "4px 14px",
                  }}
                >
                  <InfoRow icon="✉️" label="Email" value={userProfile?.email} />
                  <InfoRow icon="🎂" label="Birthday" value={dob} />
                  <InfoRow
                    icon="📅"
                    label="Joined"
                    value={joinDate ? `Member since ${joinDate}` : null}
                  />
                </div>
              </div>

              {/* Stats strip */}
              <div
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  borderTop: `1px solid ${T.pinkBorder}`,
                  background: `linear-gradient(to right,${T.pinkSoft},#fff8fb,${T.pinkSoft})`,
                  padding: "4px 8px",
                }}
              >
                <StatPill icon="📝" label="Posts" value={userPosts.length} />
                <div
                  style={{
                    width: 1,
                    background: T.pinkBorder,
                    margin: "8px 0",
                  }}
                />
                <StatPill
                  icon="👥"
                  label="Followers"
                  value={userProfile?.followersCount}
                />
                <div
                  style={{
                    width: 1,
                    background: T.pinkBorder,
                    margin: "8px 0",
                  }}
                />
                <StatPill
                  icon="➕"
                  label="Following"
                  value={userProfile?.followingCount}
                />
                <div
                  style={{
                    width: 1,
                    background: T.pinkBorder,
                    margin: "8px 0",
                  }}
                />
                <StatPill
                  icon="🔖"
                  label="Bookmarks"
                  value={userProfile?.bookmarksCount}
                />
              </div>
            </div>

            {/* ── Posts section ── */}
            <div
              className="fade-up fade-up-2"
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              {/* section header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: `linear-gradient(to right,${T.pink},transparent)`,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: T.pink,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Posts
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: `linear-gradient(to left,${T.pink},transparent)`,
                  }}
                />
              </div>

              {loading ? (
                [...Array(3)].map((_, i) => <PostSkeleton key={i} />)
              ) : userPosts.length === 0 ? (
                <div
                  style={{
                    background: T.white,
                    borderRadius: 20,
                    border: `2px dashed ${T.pinkBorder}`,
                    padding: "64px 24px",
                    textAlign: "center",
                    boxShadow: "inset 0 2px 12px rgba(233,30,140,0.04)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 52,
                      animation: "float 3s ease-in-out infinite",
                    }}
                  >
                    🌸
                  </div>
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: 900,
                      color: T.dark,
                      margin: "14px 0 6px",
                      fontFamily: "'Playfair Display',serif",
                    }}
                  >
                    Nothing here yet
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: T.muted,
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    Your posts will bloom here once you share something.
                  </p>
                </div>
              ) : (
                userPosts.map((post) => <PostCard key={post._id} post={post} />)
              )}
            </div>
          </main>

          {/* Right sidebar */}
          <aside style={{ position: "sticky", top: 28 }}>
            <FriendReq />
          </aside>
        </div>
      </div>
    </>
  );
};

export default UserPosts;
