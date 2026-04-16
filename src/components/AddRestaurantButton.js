'use client'
import { useState } from 'react'
import AddRestaurantModal from './AddRestaurantModal'
import { useAuth } from './AuthProvider'

export default function AddRestaurantButton() {
  const { user } = useAuth() || {}
  const [show, setShow] = useState(false)

  function handleClick() {
    if (!user) { window.dispatchEvent(new CustomEvent('openAuth')); return }
    setShow(true)
  }

  return (
    <>
      <button className="nav-btn nav-btn-primary" style={{ fontSize: 13 }} onClick={handleClick}>
        + Adaugă un loc
      </button>
      {show && <AddRestaurantModal onClose={() => setShow(false)} />}
    </>
  )
}
