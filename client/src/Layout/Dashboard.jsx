import { User } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'

function Dashboard() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleLogout = () => {
        logout()
        navigate('/')
    }
    return (
        <div>
            <main className='mx-auto px-3 lg:px-0'>
                <div className=' flex p-4 rounded border-b shadow-sm border-secondary items-center gap-2'>
                    <div className='bg-linear-to-br from-accent to-primary w-fit p-3 text-white rounded-full'><User /></div>
                    <div>
                        <span className='block'>{user?.email?.split("@")[0]}</span>
                        <span className='text-gray-400 text-sm'>{user?.role}</span>
                    </div>
                    <button className='ml-auto secondary-btn' onClick={handleLogout}>Logout</button>
                </div>
                <div className='pt-8 flex'>
                    <Sidebar />
                    <div className='flex-1 mx-6 md:mx-8 lg:mx-12'>
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Dashboard