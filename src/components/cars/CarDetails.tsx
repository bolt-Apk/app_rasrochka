import React from 'react'
import { Calendar, Fuel, Settings, Zap, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Car } from '../../lib/supabase'
import { formatPrice } from '../../lib/utils'

interface CarDetailsProps {
  car: Car
  onApplyLoan: () => void
}

export function CarDetails({ car, onApplyLoan }: CarDetailsProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-lg">Детали автомобиля</h1>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </div>

      {/* Image */}
      <div className="aspect-video relative">
        <img
          src={car.image_url}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800'
          }}
        />
        <div className="absolute top-4 right-4">
          <Badge variant="info">
            {car.year} год
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Title and Price */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {car.brand} {car.model}
          </h2>
          <p className="text-3xl font-bold text-primary-600">
            {formatPrice(car.price)}
          </p>
        </div>

        {/* Specifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Характеристики
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Год выпуска</span>
              </div>
              <span className="font-medium">{car.year}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Двигатель</span>
              </div>
              <span className="font-medium">{car.engine}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Коробка передач</span>
              </div>
              <span className="font-medium">{car.transmission}</span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <Fuel className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Топливо</span>
              </div>
              <span className="font-medium">{car.fuel}</span>
            </div>
          </div>
        </div>

        {/* Loan Info */}
        <div className="bg-primary-50 rounded-xl p-4">
          <h3 className="font-semibold text-primary-900 mb-2">
            Рассрочка без переплат
          </h3>
          <p className="text-primary-700 text-sm mb-3">
            Оформите автомобиль в рассрочку на выгодных условиях
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-primary-600">От</p>
              <p className="text-lg font-bold text-primary-900">
                {formatPrice(Math.round(car.price * 0.1))}
              </p>
              <p className="text-xs text-primary-600">в месяц</p>
            </div>
            <Button onClick={onApplyLoan} size="lg">
              Оформить рассрочку
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}