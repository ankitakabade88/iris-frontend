import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/authApi";

import { FaDoorOpen, FaCalendarAlt } from "react-icons/fa";
import { FaUsers, FaCalendarCheck, FaChalkboardTeacher } from "react-icons/fa";

import RoomCard from "../../components/Rooms/RoomCard";
import type { Room } from "../../components/Rooms/RoomCard";
import RoomModal from "../../components/Rooms/RoomModal";

import BookingCard from "../../components/Bookings/BookingCard";
import BookingModal from "../../components/Bookings/BookingModal";

import "./Dashboard.css";

/* ================= TYPES ================= */

type Booking = {
  _id: string;
  date: string;
  startTime: string;
  endTime?: string;
  purpose?: string;

  room?: {
    _id: string;
    name: string;
  };

  employee?: {
    _id: string;
    name: string;
  };
};

export default function Dashboard() {

const navigate = useNavigate();

const [rooms,setRooms] = useState<Room[]>([]);
const [bookings,setBookings] = useState<Booking[]>([]);
const [activeIndex,setActiveIndex] = useState(0);
const [selectedRoom,setSelectedRoom] = useState<Room | null>(null);
const [selectedBooking,setSelectedBooking] = useState<any | null>(null);

/* ================= CAROUSEL ================= */

const sliderTimer = useRef<ReturnType<typeof setInterval> | null>(null);

const startAutoSlide = () => {

if(sliderTimer.current) clearInterval(sliderTimer.current);

sliderTimer.current = setInterval(()=>{
setActiveIndex(prev => (prev + 1) % rooms.length);
},3500);

};

const stopAutoSlide = () => {

if(sliderTimer.current) clearInterval(sliderTimer.current);

};

useEffect(()=>{
if(!rooms.length) return;
startAutoSlide();
return ()=>stopAutoSlide();
},[rooms]);

const next = ()=> setActiveIndex(prev => (prev + 1) % rooms.length);
const prev = ()=> setActiveIndex(prev => (prev - 1 + rooms.length) % rooms.length);

const [, setTick] = useState(0)
useEffect(()=>{
const timer = setInterval(()=>{
setTick(v=>v+1)
},1000)

return ()=>clearInterval(timer)
},[])
/* ================= FETCH ROOMS ================= */

const fetchRooms = useCallback(async()=>{
try{
const res = await api.get("/rooms");
setRooms(res.data || []);
}catch(err){
console.error("Rooms error:",err);
}
},[]);

/* ================= FETCH BOOKINGS ================= */
/* shortened explanation: code fixed */

const fetchBookings = useCallback(async () => {

try {

const role = localStorage.getItem("user")
? JSON.parse(localStorage.getItem("user")!).role
: "employee";

const endpoint =
role === "admin"
? "/bookings"
: "/bookings/my";

const res = await api.get(endpoint);

const now = Date.now();

const upcoming = (res.data || [])
.filter((b:Booking)=>{

if(!b.date || !b.startTime) return false;

const start = new Date(`${b.date.split("T")[0]}T${b.startTime}`).getTime();

return start >= now;

})
.sort((a:Booking,b:Booking)=>{

const aTime = new Date(`${a.date.split("T")[0]}T${a.startTime}`).getTime();
const bTime = new Date(`${b.date.split("T")[0]}T${b.startTime}`).getTime();

return aTime - bTime;

});

setBookings(upcoming);

} catch(err){

console.error("Booking error:",err);

}

},[]);

const getMeetingStatus = (booking:Booking) => {

const now = Date.now()

const start = new Date(`${booking.date.split("T")[0]}T${booking.startTime}`).getTime()

const end = booking.endTime
? new Date(`${booking.date.split("T")[0]}T${booking.endTime}`).getTime()
: start + 60 * 60 * 1000

if(now >= start && now <= end) return "Live"

if(now > end) return "Completed"

return "Upcoming"

}
const getCountdown = (booking:Booking) => {

const now = Date.now()

const start = new Date(`${booking.date.split("T")[0]}T${booking.startTime}`).getTime()

const diff = start - now

if(diff <= 0) return ""

const days = Math.floor(diff / (1000*60*60*24))
const hrs = Math.floor((diff % (1000*60*60*24))/(1000*60*60))
const mins = Math.floor((diff % (1000*60*60))/(1000*60))
const secs = Math.floor((diff % (1000*60))/1000)

if(days > 0) return `${days}d ${hrs}h`
if(hrs > 0) return `${hrs}h ${mins}m`
return `${mins}m ${secs}s`

}

/* ================= INITIAL LOAD ================= */

useEffect(()=>{
fetchRooms();
fetchBookings();
},[fetchRooms,fetchBookings]);

/* ================= AUTO REFRESH ================= */

useEffect(()=>{

const interval = setInterval(()=>{
fetchRooms();
fetchBookings();
},15000);

return ()=>clearInterval(interval);

},[fetchRooms,fetchBookings]);

/* ================= ROOM BUSY ================= */

const isRoomBusy = (roomId?:string)=>{

if(!roomId) return false;

const now = new Date();

return bookings.some((b)=>{

if(!b.room) return false;

const start = new Date(`${b.date.split("T")[0]}T${b.startTime}`);
const end = b.endTime
? new Date(`${b.date.split("T")[0]}T${b.endTime}`)
: new Date(start.getTime()+3600000);

return (
b.room._id === roomId &&
now >= start &&
now <= end
);

});

};

/* ================= RENDER ================= */

return (

<div className="dashboard-page">

{/* HEADER */}

<div className="dashboard-header">

<div>
<h1>Dashboard <span>Overview</span></h1>
<p>Manage rooms, meetings and availability easily.</p>
</div>

<div className="quick-actions">

<button
className="add-room"
onClick={()=>navigate("/add-room")}
>
+ Add Room
</button>

<button
className="book-room"
onClick={()=>navigate("/book-room")}
>
Book Room
</button>

</div>

</div>


{/* STATS */}

<div className="dashboard-stats">

<div className="stat-card" onClick={()=>navigate("/rooms")}>
<div className="stat-icon"><FaDoorOpen/></div>
<div>
<h3>Total Rooms</h3>
<p>{rooms.length}</p>
</div>
</div>

<div className="stat-card" onClick={()=>navigate("/bookings")}>
<div className="stat-icon"><FaCalendarAlt/></div>
<div>
<h3>Upcoming Meetings</h3>
<p>{bookings.length}</p>
</div>
</div>

</div>


{/* FEATURED ROOMS */}

<div className="featured-section">

<div className="feature-content">

<h2>Featured <span>Rooms</span></h2>

<div className="feature-cards">

<div className="feature-card">
<div className="feature-icon"><FaDoorOpen/></div>
<div>
<h4>Smart Rooms</h4>
<p>Modern meeting facilities.</p>
</div>
</div>

<div className="feature-card">
<div className="feature-icon"><FaCalendarCheck/></div>
<div>
<h4>Quick Booking</h4>
<p>Reserve instantly.</p>
</div>
</div>

<div className="feature-card">
<div className="feature-icon"><FaChalkboardTeacher/></div>
<div>
<h4>Flexible Spaces</h4>
<p>Conference & training rooms.</p>
</div>
</div>

<div className="feature-card">
<div className="feature-icon"><FaUsers/></div>
<div>
<h4>Team Collaboration</h4>
<p>Perfect for productive meetings.</p>
</div>
</div>

</div>

<button
className="explore-rooms-btn"
onClick={()=>navigate("/rooms")}
>
Explore Rooms
</button>

</div>


{/* ROOM SLIDER */}

<div
className="depth-slider"
onMouseEnter={stopAutoSlide}
onMouseLeave={startAutoSlide}
>

<button className="slider-btn left" onClick={prev}>‹</button>
<button className="slider-btn right" onClick={next}>›</button>

{rooms.map((room,index)=>{

const offset = (index - activeIndex + rooms.length) % rooms.length;

let position = "hidden";

if(offset === 0) position="center";
else if(offset === 1) position="right";
else if(offset === rooms.length-1) position="left";

return(

<div key={room._id} className={`depth-card ${position}`}>

<RoomCard
room={{
...room,
isAvailable: !isRoomBusy(room._id)
}}
onClick={(room)=>setSelectedRoom(room)}
/>

</div>

);

})}

</div>

</div>


{/* UPCOMING MEETINGS */}

<div className="meetings-section">

<div className="meetings-cards">

{bookings.length > 0 ? (

bookings.slice(0,3).map((booking)=>{

const status = getMeetingStatus(booking)
const countdown = getCountdown(booking)

return(

<div className="meeting-card-wrapper" key={booking._id}>

<BookingCard
_id={booking._id}
room={booking.room?.name || "Unknown Room"}
employee={booking.employee?.name || "Admin"}
date={new Date(booking.date).toLocaleDateString()}
startTime={booking.startTime}
endTime={booking.endTime ?? ""}
purpose={booking.purpose || "Meeting"}
status={status}
onClick={()=>setSelectedBooking(booking)}
onEdit={()=>{}}
onCancel={()=>{}}
/>

{status === "Upcoming" && countdown && (

<div className="meeting-countdown-badge">
⏳ Starts in {countdown}
</div>

)}

{status === "Live" && (

<div className="meeting-live-badge">
🔴 Live Now
</div>

)}

</div>

)

})
): (

<div className="empty-meetings">

<FaCalendarAlt className="empty-icon"/>

<h3>No Upcoming Meetings</h3>

<p>Your scheduled meetings will appear here.</p>

</div>

)}

</div>


{/* RIGHT SIDE INFO */}

<div className="meeting-details">

<h2>Upcoming <span>Meetings</span></h2>

<p>
Track scheduled meetings happening soon in your workspace.
</p>

<div className="meeting-feature">
<div className="meeting-icon"><FaCalendarAlt/></div>
<div>
<h4>Live Schedule</h4>
<p>See upcoming meetings in real time.</p>
</div>
</div>

<div className="meeting-feature">
<div className="meeting-icon"><FaUsers/></div>
<div>
<h4>Team Meetings</h4>
<p>Monitor collaborative discussions.</p>
</div>
</div>

<div className="meeting-feature">
<div className="meeting-icon"><FaDoorOpen/></div>
<div>
<h4>Room Tracking</h4>
<p>Know which rooms are reserved next.</p>
</div>
</div>

<button
className="view-bookings-btn"
onClick={()=>navigate("/bookings")}
>
View All Bookings
</button>

</div>

</div>


{/* MODALS */}

{selectedRoom && (
<RoomModal
room={selectedRoom}
onClose={()=>setSelectedRoom(null)}
/>
)}

{selectedBooking && (
<BookingModal
booking={selectedBooking}
onClose={()=>setSelectedBooking(null)}
/>
)}

</div>

);

}