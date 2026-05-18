import axios from "axios";

export async function registerUser(body) {
  let data = await axios.post(
    "https://route-posts.routemisr.com/users/signup",
    body,
    {
      "Content-Type": "application/json",
    },
  );

  return data;
}

export async function loginUser(body) {
  let data = await axios.post(
    "https://route-posts.routemisr.com/users/signin",
    body,
    {
      "Content-Type": "application/json",
    },
  );

  return data;
}
