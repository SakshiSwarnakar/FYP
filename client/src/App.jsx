import { Outlet } from 'react-router'
import Navbar from './components/Navbar'

function App() {

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className='mt-18 px-3 lg:px-0'>
        <Outlet />
      </main>
    </>
  )
}

export default App
