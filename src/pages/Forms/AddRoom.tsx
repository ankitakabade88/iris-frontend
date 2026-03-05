import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../../store/hooks";
import { createRoom } from "../../store/roomSlice";

import "./AddRoom.css";

export default function AddRoom() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    name: "",
    type: "conference",
    capacity: "",
    location: "",
  });

  /* ================= CHANGE ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= VALIDATION ================= */
  const isFormValid =
    form.name.trim() !== "" &&
    form.capacity !== "" &&
    form.location.trim() !== "";

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      await dispatch(
        createRoom({
          ...form,
          capacity: Number(form.capacity),
        })
      ).unwrap();

      // instantly go back — data already updated
      navigate("/rooms");
    } catch (err) {
      console.error(err);
      alert("Failed to create room");
    }
  };

  return (
    <div className="add-room-page">
      <div className="add-room-overlay">

        <form className="add-room-card" onSubmit={handleSubmit}>
          <h2 className="add-room-title">Add New Room</h2>

          <div className="form-grid">

            <div className="form-group">
              <label>Room Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Room Type *</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <option value="conference">Conference</option>
                <option value="meeting">Meeting</option>
                <option value="training">Training</option>
              </select>
            </div>

            <div className="form-group">
              <label>Capacity *</label>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/rooms")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-btn"
              disabled={!isFormValid}
            >
              Create Room
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}