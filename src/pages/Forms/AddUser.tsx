import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createUser } from "../../store/userSlice";
import { toast } from "react-toastify";
import "./AddUser.css";

export default function AddUser() {

const navigate = useNavigate();
const dispatch = useAppDispatch();

/* ================= REDUX STATE ================= */

const creating = useAppSelector(
(state) => state.users.creating
);

/* ================= LOCAL STATE ================= */

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

/* ================= EMAIL VALIDATION ================= */

const validateEmail = (value: string) =>
/^[^\s@]+@[^\s@]+.[^\s@]+$/.test(value);

/* ================= SUBMIT ================= */

const handleSubmit = async (e: React.FormEvent) => {

e.preventDefault();

if (creating) return;

setError("");

/* ---- validation ---- */

if (!name.trim() || !email.trim() || !password.trim()) {
setError("All fields are required");
return;
}

if (!validateEmail(email)) {
setError("Enter a valid email address");
return;
}

if (password.length < 6) {
setError("Password must be at least 6 characters");
return;
}

try {

await dispatch(
createUser({
name: name.trim(),
email: email.trim(),
password: password.trim(),
})
).unwrap();

toast.success("User created. Temporary password sent by email 📧");

/* reset form */
setName("");
setEmail("");
setPassword("");

/* redirect */
navigate("/users");

} catch (err) {

const message =
typeof err === "string"
? err
: "User creation failed";

setError(message);
toast.error(message);
}

};

/* ================= CLOSE ================= */

const closeModal = () => {
if (!creating) navigate(-1);
};

/* ================= UI ================= */

return (

<div className="adduser-overlay" onClick={closeModal}>

<div
className="adduser-modal"
onClick={(e) => e.stopPropagation()}
>

<h2>Add New User</h2>

<p className="subtitle">
Create an employee account and assign a temporary password.
</p>

<form onSubmit={handleSubmit} className="form-grid">

{/* NAME */}

<div className="form-group">
<label>Name</label>

<input
placeholder="Enter full name"
value={name}
onChange={(e) => setName(e.target.value)}
disabled={creating}
/>

</div>

{/* EMAIL */}

<div className="form-group">
<label>Email</label>

<input
type="email"
placeholder="Enter email address"
value={email}
onChange={(e) => setEmail(e.target.value)}
disabled={creating}
/>

</div>

{/* TEMP PASSWORD */}

<div className="form-group">
<label>Temporary Password</label>

<input
type="password"
placeholder="Enter temporary password"
value={password}
onChange={(e) => setPassword(e.target.value)}
disabled={creating}
/>

</div>

{error && <p className="error">{error}</p>}

<div className="modal-actions">

<button
type="button"
className="cancel-btn"
onClick={closeModal}
disabled={creating}

>

Cancel </button>

<button
type="submit"
className="submit-btn"
disabled={creating}

>

{creating ? "Creating..." : "Create User"} </button>

</div>

</form>

</div>

</div>

);
}
