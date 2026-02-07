export async function userInfoCheck() {
  const res = await fetch("https://your-book-backend-1.onrender.com/api/me", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  })
  return res.status; 
}
