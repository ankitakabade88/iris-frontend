import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/authApi";
import { toast } from "react-toastify";

import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";

import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import "../../assets/css/login.css";

export default function SetPassword() {

  const [password,setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  const handleSubmit = async (e:React.FormEvent) => {

    e.preventDefault();

    if(!password){
      toast.error("Enter password");
      return;
    }

    if(password.length < 6){
      toast.error("Password must be at least 6 characters");
      return;
    }

    if(!token){
      toast.error("Invalid invite link");
      return;
    }

    try{

      setLoading(true);

      const res = await api.post("/auth/set-password",{
        token,
        password
      });

      const payload = res?.data;

      if(!payload?.user || !payload?.token){
        throw new Error("Invalid server response");
      }

      dispatch(
        loginSuccess({
          user: payload.user,
          token: payload.token
        })
      );

      localStorage.setItem("token",payload.token);
      localStorage.setItem("user",JSON.stringify(payload.user));
      localStorage.setItem("userName",payload.user.name);

      toast.success("Account activated successfully ✅");

      navigate("/dashboard",{replace:true});

    }
    catch(err:any){

      console.error("SET PASSWORD ERROR:",err);
      toast.error(err.message || "Failed to set password");

    }
    finally{
      setLoading(false);
    }

  };

  return(

    <div className="login-page">

      <div className="spotlight"></div>

      <div className="login-layout">

        {/* HERO SIDE */}

        <div className="hero-content">

          <h1>
            Room Booking <span>System</span>
          </h1>

          <p className="subtitle">
            Activate your account by setting a secure password.
          </p>

          <ul className="features">
            <li>Secure authentication</li>
            <li>Real-time room availability</li>
            <li>Admin dashboard & analytics</li>
          </ul>

        </div>


        {/* PASSWORD FORM */}

        <div className="login-container">

          <div className="login-card">

            <h2>Set Your Password</h2>

            <form onSubmit={handleSubmit}>

              <div className="input-box">

                <FaLock className="input-icon"/>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                />

                <span
                  className="password-toggle"
                  onClick={()=>setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash/> : <FaEye/>}
                </span>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="login-button"
              >
                {loading ? "Saving..." : "Set Password"}
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>

  );
}