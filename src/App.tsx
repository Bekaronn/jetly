import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from "./components/Navbar.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Booking from "./pages/Booking.tsx";
import Register from "./pages/Register.tsx";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/booking" element={<Booking />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
