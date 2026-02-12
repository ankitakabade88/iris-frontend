import "./Profile.css";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="profile-page">
      <h2>My Profile</h2>

      <div className="profile-card">
        <div className="avatar">
          {user.fullName?.charAt(0)}
        </div>

        <div className="profile-info">
          <div>
            <label>Full Name</label>
            <p>{user.fullName}</p>
          </div>

          <div>
            <label>Email</label>
            <p>{user.email}</p>
          </div>

          <div>
            <label>Role</label>
            <p>{user.role}</p>
          </div>

          <div>
            <label>Joined</label>
            <p>{user.joined}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
