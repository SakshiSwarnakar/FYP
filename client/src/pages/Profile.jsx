import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react';
import Loading from '../components/Loading';
import { User } from 'lucide-react';

function Profile() {
    const navigate = useNavigate()
    const { user, loading, logout } = useAuth()

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [loading, user]);

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className='container mx-auto px-3 lg:px-0' >
            <div className='flex gap-2'>
                <div className='bg-accent/50 w-fit p-3 text-white rounded'><User /></div>
                <div>
                    <span className='block'>{user?.email.split("@")[0]}</span>
                    <span>{user?.role.toLowerCase()}</span>
                </div>
                <div className='ml-auto'>
                    <button className='bg-accent text-white px-3 py-2 rounded font-semibold' onClick={logout}>Logout</button>
                </div>
            </div>
        </div>
    )
}

export default Profile;