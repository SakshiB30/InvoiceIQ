import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import AppRoutes from './routes/AppRoutes'
import { fetchCurrentUser } from './redux/slices/authSlice'

function App() {
  const dispatch = useDispatch()

  const { token, user } = useSelector(
    (state) => state.auth,
  )

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchCurrentUser())
    }
  }, [token, user, dispatch])

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App