import HeroSection from '../components/HeroSection'
import CampaignFeatures from '../components/Features'
import CampaignCard from '../components/CampaignCard'

const campaigns = [
  {
    id: 1,
    title: 'Free Health Checkup Camp',
    description: 'Free BP, sugar, BMI, and general health checkup for everyone.',
    location: 'Kathmandu',
    date: '2025-01-05',
    image: 'https://images.unsplash.com/photo-1580281657521-7f2a4f6f8b9b',
    organizer: 'City Hospital',
    volunteersNeeded: 20
  },
  {
    id: 2,
    title: 'Blood Donation Campaign',
    description: 'Donate blood and help save lives. Refreshments provided.',
    location: 'Lalitpur',
    date: '2025-01-12',
    image: 'https://images.unsplash.com/photo-1582719478185-2f1b7b9b8f6b',
    organizer: 'Red Cross Nepal',
    volunteersNeeded: 30
  },
  {
    id: 3,
    title: 'Mental Health Awareness Program',
    description: 'Session on mental health awareness and stress management.',
    location: 'Bhaktapur',
    date: '2025-01-20',
    image: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb',
    organizer: 'MindCare Nepal',
    volunteersNeeded: 15
  }
]

function Home() {
  return (
    <div>
      <HeroSection />
      <CampaignFeatures />

      <div className='container mx-auto'>
        <div>
          <h1 className='text-5xl text-primary font-bold'>Latest Campaign</h1>
          <p className='text-lg text-gray-500'>
            Explore what's happening around you.
          </p>
        </div>

        <div className='grid-container mt-6'>
          {campaigns.map(event => (
            <CampaignCard
              key={event.id}
              campaign={event}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home