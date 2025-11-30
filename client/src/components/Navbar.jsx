import { Link, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { Blend, House, LogIn, User } from 'lucide-react'

function Navbar() {
    const location = useLocation()
    const { user } = useAuth();

    return (
        <nav className='z-10 fixed left-0 backdrop-blur-2xl top-0 w-full border-b border-border'>
            <div className='container flex px-3 lg:px-0 mx-auto justify-between py-4 font-bold'>
                <h1 className='flex items-center gap-1'>
                    <span> <Blend className='text-accent' /></span>
                    <span className='hidden md:block'>Social</span>
                </h1>
                <ul className='flex items-center gap-3'>
                    <li >
                        <Link to="/" className={`flex gap-1 items-center '  ${location.pathname == '/' ? " text-accent" : ""}`}>
                            <span><House /></span>
                            <span className='hidden md:block'>Home</span>
                        </Link>
                    </li>
                    <li className='flex'>
                        {user ? <Link to="/profile" className={`flex gap-1 items-center '  ${location.pathname == '/me' ? " text-accent" : ""}`}>
                            <span><User /></span>
                            <span className='hidden md:block'>Profile</span>
                        </Link> : <Link to='login' className={`flex gap-1 items-center '  ${location.pathname == '/login' ? " text-accent" : ""}`}>
                            <span><LogIn /></span>
                            <span className='hidden md:block'>Login</span>
                        </Link>}
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar