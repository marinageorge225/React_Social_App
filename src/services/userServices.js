import axios from "axios";

const baseurl = import.meta.env.VITE_BASE_URL;

export async function getUserProfile() {
  const token = localStorage.getItem("token");

  const data = await axios.get(`${baseurl}/users/profile-data`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function UploadProfilePicture(photo) {
  const token = localStorage.getItem("token");

  const data = await axios.put(`${baseurl}/users/upload-photo`, photo, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function getUnreadNotifications() {
  const token = localStorage.getItem("token");

  const data = await axios.get(`${baseurl}/notifications/unread-count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function getNotificationsContent() {
  const token = localStorage.getItem("token");

  const data = await axios.get(
    `${baseurl}/notifications?unread=false&page=1&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
}
export async function markAllNotificationsRead() {
  const token = localStorage.getItem("token");

  return axios.patch(
    `${baseurl}/notifications/read-all`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}
