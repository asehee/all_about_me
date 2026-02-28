import { useState } from 'react'
import PageShell from '@/components/design/PageShell'
import BackButton from '@/components/design/BackButton'
import { GitHub } from 'lucide-react'

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
    <PageShell icon={GitHub} contentClassName="bg-black">
      <BackButton label="Labs" onClick={() => history.back()} className="mb-6" />
      <h1 className="text-3xl font-semibold">GitHub Repo 분석</h1>
      <div className="space-y-4">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/owner/repo"
          className="w-full rounded px-3 py-2 text-black"
        />
        <button
          onClick={analyze}
          disabled={loading || !url}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? '분석 중...' : '분석하기'}
        </button>
        {error && <p className="text-red-400">{error}</p>}
        {result && (
          <pre className="whitespace-pre-wrap break-words bg-white p-4 text-black">
            {result}
          </pre>
        )}
      </div>
    </PageShell>
  )
}
