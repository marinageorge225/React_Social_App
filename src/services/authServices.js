import axios from "axios";

const baseurl = import.meta.env.VITE_BASE_URL;
export async function registerUser(body) {
  let data = await axios.post(`${baseurl}/users/signup`, body, {
    "Content-Type": "application/json",
  });

  return data;
}

export async function loginUser(body) {
  let data = await axios.post(`${baseurl}/users/signin`, body, {
    "Content-Type": "application/json",
  });

  return data;
}
