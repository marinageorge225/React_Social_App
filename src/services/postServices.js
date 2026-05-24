import axios from "axios";

const baseurl = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");
export async function getAllPosts() {
  let data = await axios.get(`${baseurl}/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
}
