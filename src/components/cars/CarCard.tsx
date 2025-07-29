import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Fuel, Settings, Zap } from 'lucide-react'
import { Card, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Car } from '../../lib/supabase'
import { formatPrice } from '../../lib/utils'

interface CarCardProps {
  car: Car
}

export function CarCard({ car }: CarCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/car/${car.id}`)
  }

  return (
    <Card onClick={handleClick} hover className="mobile-card">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={car.image_url}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800'
          }}
        />
        <div className="absolute top-4 right-4">
          <Badge variant="info" size="sm">
            {car.year}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {car.brand} {car.model}
            </h3>
            <p className="text-2xl font-bold text-primary-600 mt-1">
              {formatPrice(car.price)}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{car.year} год</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>{car.engine}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>{car.transmission}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Fuel className="w-4 h-4" />
              <span>{car.fuel}</span>
            </div>
          </div>
          
          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Рассрочка от <span className="font-semibold text-gray-900">
                {formatPrice(Math.round(car.price * 0.1))}
              </span> в месяц
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}