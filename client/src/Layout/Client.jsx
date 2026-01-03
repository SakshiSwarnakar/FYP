import { Outlet } from 'react-router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Client() {
    return (
        <>
            <Navbar />
            <main className='mx-auto py-24 px-3 lg:px-0'>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default Client