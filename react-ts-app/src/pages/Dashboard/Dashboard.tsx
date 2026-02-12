import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

import {
  FaDoorOpen,
  FaUsers,
  FaCheckCircle,
  FaCalendarAlt,
} from "react-icons/fa";

type StatItem = {
  id: number;
  title: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
  hint?: string;
  route: string;
};

const dashboardStats: StatItem[] = [
  {
    id: 1,
    title: "Total Rooms",
    value: 6,
    icon: <FaDoorOpen />,
    colorClass: "blue",
    hint: "+1 added this month",
    route: "/rooms",
  },
  {
    id: 2,
    title: "Employees",
    value: 6,
    icon: <FaUsers />,
    colorClass: "green",
    hint: "Stable",
    route: "/employees",
  },
  {
    id: 3,
    title: "Available Rooms",
    value: 4,
    icon: <FaCheckCircle />,
    colorClass: "purple",
    hint: "3 booked",
    route: "/rooms",
  },
  {
    id: 4,
    title: "Today's Meetings",
    value: 4,
    icon: <FaCalendarAlt />,
    colorClass: "orange",
    hint: "Next at 2:00 PM",
    route: "/rooms",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats(dashboardStats);
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="dashboard">
      <h2 className="page-title">Dashboard Overview</h2>

      <div className="stats-grid">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="stat-card skeleton" />
            ))
          : stats.map((item) => (
              <div
                key={item.id}
                className="stat-card glass-card"
                role="button"
                tabIndex={0}
                onClick={() => navigate(item.route)}
                onKeyDown={(e) =>
                  e.key === "Enter" && navigate(item.route)
                }
              >
                <div className={`stat-icon ${item.colorClass}`}>
                  {item.icon}
                </div>

                <h4>{item.title}</h4>
                <p className="stat-value">{item.value}</p>

                {item.hint && (
                  <span className="stat-hint">{item.hint}</span>
                )}
              </div>
            ))}
      </div>
    </div>
  );
}
