import { Building2, MapPin } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

function Home() {
    const navigate = useNavigate()
    const { user } = useAuth()

    const handleRegister = async () => {
        if (!user) {
            navigate('/login')
            return;
        }
        await registerEventVolunteer(user.id)
    }
    return (
        <div className='h-screen space-y-3 container mx-auto'>
            {events.map(event => (
                <div key={event._id} className='cursor-pointer hover:scale-105 duration-100 border border-border hover:shadow-2xl rounded p-4'>
                    <Link to={`/event/${event._id}`}>
                        <h3 className='font-bold text-xl'>{event.name}</h3>
                        <p className='flex gap-1 my-2 items-center text-gray-500'>
                            <span><Building2 size={14} /></span>
                            <span> {event.organizer}</span>
                        </p>
                        <p className='flex gap-1 items-center text-gray-500'><span><MapPin size={14} /></span>
                            <span>{event.location}</span>
                        </p>
                    </Link>
                    <div className='flex justify-end'>
                        <button onClick={handleRegister} className='cursor-pointer bg-primary text-white rounded px-4 py-1'>Register</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Home

const events = [
    {
        _id: 12345,
        name: 'Concert',
        location: 'Yak & Yeti Ground',
        organizer: 'Biplav Group of Company'
    },
    {
        _id: 45,
        name: 'Concert',
        location: 'Yak & Yeti Ground',
        organizer: 'Biplav Group of Company'
    },
    {
        _id: 75,
        name: 'Concert',
        location: 'Yak & Yeti Ground',
        organizer: 'Biplav Group of Company'
    },
]