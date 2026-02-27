import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Services from './pages/Services'
import PlaceOrder from './pages/PlaceOrder'
import TrackOrder from './pages/TrackOrder'
import OrderSuccess from './pages/OrderSuccess'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="order" element={<PlaceOrder />} />
          <Route path="track" element={<TrackOrder />} />
          <Route path="order/success" element={<OrderSuccess />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
