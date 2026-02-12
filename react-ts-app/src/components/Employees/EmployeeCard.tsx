import { FaUserTie } from "react-icons/fa";
import "./EmployeeCard.css";

export type UserRole = "admin" | "employee";

type Props = {
  name: string;
  onClick: () => void;                                            //event handling
};

const EmployeeCard = ({ name, onClick }: Props) => {
  return (
    <div className="employee-card" onClick={onClick}>
      <div className="employee-icon">
        <FaUserTie />
      </div>

      <h3>{name}</h3>
    </div>
  );
};

export default EmployeeCard;
