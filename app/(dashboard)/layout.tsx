import Link from 'next/link'
import SignOutButton from './SignOutButton'

const navItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/contacts', label: 'Contacts', icon: '👤' },
  { href: '/properties', label: 'Properties', icon: '🏠' },
  { href: '/pipeline', label: 'Pipeline', icon: '📋' },
  { href: '/showings', label: 'Showings', icon: '📅' },
  { href: '/tasks', label: 'Tasks', icon: '✅' },
  { href: '/analytics', label: 'Analytics', icon: '📈' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <aside className="w-56 border-r border-gray-800 bg-[#0d1117] flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <Link href="/" className="text-lg font-bold text-white">PropFlow</Link>
          <p className="text-xs text-gray-500">Real Estate CRM</p>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-[#0a0a0a] p-6">
        {children}
      </main>
    </div>
  )
}
