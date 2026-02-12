import "./EmployeeModal.css";
import { FaUserTie } from "react-icons/fa";
import type { UserRole } from "./EmployeeCard";

type Props = {
  name: string;
  role: UserRole;
  onClose: () => void;
};

const EmployeeModal = ({ name, role, onClose }: Props) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <FaUserTie />
        </div>

        <h2>{name}</h2>
        <p className="role-text">{role.toUpperCase()}</p>

        <div className="modal-actions">
          <button className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary">Edit Employee</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
