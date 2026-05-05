import { Routes, Route } from 'react-router'
import Login from './components/pages/login'
import Register from './components/pages/register'
import useUserStore from './store/user-store'
import { useNavigate } from 'react-router'
import { useEffect } from 'react'
import useLoaderStore from './store/useLoaderStore'
import Loader from './components/loader'
import { Toaster } from './components/ui/sonner'
import { useQuery } from '@tanstack/react-query'
import { getMe } from './utils/query-functions'
import Home from './components/pages/home'
import Dashboard from './components/pages/dashboard'
import { AdminPanel } from './components/pages/admin-panel'

export default function App() {

  const { user, setUser } = useUserStore(state => state)
  const { isLoading, text } = useLoaderStore(state => state)
  const { data: nested, isPending, isError } = useQuery({ queryFn: () => getMe(), queryKey: ["user", "me"], refetchOnMount: true, retry: false })
  const navigate = useNavigate()

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
  }, [isError]);

  useEffect(() => {
    if (nested?.data?.data) {
      setUser(nested.data.data);
      navigate("/");
    }
  }, [nested]);
  
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin-panel" element={user?.role.toLowerCase() === "admin" ? <AdminPanel /> : <Dashboard/>} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      {(isLoading || isPending) && <Loader text={text} />}
      <Toaster position="top-right" />
    </>
  )
}
