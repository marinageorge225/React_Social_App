import axios from "axios";

const baseurl = import.meta.env.VITE_BASE_URL;

export async function getAllComments(postId, page = 1, limit = 10) {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(
    `${baseurl}/posts/${postId}/comments?page=${page}&limit=${limit}`,
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
  const token = localStorage.getItem("token");
  const { data } = await axios.post(
    `${baseurl}/posts/${postId}/comments`,
    commentData,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}
