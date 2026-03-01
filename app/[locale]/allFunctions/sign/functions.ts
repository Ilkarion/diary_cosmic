export type FormFields = {
  username?: string;
  email?: string;
  password?: string;
};

export function validate(data: FormFields, isLogin: boolean): string[] {
  const errors: string[] = [];

  // USERNAME (only register)
  if (!isLogin) {
    if (!data.username || data.username.trim() === "") {
      errors.push("Username is required");
    } else if (data.username.length < 2) {
      errors.push("Username must be at least 2 characters");
    } else if (data.username.length > 12) {
      errors.push("Username must be less than 12 characters");
    } else if (/\d/.test(data.username)) {
      errors.push("Username cannot contain numbers");
    }
  }

  // EMAIL
  if (!data.email || data.email.trim() === "") {
    errors.push("Email is required");
  } else if (!data.email.endsWith("@gmail.com")) {
    errors.push("Email must end with @gmail.com");
  }

  // PASSWORD
  if (!data.password || data.password.trim() === "") {
    errors.push("Password is required");
  } else if (data.password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  return errors;
}


//BackEnd sending data
export async function registerUser(username: string, email: string, password: string) {
  try {
    const res = await fetch("https://your-book-backend.onrender.com/api/register", {
      method: "POST",
      credentials: "include", // accept cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const json = await res.json();
    return { ok: res.ok, ...json };
  } catch (err) {
    return { ok: false, message: err };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const res = await fetch("https://your-book-backend.onrender.com/api/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();
    return { ok: res.ok, ...json };
  } catch (err) {
    return { ok: false, message: err };
  }
}


//validation errors from server
export function validateErrorsServer(error:string) {
  if(error === `duplicate key value violates unique constraint "unique_email"`) {
    return "User with this Gmail already registered. Try Login or Register with new Gmail."
  }else if(error === `duplicate key value violates unique constraint "users_user name_key"`) {
    return "User with this name already exists."
  }else if(error=== `Invalid email or password`){
    return "Register or invalid email/password.\nOr database was temporary stopped."
  }else if(error===`Email not confirmed`) {
    return "Email not confirmed"
  }
  else {
    return "Unknown error or Server dont work. Not your fault ;)"
  }
}