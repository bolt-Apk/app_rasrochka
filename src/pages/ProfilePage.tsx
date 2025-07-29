import React from 'react'
import { useNavigate } from 'react-router-dom'
import { User, LogOut, Settings, Phone, Mail, Shield } from 'lucide-react'
import { MobileLayout } from '../components/layout/MobileLayout'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { useAuth } from '../hooks/useAuth'

export function ProfilePage() {
  const { user, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/auth')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!user) {
    navigate('/auth')
    return null
  }

  return (
    <MobileLayout>
      <div className="bg-white">
        {/* Header */}
        <div className="bg-primary-600 text-white p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10" />
            </div>
            <h1 className="text-xl font-semibold mb-1">
              {user.email}
            </h1>
            {isAdmin() && (
              <div className="flex items-center justify-center space-x-1">
                <Shield className="w-4 h-4" />
                <span className="text-sm text-primary-100">Администратор</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Account Info */}
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold text-gray-900 mb-4">
                Информация об аккаунте
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">ID пользователя</p>
                    <p className="font-mono text-sm text-gray-700">
                      {user.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Дата регистрации</p>
                    <p className="font-medium">
                      {new Date(user.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold text-gray-900 mb-4">
                Быстрые действия
              </h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/applications')}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">Мои заявки</span>
                  <span className="text-gray-400">→</span>
                </button>
                
                <button
                  onClick={() => navigate('/catalog')}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">Каталог автомобилей</span>
                  <span className="text-gray-400">→</span>
                </button>
                
                {isAdmin() && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium">Панель администратора</span>
                    <span className="text-gray-400">→</span>
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardContent className="p-4">
              <h2 className="font-semibold text-gray-900 mb-4">
                Поддержка
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Телефон поддержки</p>
                    <a 
                      href="tel:+78001234567" 
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      8 (800) 123-45-67
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email поддержки</p>
                    <a 
                      href="mailto:support@autorассрочка.ru" 
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      support@autorассрочка.ru
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sign Out */}
          <div className="pt-4">
            <Button
              variant="error"
              onClick={handleSignOut}
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Выйти из аккаунта
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  )
}