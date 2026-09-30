import './App.css'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import AppRoutes from './routes/AppRoutes'
import { BrowserRouter } from 'react-router-dom'

function App() {
  
   return (
    <BrowserRouter>
      <DashboardLayout>
        <AppRoutes />
      </DashboardLayout>
    </BrowserRouter>
  )
}

export default App
