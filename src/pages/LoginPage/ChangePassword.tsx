import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/authApi";

import "../../assets/css/changePassword.css";
import { toast } from "react-toastify";

export default function ChangePassword(){

const navigate = useNavigate();

const [currentPassword,setCurrentPassword] = useState("");
const [newPassword,setNewPassword] = useState("");
const [confirmPassword,setConfirmPassword] = useState("");

const handleSubmit = async(e:any)=>{

e.preventDefault();

if(newPassword !== confirmPassword){
toast.error("Passwords do not match");
return;
}

try{

await api.post("/auth/change-password",{
currentPassword,
newPassword
});

toast.success("Password updated successfully");

navigate("/dashboard");

}catch(err){

toast.error("Failed to update password");

}

};

return(

<div className="change-password-page">

<div className="change-password-card">

<h2>Change Password</h2>

<form onSubmit={handleSubmit}>

<input
type="password"
placeholder="Current Password"
value={currentPassword}
onChange={(e)=>setCurrentPassword(e.target.value)}
required
/>

<input
type="password"
placeholder="New Password"
value={newPassword}
onChange={(e)=>setNewPassword(e.target.value)}
required
/>

<input
type="password"
placeholder="Confirm Password"
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
required
/>

<button type="submit">

Update Password

</button>

</form>

</div>

</div>

);

}