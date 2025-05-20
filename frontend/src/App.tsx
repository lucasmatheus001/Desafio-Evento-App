import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import CreateEvent from "../src/pages/CreateEvent";
import EventDetail from "../src/pages/EventDetail";
import EditEvent from "../src/pages/EditEvent";
import Navbar from "../src/components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import MySubscriptions from "./pages/MySubscriptions";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/event/create' element={<CreateEvent />} />
        <Route path='/event/:uuid' element={<EventDetail />} />
        <Route path='/event/:uuid/edit' element={<ProtectedRoute><EditEvent /></ProtectedRoute>} />
        <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
        <Route path="/my-subscriptions" element={<MySubscriptions />} />
      </Routes>
    </BrowserRouter>
  );
}
