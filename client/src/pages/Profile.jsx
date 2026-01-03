import { useNavigate } from 'react-router'
import { useEffect } from 'react'
import Loading from '../components/Loading'
import CampaignCard from '../components/CampaignCard'
import { useAuth } from '../context/AuthContext'
import { useCampaign } from '../context/CampaignContext'

function Profile() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const {
    campaigns,
    status,
    choseCampaign,
    activeCampaign,
    handleRegister,
  } = useCampaign()
console.log(campaigns)
  useEffect(() => {
    if (!loading && !user) {
      navigate('/')
    }
  }, [loading, user])

  /* ---------------- Loading ---------------- */
  if (loading || status === 'loading') {
    return <Loading />
  }

  /* ---------------- No campaigns ---------------- */
  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          No campaigns found
        </h2>
        <p className="text-gray-500 mt-2">
          You haven’t created or joined any campaigns yet.
        </p>
        <button
          className="primary-btn mt-6"
          onClick={() => navigate('/campaign/create')}
        >
          Create your first campaign
        </button>
      </div>
    )
  }

  /* ---------------- Campaign list ---------------- */
  return (
    <>
      <div className="flex-1 flex items-center justify-between">
        <h1 className="font-bold text-primary mb-10 text-5xl">
          My Events
        </h1>
      </div>

      <div className="grid-container mt-4">
        {campaigns?.data?.map((campaign) => (
          <CampaignCard
            key={campaign?.id}
            campaign={campaign}
            handleRegister={handleRegister}
            choseCampaign={choseCampaign}
          />
        ))}

       
      </div>
    </>
  )
}

export default Profile
