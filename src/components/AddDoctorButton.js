'use client'
import { useState } from 'react'
import AddDoctorModal from './AddDoctorModal'

export default function AddDoctorButton() {
  const [show, setShow] = useState(false)
  return (
    <>
      <button className="nav-btn nav-btn-primary" style={{ fontSize: 13 }} onClick={() => setShow(true)}>
        + Adaugă un medic
      </button>
      {show && <AddDoctorModal onClose={() => setShow(false)} />}
    </>
  )
}
