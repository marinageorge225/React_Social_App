import React, { useEffect, useState } from "react";
import PostCard from "../../components/PostCard/PostCard";
import SideBar from "../../components/SideBar/SideBar";
import FriendReq from "../../components/FriendReq/FriendReq";
import { getAllPosts } from "../../services/postServices";
import PostSkeleton from "../../components/Skeletons/PostSkeleton";
import CreatePost from "../../components/CreatePost/CreatePost";

export default function NewsFeed() {
  const [posts, setPosts] = useState([]);
  async function fetchAllPosts() {
    const response = await getAllPosts();
    setPosts(response.data.data.posts);
  }
  useEffect(() => {
    fetchAllPosts();
  }, []);
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #FFF0F3 0%, #FFE4EC 100%)",
        fontFamily: "'Nunito', 'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "20px 16px",
          display: "grid",
          gridTemplateColumns: "300px 1fr 300px",
          gap: "16px",
          alignItems: "start",
        }}
      >
        {/* Left sidebar */}
        <aside>
          <SideBar />
        </aside>

        {/* Center feed */}

        <main style={{ minWidth: 0 }}>
          <CreatePost fetchAllPosts={fetchAllPosts} />
          {posts.length > 0 ? (
            <>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </>
          ) : (
            [...Array(3)].map((_, index) => <PostSkeleton key={index} />)
          )}
        </main>

        {/* Right panel */}
        <aside>
          <FriendReq />
        </aside>
      </div>
    </div>
  );
}
