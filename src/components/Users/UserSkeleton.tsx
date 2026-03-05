import "./UserGrid.css";

export default function UserSkeleton() {
  return (
    <div className="user-card skeleton-card">

      <div className="user-profile">
        <div className="skeleton-avatar" />
        <div className="skeleton-name" />
      </div>

      <div className="user-meta">
        <div className="skeleton-badge" />
        <div className="skeleton-badge small" />
      </div>

    </div>
  );
}