import { useEffect, useState } from 'react'

export default function useTypewriter(
  text: string,
  typingMs = 90,
  deletingMs = 55,
  holdMs = 1400,
) {
  const [value, setValue] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let timer: number

    if (!isDeleting && value.length < text.length) {
      timer = window.setTimeout(() => {
        setValue(text.slice(0, value.length + 1))
      }, typingMs)
    } else if (!isDeleting && value.length === text.length) {
      timer = window.setTimeout(() => setIsDeleting(true), holdMs)
    } else if (isDeleting && value.length > 0) {
      timer = window.setTimeout(() => {
        setValue(text.slice(0, value.length - 1))
      }, deletingMs)
    } else {
      timer = window.setTimeout(() => setIsDeleting(false), 500)
    }

    return () => window.clearTimeout(timer)
  }, [value, isDeleting, text, typingMs, deletingMs, holdMs])

  return value
}
