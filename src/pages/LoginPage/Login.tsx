import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import api from "../../api/authApi";
import { loginSuccess } from "../../store/authSlice";

import { toast } from "sonner";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

import "../../assets/css/login.css";

export default function Login() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [showPassword,setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if(loading) return;

    if(!email.trim() || !password.trim()){
      toast.error("Enter email and password");
      return;
    }

    try{

      setLoading(true);

      /* Because interceptor returns response.data */
      const res = await api.post<{
        success:boolean;
        message:string;
        token:string;
        user:any;
      }>("/auth/login",{
        email,
        password
      });

      const { token, user } = res;

      /* Save token */
      localStorage.setItem("token",token);

      /* Update Redux */
      dispatch(loginSuccess({
        token,
        user
      }));

      toast.success("Welcome back 🚀");

      /* Redirect logic */

      if(user.mustChangePassword){
        navigate("/change-password",{replace:true});
        return;
      }

      navigate("/dashboard",{replace:true});

    }
    catch(err:any){

      toast.error(
        err?.message || "Login failed"
      );

    }
    finally{
      setLoading(false);
    }

  };

  return (

    <div className="login-page">

      <div className="spotlight"></div>

      <div className="login-layout">

        {/* LEFT HERO */}

        <div className="hero-content">

          <h1>
            Room Booking <br/>
            <span>System</span>
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

        {/* RIGHT LOGIN */}

        <div className="login-container">

          <form
            className="login-card"
            onSubmit={handleSubmit}
          >

            <h2>Welcome Back</h2>

            {/* EMAIL */}

            <div className="input-box">

              <FaEnvelope className="input-icon"/>

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
              />

            </div>

            {/* PASSWORD */}

            <div className="input-box">

              <FaLock className="input-icon"/>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
              />

              <span
                className="password-toggle"
                onClick={()=>setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash/> : <FaEye/>}
              </span>

            </div>

            {/* FORGOT PASSWORD */}

            <div className="forgot-password">

              <button
                type="button"
                onClick={()=>navigate("/forgotpassword")}
              >
                Forgot password?
              </button>

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading
                ? <span className="spinner"></span>
                : "Login"
              }

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}