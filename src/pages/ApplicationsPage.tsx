import React, { useState } from 'react'
import { FileText, Filter } from 'lucide-react'
import { MobileLayout } from '../components/layout/MobileLayout'
import { ApplicationCard } from '../components/applications/ApplicationCard'
import { LoadingCard } from '../components/ui/LoadingSpinner'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Input'
import { useLoanApplications } from '../hooks/useLoanApplications'
import { useAuth } from '../hooks/useAuth'
import { LoanApplication } from '../lib/supabase'

export function ApplicationsPage() {
  const { applications, loading, updateApplicationStatus } = useLoanApplications()
  const { isAdmin } = useAuth()
  const [statusFilter, setStatusFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const statusOptions = [
    { value: '', label: 'Все статусы' },
    { value: 'Новая', label: 'Новые' },
    { value: 'На рассмотрении', label: 'На рассмотрении' },
    { value: 'Одобрена', label: 'Одобренные' },
    { value: 'Отклонена', label: 'Отклоненные' },
  ]

  const filteredApplications = applications.filter(app => 
    statusFilter === '' || app.status === statusFilter
  )

  const handleStatusChange = async (id: string, status: LoanApplication['status']) => {
    try {
      const { error } = await updateApplicationStatus(id, status)
      if (error) {
        alert('Ошибка при обновлении статуса: ' + error)
      }
    } catch (error) {
      alert('Произошла ошибка при обновлении статуса')
    }
  }

  const getStatusCounts = () => {
    return {
      total: applications.length,
      new: applications.filter(app => app.status === 'Новая').length,
      inProgress: applications.filter(app => app.status === 'На рассмотрении').length,
      approved: applications.filter(app => app.status === 'Одобрена').length,
      rejected: applications.filter(app => app.status === 'Отклонена').length,
    }
  }

  const counts = getStatusCounts()

  return (
    <MobileLayout>
      <div className="bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-900 mb-4">
              {isAdmin() ? 'Управление заявками' : 'Мои заявки'}
            </h1>

            {/* Stats for admin */}
            {isAdmin() && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-600">Новые</p>
                  <p className="text-2xl font-bold text-blue-900">{counts.new}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3">
                  <p className="text-sm text-yellow-600">В работе</p>
                  <p className="text-2xl font-bold text-yellow-900">{counts.inProgress}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-green-600">Одобрено</p>
                  <p className="text-2xl font-bold text-green-900">{counts.approved}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-sm text-red-600">Отклонено</p>
                  <p className="text-2xl font-bold text-red-900">{counts.rejected}</p>
                </div>
              </div>
            )}

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Фильтры</span>
              </Button>
              
              <span className="text-sm text-gray-500">
                {filteredApplications.length} заявок
              </span>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
              <div className="pt-4">
                <Select
                  label="Статус"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={statusOptions}
                />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <LoadingCard key={index} />
              ))}
            </div>
          ) : filteredApplications.length > 0 ? (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  showActions={isAdmin()}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {statusFilter ? 'Заявки не найдены' : 'Заявок пока нет'}
              </h3>
              <p className="text-gray-500 mb-4">
                {statusFilter 
                  ? 'Попробуйте изменить фильтр'
                  : isAdmin() 
                    ? 'Заявки от клиентов появятся здесь'
                    : 'Выберите автомобиль и оформите заявку на рассрочку'
                }
              </p>
              {statusFilter && (
                <Button 
                  variant="secondary" 
                  onClick={() => setStatusFilter('')}
                >
                  Показать все заявки
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  )
}