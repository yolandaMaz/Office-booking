import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import NewBookingPage from './pages/NewBookingPage'
import MyBookingsPage from './pages/MyBookingsPage'


function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/new-booking" element={<NewBookingPage />} />
      <Route path="/my-bookings" element={<MyBookingsPage />} />
       </Route>
      </Routes>
  )
}

export default App;
