'use client'
import { useState } from 'react'
import AddReviewModal from './AddReviewModal'

export default function WriteReviewLink({ doctor }) {
  const [show, setShow] = useState(false)
  return (
    <>
      <button className="write-review-link" onClick={() => setShow(true)}>+ Lasă un comentariu</button>
      {show && <AddReviewModal doctor={doctor} onClose={() => setShow(false)} />}
    </>
  )
}
