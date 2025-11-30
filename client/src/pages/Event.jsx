import React from 'react'
import { useParams } from 'react-router'

function Event() {
    const { id } = useParams()
    return (
        <div className='container mx-auto'>Event: {id}</div>
    )
}

export default Event