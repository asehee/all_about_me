import { User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BackButton from '@/components/design/BackButton'
import SectionHeader from '@/components/design/SectionHeader'
import InfoSectionList from '@/components/design/InfoSectionList'
import PageShell from '@/components/design/PageShell'

export default function About() {
  const navigate = useNavigate()
  const sections = [
    {
      title: 'Intro',
      description: 'Replace this with your story, values, and background.',
    },
    {
      title: 'Experience',
      description: 'Add your highlights, roles, and impact timeline.',
    },
    {
      title: 'Skills',
      description: 'List the tools and capabilities you use in real projects.',
    },
  ]

  return (
    <PageShell icon={User}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <BackButton label="Home" onClick={() => navigate('/')} />
        </div>

        <SectionHeader
          title="About Me"
          subtitle="A short introduction and what I care about."
          accentClassName="from-cyan-500 to-blue-500"
        />

        <InfoSectionList sections={sections} />
      </div>
    </PageShell>
  )
}
