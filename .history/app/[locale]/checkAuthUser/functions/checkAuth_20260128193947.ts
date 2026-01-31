export async function userInfoCheck() {
  const res = await fetch("http://localhost:3001/api/me", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  })
  return res.status; 
}
