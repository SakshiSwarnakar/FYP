import { MapPin, MessageSquare, User, X } from 'lucide-react'

function Comment({ activeCampaign, choseCampaign }) {

    return (
        <>
            {activeCampaign && <div className='fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50'>
                <div className=' bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-hidden border border-white shadow-2xl'>
                    {/* Header */}
                    <div className='flex border-b border-border items-center justify-between px-3 py-2'>
                        <div>
                            <h2 className='text-2xl font-bold text-primary'>{activeCampaign.name}</h2>
                            <p className='flex items-center gap-1 text-gray-400 text-sm mt-1'>
                                <span className='text-primary'><MapPin size={12} /></span>
                                <span>{activeCampaign.location}</span>
                            </p>
                        </div>
                        <button
                            onClick={() => choseCampaign(null)}
                            className='cursor-pointer bg-black/20 hover:bg-black p-2 rounded-full transition-all'
                        >
                            <X size={20} className='text-white' />
                        </button>
                    </div>
                    <div className='px-3 overflow-y-auto max-h-72'>
                        {activeCampaign.comments && activeCampaign.comments.length > 0 ? (
                            activeCampaign.comments.map(comment => (
                                <div key={comment.id} className='border-b border-border'>
                                    <div className='flex items-center gap-1 py-2'>
                                        <div className='bg-linear-to-br from-primary to-secondary rounded-full p-2 '>
                                            <User size={16} className='text-white' />
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <div className='flex items-center gap-2'>
                                                <span className='font-semibold text-black/80 text-sm'>{comment.user}</span>
                                                <p className='text-gray-400 text-sm '>{comment.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='flex flex-col items-center justify-center py-12 text-gray-400'>
                                <MessageSquare size={32} className='mb-2 opacity-50' />
                                <p>No comments yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            }
        </>
    )
}

export default Comment