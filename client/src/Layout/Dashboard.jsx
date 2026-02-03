import { Blend, LogOut, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Dashboard/Sidebar'
import { useEffect, useRef, useState } from 'react'

function Dashboard() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [profilePop, openProfile] = useState(false)

    const profileRef = useRef(null)

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                openProfile(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div>
            <main className='mx-auto px-0'>
                <div className='fixed z-10 bg-bg top-0 w-full flex p-4 rounded border-b shadow-sm border-secondary items-center gap-2'>
                    <div>
                        <Link to='/'>
                            <h1 className='flex font-semibold items-center gap-1'>
                                <span><Blend className='text-accent' /></span>
                                <span className='hidden md:block'>Social</span>
                            </h1>
                        </Link>
                    </div>
                    <div ref={profileRef} className="ml-auto relative">
                        <button onClick={() => openProfile(!profilePop)} className='bg-linear-to-br from-accent to-primary w-fit ml-auto p-3 text-white rounded-full cursor-pointer'><User /></button>
                        <div className={`font-semibold text-accent shadow-lg user-btn bg-white w-32 h-fit absolute top-14 flex flex-col gap-1 right-0 rounded-lg duration-150 origin-top-right overflow-hidden p-1 ${profilePop ? "scale-102" : "scale-0"}`}>
                            <button className='flex  gap-1 items-center justify-center px-3 py-2 rounded bg-secondary'>
                                <User />
                                <span>Profile</span>
                            </button>
                            <button onClick={handleLogout} className=' cursor-pointer flex  gap-1 items-center justify-center px-3 py-2 rounded bg-secondary'>
                                <LogOut />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>

                </div>
                <div className='pt-26 flex'>
                    <Sidebar />
                    <div className='flex-1 mx-6 md:mx-8 lg:mx-12'>
                        <Outlet />
                    </div>
                </div>
            </main >
        </div >
    )
}

export default Dashboard