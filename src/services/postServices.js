import axios from "axios";

const baseurl = import.meta.env.VITE_BASE_URL;

export async function getAllPosts() {
  const token = localStorage.getItem("token");

  const data = await axios.get(`${baseurl}/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function getPostById(id) {
  const token = localStorage.getItem("token");

  const data = await axios.get(`${baseurl}/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function createPost(postData) {
  const token = localStorage.getItem("token");

  const data = await axios.post(`${baseurl}/posts`, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function getUserPosts() {
  const token = localStorage.getItem("token");

  const data = await axios.get(
    `${baseurl}/posts/feed?only=following&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
}
export async function deletePost(postId) {
  const token = localStorage.getItem("token");

  const data = await axios.delete(`${baseurl}/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}
export async function UpdatePost(postId, formData) {
  const token = localStorage.getItem("token");

  const data = await axios.put(`${baseurl}/posts/${postId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}
