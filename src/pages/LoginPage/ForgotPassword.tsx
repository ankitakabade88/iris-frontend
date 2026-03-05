import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";

import "../../assets/css/login.css";

export default function ForgotPassword() {

  const [email,setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();

    console.log("Reset link sent to:",email);
  };

  return(

    <div className="login-page">

      <div className="spotlight"></div>

      <div className="login-layout">

        {/* HERO */}
        <div className="hero-content">

          <h1>
            Room Booking <span>System</span>
          </h1>

          <p className="subtitle">
            Manage meeting rooms and schedule workspaces effortlessly.
          </p>

          <ul className="features">
            <li>Real-time room availability</li>
            <li>Easy meeting scheduling</li>
            <li>Admin dashboard & analytics</li>
          </ul>

        </div>


        {/* FORM */}
        <div className="login-container">

          <div className="login-card">

            <h2>Reset Password</h2>

            <form onSubmit={handleSubmit}>

              <div className="input-box">

                <FaEnvelope className="input-icon"/>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  required
                />

              </div>

              <button
                type="submit"
                className="login-button"
              >
                Send Reset Link
              </button>

            </form>

            <div className="forgot-password">

              <button
                onClick={()=>navigate("/login")}
              >
                Back to Login
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}