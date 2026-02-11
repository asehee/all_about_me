import { Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BackButton from '@/components/design/BackButton'
import SectionHeader from '@/components/design/SectionHeader'
import InfoSectionList from '@/components/design/InfoSectionList'
import PageShell from '@/components/design/PageShell'

export default function Etc() {
  const navigate = useNavigate()
  const sections = [
    {
      title: 'Notes',
      description: 'Keep short ideas, reminders, or rough drafts here.',
    },
    {
      title: 'Links',
      description: 'Save references and resources you revisit often.',
    },
    {
      title: 'Misc',
      description: 'Capture everything that does not fit elsewhere.',
    },
  ]

  return (
    <PageShell icon={Sparkles}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <BackButton label="Home" onClick={() => navigate('/')} />
        </div>

        <SectionHeader
          title="Labs"
          subtitle="A place for experiments, links, and side notes."
          accentClassName="from-fuchsia-500 to-violet-500"
        />

        <InfoSectionList sections={sections} />
      </div>
    </PageShell>
  )
}
