import { Suspense } from 'react'
import NewPropertyForm from './NewPropertyForm'

export default function NewPropertyPage() {
  return (
    <Suspense fallback={<div className="text-gray-500 p-6">Loading...</div>}>
      <NewPropertyForm />
    </Suspense>
  )
}
