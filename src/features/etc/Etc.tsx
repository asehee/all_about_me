import { Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BackButton from '@/components/design/BackButton'
import PageShell from '@/components/design/PageShell'
import SEO from '@/components/SEO'

export default function Etc() {
  const navigate = useNavigate()

  return (
    <>
      <SEO
        title="Utils - hee.dance"
        description="Small tools and experiments by hee."
        keywords="developer tools, utilities, experiments"
        url="https://hee.dance/etc"
      />
      <PageShell icon={Sparkles}>
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <BackButton label="Home" onClick={() => navigate('/')} />
          </div>
          <header>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Tools</p>
            <h1 className="page-title">Utils</h1>
          </header>
          <div className="mt-14 border-y border-border py-10">
            <p className="text-sm text-muted-foreground">새로운 도구를 준비하고 있어요.</p>
          </div>
        </div>
      </PageShell>
    </>
  )
}
