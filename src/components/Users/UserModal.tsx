import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserTie, FaTrash } from "react-icons/fa";

import { useAppDispatch } from "../../store/hooks";
import { deleteUser } from "../../store/userSlice";

import "./UserModal.css";

type UserRole = "admin" | "employee";

type Props = {
  id: string;
  name: string;
  role: UserRole;
  isAdmin: boolean;
  onClose: () => void;
};

export default function UserModal({
  id,
  name,
  role,
  isAdmin,
  onClose,
}: Props) {
  const dispatch = useAppDispatch();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  /* =====================================================
     ESC CLOSE + BODY LOCK
  ===================================================== */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    setTimeout(() => closeBtnRef.current?.focus(), 120);

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  /* =====================================================
     DELETE USER (REDUX)
  ===================================================== */
  const handleDelete = async () => {
    const ok = window.confirm("Delete this user?");
    if (!ok) return;

    try {
      await dispatch(deleteUser(id)).unwrap();
      onClose(); // optimistic UI already handled in slice
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /* =====================================================
     UI
  ===================================================== */
  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={onClose}
      >
        <motion.div
          className="modal-card"
          onMouseDown={(e) => e.stopPropagation()}
          initial={{ y: 20, scale: 0.96, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 20, scale: 0.96, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          {/* PROFILE */}
          <div className="modal-profile">
            <div className="modal-icon">
              <FaUserTie />
            </div>

            <h2>{name}</h2>

            <span className={`role-chip ${role}`}>
              {role === "admin" ? "Administrator" : "Employee"}
            </span>
          </div>

          {/* ACTIONS */}
          <div className="modal-actions">
            <button
              ref={closeBtnRef}
              className="btn primary"
              onClick={onClose}
            >
              Close
            </button>

            {isAdmin && role !== "admin" && (
              <button
                className="btn danger"
                onClick={handleDelete}
              >
                <FaTrash /> Delete
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}