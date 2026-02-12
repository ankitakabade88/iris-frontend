import { useTheme } from "../context/Theme";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="card">
      <h2>Settings</h2>

      <div style={{ marginTop: "20px" }}>
        <label>
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />{" "}
          Dark Mode
        </label>
      </div>
    </div>
  );
}
