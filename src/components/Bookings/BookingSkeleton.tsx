import "./BookingSkeleton.css";

type Props = {
  rows?: number;
};

export default function BookingSkeleton({ rows = 6 }: Props) {
  return (
    <table className="booking-table">
      <thead>
        <tr>
          <th>Employee</th>
          <th>Room</th>
          <th>Date</th>
          <th>Start</th>
          <th>End</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            <td><div className="skeleton-cell" /></td>
            <td><div className="skeleton-cell" /></td>
            <td><div className="skeleton-cell" /></td>
            <td><div className="skeleton-cell" /></td>
            <td><div className="skeleton-cell" /></td>
            <td><div className="skeleton-badge" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}