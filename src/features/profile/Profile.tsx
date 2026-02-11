import { BriefcaseBusiness } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BackButton from '@/components/design/BackButton'
import SectionHeader from '@/components/design/SectionHeader'
import InfoSectionList from '@/components/design/InfoSectionList'
import PageShell from '@/components/design/PageShell'

export default function Profile() {
  const navigate = useNavigate()
  const sections = [
    {
      title: 'Projects',
      description: 'Add your flagship projects with concise outcomes.',
    },
    {
      title: 'Experience',
      description: 'Summarize your roles, scope, and responsibility.',
    },
    {
      title: 'Tech Stack',
      description: 'Mention the tools and languages you use most.',
    },
  ]

  return (
    <PageShell icon={BriefcaseBusiness}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <BackButton label="Home" onClick={() => navigate('/')} />
        </div>

        <SectionHeader
          title="Profile"
          subtitle="Selected projects and how I build products."
          accentClassName="from-lime-400 to-emerald-500"
        />

        <InfoSectionList sections={sections} />
      </div>
    </PageShell>
  )
}
