import { NavLink } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Megaphone, PartyPopper, UsersRound } from 'lucide-react'

const navClass = ({ isActive }) =>
    `tab-btn flex bg-accent items-center gap-2 ${isActive ? 'bg-black' : ''
    }`

function Sidebar() {
    const { user } = useAuth()

    if (user?.role === 'ADMIN') {
        return (
            <div className='space-y-3 w-12 ml-1 md:w-1/7 border border-primary rounded-lg overflow-clip p-2 flex flex-col'>

                <NavLink to='/dashboard' className={navClass}>
                    <PartyPopper size={20} />
                    <span className='hidden md:inline'>My Events</span>
                </NavLink>

                <NavLink to='/dashboard/create-campaign' className={navClass}>
                    <Megaphone size={20} />
                    <span className='hidden md:inline'>Create Event</span>
                </NavLink>

                <NavLink to='/dashboard/volunteer-requests' className={navClass}>
                    <UsersRound size={20} />
                    <span className='hidden md:inline'>Volunteer Requests</span>
                </NavLink>

            </div>
        )
    }

    if (user?.role === 'VOLUNTEER') {
        return (
            <div className='space-y-3 px-3 md:min-w-1/8 border-r border-border flex flex-col pr-6'>
                <NavLink
                    to='/events'
                    className={({ isActive }) =>
                        `secondary-btn ${isActive ? 'bg-primary text-white' : ''}`
                    }
                >
                    View Events
                </NavLink>
            </div>
        )
    }

    return null
}

export default Sidebar
