import { useState } from 'react'
import PageShell from '@/components/design/PageShell'
import BackButton from '@/components/design/BackButton'
import { Github } from 'lucide-react'

export default function GithubLab() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/github/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: url, promptType: 'markdown' }),
      })
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      setResult(json.result)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell icon={Github} contentClassName="bg-black">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <BackButton label="Labs" onClick={() => history.back()} />
        </div>

        <header>
          <p className="text-xs uppercase tracking-[0.18em] text-white/45">Lab</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-6xl">
            GitHub Repo 분석
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-white/62 md:text-base">
            저장소 URL을 입력하면 구조, 핵심 파일, 핵심 흐름을 요약합니다.
          </p>
        </header>

        <section className="mt-10 space-y-6">
          <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-6">
            <label className="text-xs uppercase tracking-[0.14em] text-white/50">
              Repository URL
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              className="mt-3 w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
            />
            <p className="mt-3 text-xs text-white/45">
              공개 저장소만 분석 가능합니다.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={analyze}
                disabled={loading || !url}
                className="rounded-lg border border-white/20 bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {loading ? '분석 중...' : '분석하기'}
              </button>
              {error && <p className="text-sm text-red-300/90">{error}</p>}
            </div>
          </div>

          {result && (
            <div className="rounded-2xl border border-white/12 bg-black/40 p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                  Result
                </p>
              </div>
              <pre className="whitespace-pre-wrap break-words text-sm text-white/80">
                {result}
              </pre>
            </div>
          )}
        </section>
      </div>
    </PageShell>
  )
}
