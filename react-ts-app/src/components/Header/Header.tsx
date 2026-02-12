import { FaUserCircle} from "react-icons/fa";
import "./Header.css";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning!";
  if (hour < 17) return "Good Afternoon!";
  return "Good Evening!";
}

export default function Header() {
  const userName = localStorage.getItem("userName") || "User";
  const greeting = getGreeting();

  return (
    <header className="top-header">
      {/* LEFT */}
      <div className="header-left">
        <p className="greeting">
          {greeting} {" "}
          <span className="user-name">{userName}</span>
        </p>
      </div>

      {/* RIGHT */}
      <div className="header-right">
        <FaUserCircle className="profile-icon" />
      </div>
    </header>
  );
}
