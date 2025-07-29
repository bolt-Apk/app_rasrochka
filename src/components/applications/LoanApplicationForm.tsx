import React, { useState } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Input, Select } from '../ui/Input'
import { Card, CardContent, CardHeader } from '../ui/Card'
import { LoanCalculator } from '../cars/LoanCalculator'
import { Car } from '../../lib/supabase'
import { useLoanApplications } from '../../hooks/useLoanApplications'
import { formatPrice } from '../../lib/utils'

interface LoanApplicationFormProps {
  car: Car
}

interface FormData {
  fullName: string
  phone: string
  email: string
  monthlyIncome: string
  employmentType: string
}

interface LoanData {
  loanAmount: number
  downPayment: number
  loanTerm: number
  monthlyPayment: number
}

export function LoanApplicationForm({ car }: LoanApplicationFormProps) {
  const navigate = useNavigate()
  const { submitApplication } = useLoanApplications()
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    monthlyIncome: '',
    employmentType: ''
  })
  
  const [loanData, setLoanData] = useState<LoanData>({
    loanAmount: 0,
    downPayment: 0,
    loanTerm: 36,
    monthlyPayment: 0
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const employmentOptions = [
    { value: '', label: 'Выберите тип занятости' },
    { value: 'Наемный работник', label: 'Наемный работник' },
    { value: 'ИП', label: 'Индивидуальный предприниматель' },
    { value: 'Самозанятый', label: 'Самозанятый' },
    { value: 'Пенсионер', label: 'Пенсионер' },
    { value: 'Студент', label: 'Студент' },
  ]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Введите ФИО'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона'
    } else if (!/^\+?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Введите корректный номер телефона'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Введите email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email'
    }

    if (!formData.monthlyIncome.trim()) {
      newErrors.monthlyIncome = 'Введите ежемесячный доход'
    } else if (parseFloat(formData.monthlyIncome) <= 0) {
      newErrors.monthlyIncome = 'Доход должен быть больше 0'
    }

    if (!formData.employmentType) {
      newErrors.employmentType = 'Выберите тип занятости'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    
    try {
      const { error } = await submitApplication({
        car_id: car.id,
        full_name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        monthly_income: parseFloat(formData.monthlyIncome),
        employment_type: formData.employmentType,
        loan_amount: loanData.loanAmount,
        down_payment: loanData.downPayment,
        loan_term: loanData.loanTerm,
        monthly_payment: loanData.monthlyPayment,
      })

      if (error) {
        alert('Ошибка при отправке заявки: ' + error)
        return
      }

      alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.')
      navigate('/applications')
    } catch (error) {
      alert('Произошла ошибка при отправке заявки')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-lg">Заявка на рассрочку</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Информация об автомобиле */}
        <Card>
          <CardContent className="p-4">
            <div className="flex space-x-4">
              <img
                src={car.image_url}
                alt={`${car.brand} ${car.model}`}
                className="w-20 h-16 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=200'
                }}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {car.brand} {car.model}
                </h3>
                <p className="text-sm text-gray-600">{car.year} год</p>
                <p className="text-lg font-bold text-primary-600">
                  {formatPrice(car.price)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Калькулятор */}
        <LoanCalculator
          carPrice={car.price}
          onCalculate={setLoanData}
        />

        {/* Форма заявки */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Личные данные</h3>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="ФИО *"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                error={errors.fullName}
                placeholder="Иванов Иван Иванович"
              />

              <Input
                label="Номер телефона *"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={errors.phone}
                placeholder="+7 (999) 123-45-67"
              />

              <Input
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                placeholder="ivan@example.com"
              />

              <Input
                label="Ежемесячный доход *"
                type="number"
                value={formData.monthlyIncome}
                onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                error={errors.monthlyIncome}
                placeholder="50000"
                helperText="Укажите доход в рублях"
              />

              <Select
                label="Тип занятости *"
                value={formData.employmentType}
                onChange={(e) => handleInputChange('employmentType', e.target.value)}
                error={errors.employmentType}
                options={employmentOptions}
              />

              <div className="pt-4">
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                  size="lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Отправить заявку
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Дополнительная информация */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Что происходит после подачи заявки?
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>1. Мы рассмотрим вашу заявку в течение 30 минут</p>
              <p>2. Свяжемся с вами для уточнения деталей</p>
              <p>3. При одобрении пригласим для оформления документов</p>
              <p>4. Вы получите автомобиль в день подписания договора</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}