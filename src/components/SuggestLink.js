'use client'
import { useState } from 'react'
import SuggestModal from './SuggestModal'

export default function SuggestLink({ doctor }) {
  const [show, setShow] = useState(false)
  return (
    <>
      <div className="suggest-link-row">
        <button className="suggest-link" onClick={() => setShow(true)}>✏️ Sugerează o modificare</button>
      </div>
      {show && <SuggestModal doctor={doctor} onClose={() => setShow(false)} />}
    </>
  )
}
