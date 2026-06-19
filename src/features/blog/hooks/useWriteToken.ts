import { useState } from 'react'
import { writeTokenManager } from '@/services/blogApi'

export function useWriteToken() {
  const [hasWriteToken, setHasWriteToken] = useState(() => writeTokenManager.exists())
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showTokenInputModal, setShowTokenInputModal] = useState(false)
  const [tokenInput, setTokenInput] = useState('')

  const openTokenInputModal = () => {
    setTokenInput('')
    setShowTokenInputModal(true)
  }

  const handleSaveWriteToken = (): boolean => {
    if (!tokenInput.trim()) return false
    writeTokenManager.set(tokenInput)
    setHasWriteToken(true)
    setShowTokenInputModal(false)
    setShowAuthModal(false)
    return true
  }

  const handleClearWriteToken = () => {
    writeTokenManager.clear()
    setHasWriteToken(false)
  }

  return {
    hasWriteToken,
    showAuthModal,
    setShowAuthModal,
    showTokenInputModal,
    setShowTokenInputModal,
    tokenInput,
    setTokenInput,
    openTokenInputModal,
    handleSaveWriteToken,
    handleClearWriteToken,
  }
}
