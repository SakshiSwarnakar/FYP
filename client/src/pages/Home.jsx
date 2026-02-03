
import Comment from '../components/Comment'
import Loading from '../components/Loading'
import { useCampaign } from '../context/CampaignContext'
import HeroSection from '../components/HeroSection'
import CampaignFeatures from '../components/Features'
import CampaignCard from '../components/CampaignCard'
import CategoryTabs from '../components/CategotyTab'

function Home() {
    const { status, activeCampaign, campaigns, choseCampaign, handleRegister } = useCampaign()


    return (
        <div>
            <HeroSection />
            <CampaignFeatures />
            <CategoryTabs onChange={(category) => console.log(category)} />
            <div className='container mx-auto'>
                <div>
                    <h1 className='text-5xl text-primary font-bold'>Latest Campaign</h1>
                    <p className='text-lg text-gray-500'>Explore what's happening around you.</p>
                </div>

                {(status == "success" && !campaigns) && <p className='mt-8'>No campaign found.</p>}

                {status == 'loading' && <div className='mt-8'><Loading /></div>}
                {/* Main Content */}
                <div className='grid-container mt-6'>
                    {campaigns && campaigns?.map(event => (
                        <CampaignCard key={event.id} campaign={event} choseCampaign={choseCampaign} handleRegister={handleRegister} />
                    ))}

                    {/* Comment Box */}
                    <Comment activeCampaign={activeCampaign} choseCampaign={choseCampaign} />
                </div>
            </div>
        </div>
    )
}

export default Home