import { useState } from "react";
import EmployeeCard from "../components/Employees/EmployeeCard";
import type { UserRole } from "../components/Employees/EmployeeCard";
import EmployeeModal from "../components/Employees/EmployeeModal";
import "../components/Employees/EmployeesGrid.css";

type User = {
  name: string;
  role: UserRole;
};

const users: User[] = [
  { name: "Ankita", role: "admin" },
  { name: "Rahul", role: "employee" },
  { name: "Priya", role: "employee" },
  { name: "Suresh", role: "employee" },
  { name: "Rohit", role: "employee" },
  { name: "Srushti", role: "employee" },
];

const EmployeePage = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <>
      <h2 className="page-title">Employees</h2>

      <div className="cards-grid">
        {users.map((user) => (
          <EmployeeCard
            key={user.name}
            name={user.name}
            onClick={() => setSelectedUser(user)}
          />
        ))}
      </div>

      {selectedUser && (
        <EmployeeModal
          name={selectedUser.name}
          role={selectedUser.role}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
};

export default EmployeePage;
