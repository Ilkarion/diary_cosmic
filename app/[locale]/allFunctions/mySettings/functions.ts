import { API_URL } from "@/lib/api";

export async function deleteUser() {
  const res = await fetch(`${API_URL}/api/user-delete`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function changeUsername(username: string) {
  const res = await fetch(`${API_URL}/api/change-username`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
    }),
  });

  const data = await res.json(); //message:"Username updated"
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  const res = await fetch(`${API_URL}/api/change-password`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  const data = await res.json(); //message:"Password updated"
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function changeEmailRequest(newEmail: string) {
  const res = await fetch(`${API_URL}/api/change-email-request`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      newEmail,
    }),
  });

  const data = await res.json(); // message:"Confirm new email first"
  if (!res.ok) throw new Error(data.message);
  return data;
}
