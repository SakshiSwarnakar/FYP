import { Link, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { Megaphone, PartyPopper, UsersRound } from 'lucide-react'

function Sidebar() {
    const { user } = useAuth()
    const location = useLocation()

    if (user?.role == 'ADMIN') {
        return (
            <div className='space-y-1 w-12 md:w-1/8 border-r border-secondary flex flex-col'>
                <Link to='/dashboard' className={`tab-btn ${location.pathname == "/dashboard" ? "border-l-6 border-accent font-semibold" : ""}`}>
                    <PartyPopper size={20} />
                    <span className='hidden md:inline'>My Events</span>
                </Link>
                <Link to='create-campaign' className={`tab-btn ${location.pathname == "/dashboard/create-campaign" ? "border-l-6 border-accent font-semibold" : ""}`}>
                    <Megaphone size={20} />
                    <span className='hidden md:inline'>Create Event</span></Link>
                <button className='tab-btn'>
                    <UsersRound size={20} />
                    <span className='hidden md:inline'>Volunteer Requests</span></button>
            </div >
        )
    }
    if (user?.role == 'VOLUNTEER') {
        return (
            <div className='space-y-3 md:min-w-1/8 border-r border-border flex flex-col pr-6'>
                <button className='secondary-btn'>View Events</button>
            </div>
        )
    }
}

export default Sidebar