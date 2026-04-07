'use client'
import { createContext, useContext, useState, useCallback } from 'react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((msg, type = '') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }, [])

  return (
    <ToastCtx.Provider value={showToast}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast show ${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  return useContext(ToastCtx)
}
