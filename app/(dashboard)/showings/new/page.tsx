import { Suspense } from 'react'
import NewShowingForm from './NewShowingForm'

export default function NewShowingPage() {
  return (
    <Suspense fallback={<div className="text-gray-500 p-6">Loading...</div>}>
      <NewShowingForm />
    </Suspense>
  )
}
