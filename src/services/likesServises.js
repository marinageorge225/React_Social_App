import axios from "axios";

const baseurl = import.meta.env.VITE_BASE_URL;

export async function getAllLikes(postId) {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(
    `${baseurl}/posts/${postId}/likes?page=1&limit=20`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}

export async function toggleLike(postId) {
  const token = localStorage.getItem("token");
  const { data } = await axios.post(
    `${baseurl}/posts/${postId}/like`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}
