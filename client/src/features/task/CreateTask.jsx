import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { api } from '../../axios/axios'
import { toast } from 'react-toastify'

function CreateTask() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        points: 0,
    })

    const [attachments, setAttachments] = useState([])

    const { id } = useParams()
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === "points" ? Number(value) : value
        }))
    }

    const handleFileChange = (e) => {
        setAttachments(e.target.files)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const data = new FormData()

            // append normal fields
            data.append("title", formData.title)
            data.append("description", formData.description)
            data.append("points", formData.points)

            // append files
            for (let i = 0; i < attachments.length; i++) {
                data.append("attachments", attachments[i])
            }

            const res = await api.post(
                `/task/campaigns/${id}/tasks`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )

            if (res.status == 'success') {
                toast.success(res.message)
                navigate(-1)
            }
            console.log(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <h2 className='text-4xl text-primary font-extrabold mb-6'>
                Create Task
            </h2>

            <form onSubmit={handleSubmit} className='space-y-3'>
                <div className='flex flex-col gap-1'>
                    <label className='font-semibold text-xl'>Title</label>
                    <input
                        name='title'
                        value={formData.title}
                        onChange={handleChange}
                        className='bg-white outline-0 focus:ring-primary ring ring-secondary p-2 rounded'
                        placeholder='Enter Title'
                    />
                </div>

                <div className='flex flex-col gap-1'>
                    <label className='font-semibold text-xl'>Description</label>
                    <textarea
                        name='description'
                        value={formData.description}
                        onChange={handleChange}
                        className='outline-0 bg-white p-2 rounded focus:ring-primary ring-secondary ring'
                        placeholder='Enter description of the task'
                    />
                </div>

                <div className='flex flex-col gap-1'>
                    <label>Points</label>
                    <input
                        type='number'
                        name='points'
                        value={formData.points}
                        onChange={handleChange}
                        className='bg-white outline-0 ring ring-secondary focus:ring-primary p-2 rounded'
                    />
                </div>

                {/* ✅ Attachments Input */}
                <div className='flex flex-col gap-1'>
                    <label className='font-semibold'>Attachments</label>
                    <input
                        type='file'
                        multiple
                        onChange={handleFileChange}
                        className='bg-white p-2 rounded ring ring-secondary focus:ring-primary'
                    />
                </div>

                <div className='flex gap-3'>
                    <button type='submit' className='primary-btn'>
                        Create
                    </button>
                    <button type='button' className='secondary-btn'>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateTask
