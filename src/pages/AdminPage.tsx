import React, { useState } from 'react'
import { Plus, Car, FileText, BarChart3, Edit, Trash2 } from 'lucide-react'
import { MobileLayout } from '../components/layout/MobileLayout'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { CarForm } from '../components/admin/CarForm'
import { LoadingCard } from '../components/ui/LoadingSpinner'
import { useCars } from '../hooks/useCars'
import { useLoanApplications } from '../hooks/useLoanApplications'
import { useAuth } from '../hooks/useAuth'
import type { Car } from '../lib/supabase'
import { formatPrice } from '../lib/utils'

export function AdminPage() {
  const { user, isAdmin } = useAuth()
  const { cars, loading: carsLoading, addCar, updateCar, deleteCar } = useCars()
  const { applications } = useLoanApplications()
  
  const [showCarForm, setShowCarForm] = useState(false)
  const [editingCar, setEditingCar] = useState<Car | undefined>()
  const [formLoading, setFormLoading] = useState(false)

  // Redirect if not admin
  if (!isAdmin()) {
    return (
      <MobileLayout>
        <div className="p-4 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Доступ запрещен
          </h1>
          <p className="text-gray-600">
            У вас нет прав для доступа к этой странице
          </p>
        </div>
      </MobileLayout>
    )
  }

  const handleCarSubmit = async (carData: Omit<Car, 'id' | 'created_at'>) => {
    setFormLoading(true)
    
    try {
      if (editingCar) {
        const { error } = await updateCar(editingCar.id, carData)
        if (error) {
          alert('Ошибка при обновлении: ' + error)
          return
        }
      } else {
        const { error } = await addCar(carData)
        if (error) {
          alert('Ошибка при добавлении: ' + error)
          return
        }
      }
      
      setShowCarForm(false)
      setEditingCar(undefined)
    } catch (error) {
      alert('Произошла ошибка')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteCar = async (car: Car) => {
    if (!confirm(`Удалить ${car.brand} ${car.model}?`)) return
    
    const { error } = await deleteCar(car.id)
    if (error) {
      alert('Ошибка при удалении: ' + error)
    }
  }

  const getStats = () => {
    const totalCars = cars.length
    const totalApplications = applications.length
    const newApplications = applications.filter(app => app.status === 'Новая').length
    const approvedApplications = applications.filter(app => app.status === 'Одобрена').length
    
    return {
      totalCars,
      totalApplications,
      newApplications,
      approvedApplications,
    }
  }

  const stats = getStats()

  return (
    <MobileLayout>
      <div className="bg-white">
        {/* Header */}
        <div className="bg-primary-600 text-white p-6">
          <h1 className="text-xl font-bold mb-2">Панель администратора</h1>
          <p className="text-primary-100">Добро пожаловать, {user?.email}</p>
        </div>

        {/* Stats */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Car className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.totalCars}</p>
                <p className="text-sm text-gray-600">Автомобилей</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                <p className="text-sm text-gray-600">Заявок</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-yellow-600 font-bold">!</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.newApplications}</p>
                <p className="text-sm text-gray-600">Новых</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.approvedApplications}</p>
                <p className="text-sm text-gray-600">Одобрено</p>
              </CardContent>
            </Card>
          </div>

          {/* Cars Management */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Управление автомобилями</h2>
                <Button
                  size="sm"
                  onClick={() => setShowCarForm(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Добавить
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              {carsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <LoadingCard key={index} />
                  ))}
                </div>
              ) : cars.length > 0 ? (
                <div className="space-y-3">
                  {cars.slice(0, 5).map((car) => (
                    <div
                      key={car.id}
                      className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
                    >
                      <img
                        src={car.image_url}
                        alt={`${car.brand} ${car.model}`}
                        className="w-16 h-12 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=100'
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {car.brand} {car.model}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {car.year} • {formatPrice(car.price)}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => {
                            setEditingCar(car)
                            setShowCarForm(true)
                          }}
                          className="p-2 text-gray-400 hover:text-primary-600 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCar(car)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {cars.length > 5 && (
                    <p className="text-center text-sm text-gray-500 pt-2">
                      И еще {cars.length - 5} автомобилей...
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Автомобили не добавлены</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => window.location.href = '/applications'}
            >
              <FileText className="w-4 h-4 mr-2" />
              Управление заявками
            </Button>
          </div>
        </div>

        {/* Car Form Modal */}
        {showCarForm && (
          <CarForm
            car={editingCar}
            onSubmit={handleCarSubmit}
            onCancel={() => {
              setShowCarForm(false)
              setEditingCar(undefined)
            }}
            loading={formLoading}
          />
        )}
      </div>
    </MobileLayout>
  )
}