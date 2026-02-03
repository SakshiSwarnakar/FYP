import React, { useState } from 'react'
import { api } from '../axios/axios'
import { TriangleAlert } from 'lucide-react'

function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await api.post('/auth/forgot-password', email)
        setStatus(res.message)
    }


    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h1 className='text-2xl font-bold text-primary'>Forgot Password</h1>
                <form className='my-2' onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='my-2'>
                        <button type="submit" className='w-fit primary-btn'>Submit</button>
                    </div>
                </form>
                {status && <p className='flex items-center p-1  text-black rounded gap-2 text-sm bg-accent/50'><TriangleAlert /> {status}</p>}
            </div>
        </div>
    )
}

export default ForgotPassword