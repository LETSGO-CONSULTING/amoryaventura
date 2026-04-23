import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from '@/layout/MainLayout'
import Home from '@/pages/Home/Home'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
