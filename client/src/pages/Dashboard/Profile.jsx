import { useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { useEffect } from 'react';
import Loading from '../../components/Loading';
import Comment from '../../components/Comment';
import { useCampaign } from '../../context/CampaignContext';
import CampaignCard from '../../components/CampaignCard';

function Profile() {
    const navigate = useNavigate()
    const { user, loading } = useAuth()
    const { campaigns, status, choseCampaign, activeCampaign, handleRegister } = useCampaign()


    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }
    }, [loading, user]);

    if (loading || status == 'loading') {
        return (
            <Loading />
        )
    }

    return (
        <>
            <div className='flex-1 flex items-center justify-between'>
                <h1 className='font-bold text-primary mb-10 text-5xl'>My Events</h1>
            </div>
            <div className='grid-container'>
                {campaigns && campaigns.map(campaign => (
                    <CampaignCard key={campaign?.id} campaign={campaign} handleRegister={handleRegister} choseCampaign={choseCampaign} />
                ))}

                {/* Comment Box */}
                <Comment campaign={activeCampaign} choseCampaign={choseCampaign} />
            </div></>
    )
}

export default Profile;
