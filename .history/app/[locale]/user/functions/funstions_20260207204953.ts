//get user info
export async function userInfo() {
  const res = await fetch("https://your-book-backend-1.onrender.com/api/me", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  });
  const data = await res.json()
  if(!res.ok) {
    console.log(data.message)
    return "No token"
  }
  return data; 
}
