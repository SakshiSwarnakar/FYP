import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import Loading from '../../components/Loading';
import CampaignCard from '../../features/campaign/CampaignCard';
import { useCampaign } from '../../context/CampaignContext';
import { useAuth } from '../../context/AuthContext';
import { XCircle } from 'lucide-react';

function VolunteerRejected() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const { campaigns, fetchCampaigns, status, choseCampaign, handleRegister } = useCampaign();

    const campaignList = Array.isArray(campaigns) ? campaigns : (campaigns?.data ?? []);
    const rejectedCampaigns = campaignList.filter((c) => c.myVolunteerStatus === 'rejected');

    useEffect(() => {
        fetchCampaigns()
        if (!loading && !user) {
            navigate('/');
        }
    }, [loading, user, navigate]);

    if (loading || status === 'loading') {
        return <Loading />;
    }

    return (
        <>
            <div className="flex-1 flex items-center justify-between">
                <h1 className="font-bold text-primary mb-10 text-5xl">Rejected Events</h1>
            </div>
            <p className="text-accent/80 mb-6">
                Campaigns where your volunteer application was not accepted.
            </p>

            {rejectedCampaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl bg-primary/5 border border-primary/20">
                    <XCircle className="w-16 h-16 text-primary/40 mb-4" />
                    <p className="text-lg font-medium text-accent">No rejected events</p>
                    <p className="text-sm text-accent/70 mt-1">
                        Rejected applications will appear here. Keep applying to other events.
                    </p>
                </div>
            ) : (
                <div className="grid-container">
                    {rejectedCampaigns.map((campaign) => (
                        <CampaignCard
                            key={campaign.id}
                            campaign={campaign}
                            handleRegister={handleRegister}
                            choseCampaign={choseCampaign}
                        />
                    ))}
                </div>
            )}
        </>
    );
}

export default VolunteerRejected;
