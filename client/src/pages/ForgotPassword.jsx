import React, { useState } from 'react'
import { api } from '../axios/axios'
import { TriangleAlert } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'

function ForgotPassword() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState("")
    const [status, setStatus] = useState({ status: '' })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const res = await api.post('/auth/forgot-password', { email: formData.email })
        if (res.status == 'success') {
            toast.success(res.message)
        }
        setStatus(res)
        setLoading(false)
    }

    const resetPassword = async () => {
        setLoading(true)
        try {
            const res = await api.post('/auth/reset-password', { token: formData.token, password: formData.password })
            setStatus(res)
            setLoading(false)
            if (res.status == 'success') {
                toast.success(res.message)
                navigate('/login')
            }
        } catch (err) {
            toast.error(err.message)
        }

    }



    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h1 className='text-2xl font-bold text-primary'>{status.status == '' ? "Forgot Password" : "Reset Password"}</h1>
                <form className='my-2' onSubmit={handleSubmit}>
                    {status?.status == '' && <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>}
                    {status?.status == 'success' && <>
                        <div>
                            <label className="block mb-1 font-medium">Token</label>
                            <input
                                name="token"
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter your email"
                                value={formData?.token}
                                onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">New Password</label>
                            <input
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                type='password'
                                placeholder="Enter your password"
                                value={formData?.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div></>
                    }
                    {status?.status == '' && <div className='my-2'>
                        <button type="submit" disabled={loading} className='w-fit primary-btn'>Submit</button>
                    </div>}
                    {status.status == 'success' && <div className='my-2'>
                        <button type="button" disabled={loading} onClick={() => resetPassword()} className='w-fit primary-btn'>Submit</button>
                    </div>}
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword