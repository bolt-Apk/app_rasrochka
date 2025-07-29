import React from 'react'
import { Calendar, Car, Phone, Mail, DollarSign } from 'lucide-react'
import { Card, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { LoanApplication } from '../../lib/supabase'
import { formatPrice, getStatusColor } from '../../lib/utils'

interface ApplicationCardProps {
  application: LoanApplication
  showActions?: boolean
  onStatusChange?: (id: string, status: LoanApplication['status']) => void
}

export function ApplicationCard({ 
  application, 
  showActions = false, 
  onStatusChange 
}: ApplicationCardProps) {
  const statusVariant = {
    'Новая': 'info' as const,
    'На рассмотрении': 'warning' as const,
    'Одобрена': 'success' as const,
    'Отклонена': 'error' as const,
  }

  const handleStatusChange = (status: LoanApplication['status']) => {
    if (onStatusChange) {
      onStatusChange(application.id, status)
    }
  }

  return (
    <Card className="mobile-card">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {application.full_name}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(application.created_at!).toLocaleDateString('ru-RU')}
            </p>
          </div>
          <Badge variant={statusVariant[application.status]}>
            {application.status}
          </Badge>
        </div>

        {/* Car Info */}
        {application.cars && (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={application.cars.image_url}
              alt={`${application.cars.brand} ${application.cars.model}`}
              className="w-12 h-10 object-cover rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=100'
              }}
            />
            <div className="flex-1">
              <p className="font-medium text-sm">
                {application.cars.brand} {application.cars.model}
              </p>
              <p className="text-xs text-gray-500">
                {application.cars.year} год • {formatPrice(application.cars.price)}
              </p>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{application.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{application.email}</span>
          </div>
        </div>

        {/* Loan Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Сумма кредита</p>
            <p className="font-semibold">{formatPrice(application.loan_amount)}</p>
          </div>
          <div>
            <p className="text-gray-500">Первый взнос</p>
            <p className="font-semibold">{formatPrice(application.down_payment)}</p>
          </div>
          <div>
            <p className="text-gray-500">Срок</p>
            <p className="font-semibold">{application.loan_term} мес</p>
          </div>
          <div>
            <p className="text-gray-500">Ежемесячно</p>
            <p className="font-semibold text-primary-600">
              {formatPrice(application.monthly_payment)}
            </p>
          </div>
        </div>

        {/* Employment Info */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Занятость:</span>
            <span className="font-medium">{application.employment_type}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-500">Доход:</span>
            <span className="font-medium">{formatPrice(application.monthly_income)}</span>
          </div>
        </div>

        {/* Admin Actions */}
        {showActions && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {application.status === 'Новая' && (
                <>
                  <button
                    onClick={() => handleStatusChange('На рассмотрении')}
                    className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition-colors"
                  >
                    В работу
                  </button>
                  <button
                    onClick={() => handleStatusChange('Одобрена')}
                    className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                  >
                    Одобрить
                  </button>
                  <button
                    onClick={() => handleStatusChange('Отклонена')}
                    className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors"
                  >
                    Отклонить
                  </button>
                </>
              )}
              
              {application.status === 'На рассмотрении' && (
                <>
                  <button
                    onClick={() => handleStatusChange('Одобрена')}
                    className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                  >
                    Одобрить
                  </button>
                  <button
                    onClick={() => handleStatusChange('Отклонена')}
                    className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors"
                  >
                    Отклонить
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}