import { useEffect, useState, useMemo } from 'react'
import { useParams, Link, useLocation } from 'react-router'
import { api } from '../axios/axios'
import Loading from '../components/Loading'
import { Bookmark, Cross, MapPin, Timer, UsersRound, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

function Campaign() {
    const { user } = useAuth()
    const { id } = useParams()
    const location = useLocation()

    const [campaign, setCampaign] = useState(null)
    const [volunteers, setVolunteers] = useState(null)
    const [loading, setLoading] = useState(true)
    const [volunteerPop, openPopup] = useState(false)

    const isAdmin = useMemo(() => user?.role === 'ADMIN', [user])

    /* ================= Campaign ================= */
    useEffect(() => {
        let isMounted = true

        const loadCampaign = async () => {
            try {
                const res = await api.get(`/campaign/${id}`)
                if (isMounted) setCampaign(res.data)
            } catch (error) {
                console.log(error)
                toast.error('Failed to load campaign')
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        loadCampaign()

        return () => {
            isMounted = false
        }
    }, [id])

    /* ================= Volunteers (ADMIN only) ================= */
    const handleVolunteer = async () => {
        if (!isAdmin) return
        openPopup(true)

        try {
            const res = await api.get(`/campaign/${id}/volunteers`)
            setVolunteers(res.data)
        } catch (error) {
            console.log(error)
            toast.error('Failed to load volunteers')
        }
    }



    const handleVolunteerRequest = async (status, volunteerId) => {
        try {
            const res = await api.patch(
                `/campaign/${id}/volunteer-requests/${volunteerId}`,
                { status } // keep status consistent with backend
            );
            handleVolunteer()

            toast.success(res.message);
        } catch (error) {
            toast.error("Failed to approve volunteer");
            console.error(error);
        }
    };

    const addComment = async() => {
        try {
            const res = await api.get('')
        } catch (error) {
            
        }

    }


    if (loading) return <Loading />

    if (!campaign) return null

    return (
        <div className="max-w-6xl my-12 mx-auto">
            {campaign.attachments && (
                <img
                    className="h-120 w-full object-cover mb-10 rounded"
                    src={campaign.attachments[0]?.url}
                    alt="campaign"
                />
            )}

            {/* ================= Event Header ================= */}
            <div className="flex flex-col gap-6 md:flex-row md:items-start justify-between">
                <div className="flex-1">
                    <div className='flex items-center justify-between'>
                        <h1 className="text-primary text-4xl font-bold mb-2">
                            {campaign.title}
                        </h1>
                        {isAdmin && <button onClick={handleVolunteer} className='primary-btn md:space-x-2'>
                            <UsersRound size={16} />
                            <span className='hidden md:inline'>Volunteer</span></button>}
                        {/* ================= Volunteers (ADMIN) ================= */}
                        {(isAdmin && volunteerPop) && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

                                {/* Modal */}
                                <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl p-6 animate-fadeIn">

                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-primary">
                                            Volunteer Requests
                                        </h2>

                                        <button
                                            onClick={() => openPopup(false)}
                                            className="p-1 rounded-md hover:bg-white/10 transition"
                                        >
                                            <X className=" hover:text-red-500" />
                                        </button>
                                    </div>

                                    <hr className="my-4 border-black/10" />

                                    {/* Content */}
                                    <div className="max-h-80 space-y-3 overflow-y-auto">
                                        {volunteers?.volunteerRequests?.length > 0 ? (
                                            volunteers.volunteerRequests.map((vl) => (
                                                <div
                                                    key={vl.volunteer.id}
                                                    className="flex gap-2 items-center justify-between rounded-lg bg-primary/30 px-4 py-3 hover:bg-primary/40 transition"
                                                >
                                                    <span className="text-black font-semibold">
                                                        {vl.volunteer.fullName}
                                                    </span>

                                                    <button
                                                        onClick={() => handleVolunteerRequest('accepted', vl.volunteer.id)}
                                                        className="primary-btn ml-auto"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button onClick={() => handleVolunteerRequest('rejected', vl.volunteer.id)} className='secondary-btn bg-bg'>
                                                        Decline
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-center text-black/60">
                                                No pending volunteer requests
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            <div className="mt-2 flex gap-2 text-gray-500">
                <p className="bg-secondary rounded px-1 flex items-center gap-1">
                    <Bookmark size={18} />
                    <span>{campaign.category}</span>
                </p>
                <p className="bg-secondary rounded px-1 flex items-center gap-1">
                    <Timer size={18} />
                    <span>{campaign?.date?.split('T')[0]}</span>
                </p>
                <p className="bg-secondary rounded px-1 flex items-center gap-1">
                    <MapPin size={18} />
                    <span>{campaign.location}</span>
                </p>
            </div>

            <div className="my-5">
                <h2 className="text-2xl font-semibold text-primary mb-3">
                    About the Event
                </h2>
                <p className="text-gray-700 leading-relaxed">
                    {campaign.description || 'No description provided.'}
                </p>
            </div>


            <div className="my-5">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                    Comments
                </h2>

                <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-transparent">
                    {campaign?.comments?.length ? (
                        campaign.comments.map((c, index) => (
                            <div
                                key={index}
                                className="min-w-[280px] bg-white border border-border p-4 rounded-2xl shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <img
                                        src={c.user?.avatar || '/placeholder.png'}
                                        className="w-10 h-10 rounded-full border"
                                        alt="avatar"
                                    />
                                    <div>
                                        <p className="font-semibold">
                                            {c.user?.name || 'Unknown User'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {c.createdAt?.slice(0, 10)}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {c.text}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No comments yet.</p>
                    )}
                </div>

                {/* ================= Add Comment ================= */}
                <div className="relative mt-6 p-4 bg-white border border-border rounded-2xl shadow-sm">

                    <form onSubmit={addComment} className={!user ? 'blur-sm' : ''}>
                        <textarea
                            placeholder="Write your comment..."
                            className="w-full border border-border rounded-xl p-3 outline-none focus:border-primary transition-all"
                            rows="3"

                        />
                        <button
                            type='submit'
                            disabled={!user}
                            className="mt-3 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-hover transition-all"
                        >
                            Post Comment
                        </button>
                    </form>

                    {!user && (
                        <Link
                            state={{ from: location.pathname }}
                            to="/login"
                            className="absolute -translate-1/2 top-1/2 left-1/2 primary-btn w-fit"
                        >
                            Login to comment.
                        </Link>
                    )}
                </div>
            </div>
        </div >
    )
}

export default Campaign
