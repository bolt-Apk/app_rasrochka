import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Car, CreditCard, Shield, Clock, ArrowRight, Star } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { MobileLayout } from '../components/layout/MobileLayout'
import { useCars } from '../hooks/useCars'
import { CarCard } from '../components/cars/CarCard'
import { LoadingCard } from '../components/ui/LoadingSpinner'

export function HomePage() {
  const navigate = useNavigate()
  const { cars, loading } = useCars()

  const featuredCars = cars.slice(0, 3)

  const features = [
    {
      icon: CreditCard,
      title: 'Без переплат',
      description: 'Рассрочка без процентов и скрытых комиссий'
    },
    {
      icon: Clock,
      title: 'Быстрое одобрение',
      description: 'Решение по заявке за 30 минут'
    },
    {
      icon: Shield,
      title: 'Надежно',
      description: 'Официальные документы и гарантии'
    }
  ]

  return (
    <MobileLayout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative px-6 py-12 text-center">
            <div className="mb-6">
              <Car className="w-16 h-16 mx-auto mb-4 text-primary-100" />
              <h1 className="text-3xl font-bold mb-2">
                Авторассрочка
              </h1>
              <p className="text-primary-100 text-lg">
                Автомобили в рассрочку без переплат
              </p>
            </div>
            
            <div className="space-y-4">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/catalog')}
                className="w-full max-w-xs"
              >
                Выбрать автомобиль
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <p className="text-sm text-primary-100">
                Более 100 автомобилей в наличии
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="px-6 py-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Почему выбирают нас
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <Icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Featured Cars */}
        <div className="px-6 py-8 bg-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Популярные автомобили
            </h2>
            <button
              onClick={() => navigate('/catalog')}
              className="text-primary-600 text-sm font-medium hover:text-primary-700"
            >
              Все автомобили
            </button>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <LoadingCard key={index} />
              ))
            ) : (
              featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))
            )}
          </div>
          
          {!loading && featuredCars.length === 0 && (
            <div className="text-center py-8">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Автомобили скоро появятся</p>
            </div>
          )}
        </div>

        {/* How it works */}
        <div className="px-6 py-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Как это работает
          </h2>
          
          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Выберите автомобиль',
                description: 'Просмотрите каталог и найдите подходящий автомобиль'
              },
              {
                step: '2',
                title: 'Оформите заявку',
                description: 'Заполните простую форму и рассчитайте рассрочку'
              },
              {
                step: '3',
                title: 'Получите одобрение',
                description: 'Мы рассмотрим заявку и свяжемся с вами'
              },
              {
                step: '4',
                title: 'Заберите автомобиль',
                description: 'Подпишите документы и получите ключи'
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="px-6 py-8 bg-primary-50">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Готовы выбрать автомобиль?
            </h2>
            <p className="text-gray-600 mb-6">
              Более 100 автомобилей доступны в рассрочку
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/catalog')}
              className="w-full max-w-xs"
            >
              Перейти в каталог
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  )
}