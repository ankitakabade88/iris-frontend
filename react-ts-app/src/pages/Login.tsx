import { useState } from "react";
import { Link } from "react-router-dom";

type Props = {
  onLogin: () => void;
};

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("All fields are required");
      return;
    }

    // Extract name from email (before @)
    const userName = email.split("@")[0];

    // Store auth + username
    localStorage.setItem("auth", "true");
    localStorage.setItem("userName", userName);

    console.log("Login Data:", { email, password });

    onLogin();
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Welcome Back!</h2>
        <p className="auth-subtitle">Login to your account</p>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="primary-btn">
          Login
        </button>

        <p className="auth-footer">
          New user? <Link to="/">Register</Link>
        </p>
      </form>
    </div>
  );
}
