import { Link, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { Blend, House, LayoutGrid, LogIn } from 'lucide-react'

function Navbar() {
    const location = useLocation()
    const { user, loading } = useAuth();

    return (
        <nav className='z-10 sticky left-0 backdrop-blur-2xl top-0 w-full shadow-sm border-b border-border'>
            <div className='container flex justify-between px-3 lg:px-0 mx-auto py-4 font-bold'>
                <Link to='/'>
                    <h1 className='flex items-center gap-1'>
                        <span><Blend className='text-accent' /></span>
                        <span className='hidden md:block'>Social</span>
                    </h1>
                </Link>
                <ul className='flex items-center gap-3'>
                    <li >
                        <Link to="/" className={`flex gap-1 items-center '  ${location.pathname == '/' ? " text-accent" : ""}`}>
                            <span><House /></span>
                            <span className='hidden md:block'>Home</span>
                        </Link>
                    </li>
                    <li className='flex'>
                        {(!loading && user) && <Link to="/dashboard" className={`flex gap-1 items-center '  ${location.pathname == '/profile' ? " text-accent" : ""}`}>
                            <span><LayoutGrid /></span>
                            <span className='hidden md:block'>Dashboard</span>
                        </Link>}

                        {(!loading && !user) && < Link to='login' className={`flex gap-1 items-center '  ${location.pathname == '/login' ? " text-accent" : ""}`}>
                            <span><LogIn /></span>
                            <span className='hidden md:block'>Login</span>
                        </Link>}
                    </li>
                </ul>
            </div>
        </nav >
    )
}

export default Navbar