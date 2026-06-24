'use client'

export default function SignOutButton() {
  return (
    <button
      onClick={async () => {
        await fetch('/api/auth', { method: 'DELETE' })
        window.location.href = '/login'
      }}
      className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer"
    >
      Sign Out
    </button>
  )
}
