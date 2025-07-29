import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Car, FileText, User, Settings } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAuth } from '../../hooks/useAuth'

export function BottomNavigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()

  const navItems = [
    {
      icon: Home,
      label: 'Главная',
      path: '/',
    },
    {
      icon: Car,
      label: 'Каталог',
      path: '/catalog',
    },
    {
      icon: FileText,
      label: 'Заявки',
      path: '/applications',
    },
    {
      icon: User,
      label: 'Профиль',
      path: '/profile',
    },
    ...(isAdmin() ? [{
      icon: Settings,
      label: 'Админ',
      path: '/admin',
    }] : []),
  ]

  return (
    <nav className="mobile-bottom-nav">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200',
                isActive
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}