import axios from "axios";

const baseurl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");

export async function getAllComments(postId) {
  let data = await axios.get(
    `${baseurl}/posts/${postId}/comments?page=1&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  return data;
}

export async function createComment(postId, commentData) {
  let data = await axios.post(
    `${baseurl}/posts/${postId}/comments`,
    commentData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return data;
}
