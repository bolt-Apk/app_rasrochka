import React, { useState } from 'react'
import { X, Save, Upload } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input, Select, Textarea } from '../ui/Input'
import { Card, CardContent, CardHeader } from '../ui/Card'
import { Car } from '../../lib/supabase'

interface CarFormProps {
  car?: Car
  onSubmit: (car: Omit<Car, 'id' | 'created_at'>) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function CarForm({ car, onSubmit, onCancel, loading = false }: CarFormProps) {
  const [formData, setFormData] = useState({
    brand: car?.brand || '',
    model: car?.model || '',
    year: car?.year || new Date().getFullYear(),
    price: car?.price || 0,
    image_url: car?.image_url || '',
    engine: car?.engine || '',
    transmission: car?.transmission || '',
    fuel: car?.fuel || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const brandOptions = [
    { value: '', label: 'Выберите марку' },
    { value: 'Toyota', label: 'Toyota' },
    { value: 'Honda', label: 'Honda' },
    { value: 'Nissan', label: 'Nissan' },
    { value: 'Hyundai', label: 'Hyundai' },
    { value: 'Kia', label: 'Kia' },
    { value: 'Volkswagen', label: 'Volkswagen' },
    { value: 'BMW', label: 'BMW' },
    { value: 'Mercedes-Benz', label: 'Mercedes-Benz' },
    { value: 'Audi', label: 'Audi' },
    { value: 'Lada', label: 'Lada' },
    { value: 'Renault', label: 'Renault' },
    { value: 'Ford', label: 'Ford' },
    { value: 'Chevrolet', label: 'Chevrolet' },
    { value: 'Skoda', label: 'Skoda' },
  ]

  const transmissionOptions = [
    { value: '', label: 'Выберите КПП' },
    { value: 'Механическая', label: 'Механическая' },
    { value: 'Автоматическая', label: 'Автоматическая' },
    { value: 'Вариатор', label: 'Вариатор' },
    { value: 'Робот', label: 'Робот' },
  ]

  const fuelOptions = [
    { value: '', label: 'Выберите топливо' },
    { value: 'Бензин', label: 'Бензин' },
    { value: 'Дизель', label: 'Дизель' },
    { value: 'Гибрид', label: 'Гибрид' },
    { value: 'Электро', label: 'Электро' },
    { value: 'Газ', label: 'Газ' },
  ]

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.brand) newErrors.brand = 'Выберите марку'
    if (!formData.model.trim()) newErrors.model = 'Введите модель'
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Введите корректный год'
    }
    if (formData.price <= 0) newErrors.price = 'Цена должна быть больше 0'
    if (!formData.image_url.trim()) newErrors.image_url = 'Добавьте ссылку на изображение'
    if (!formData.engine.trim()) newErrors.engine = 'Введите тип двигателя'
    if (!formData.transmission) newErrors.transmission = 'Выберите КПП'
    if (!formData.fuel) newErrors.fuel = 'Выберите тип топлива'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const suggestImageUrl = () => {
    if (formData.brand && formData.model) {
      const query = `${formData.brand} ${formData.model} ${formData.year}`
      const pexelsUrl = `https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800`
      setFormData(prev => ({ ...prev, image_url: pexelsUrl }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {car ? 'Редактировать автомобиль' : 'Добавить автомобиль'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Марка *"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                options={brandOptions}
                error={errors.brand}
              />

              <Input
                label="Модель *"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                error={errors.model}
                placeholder="Camry"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Год выпуска *"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value) || 0)}
                error={errors.year}
                min={1900}
                max={new Date().getFullYear() + 1}
              />

              <Input
                label="Цена (₽) *"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                error={errors.price}
                min={0}
                placeholder="1500000"
              />
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Ссылка на изображение *
                </label>
                <button
                  type="button"
                  onClick={suggestImageUrl}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  Предложить
                </button>
              </div>
              <Input
                value={formData.image_url}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                error={errors.image_url}
                placeholder="https://example.com/car-image.jpg"
              />
              {formData.image_url && (
                <div className="mt-2">
                  <img
                    src={formData.image_url}
                    alt="Предварительный просмотр"
                    className="w-32 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>

            <Input
              label="Двигатель *"
              value={formData.engine}
              onChange={(e) => handleInputChange('engine', e.target.value)}
              error={errors.engine}
              placeholder="2.0 л, 150 л.с."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Коробка передач *"
                value={formData.transmission}
                onChange={(e) => handleInputChange('transmission', e.target.value)}
                options={transmissionOptions}
                error={errors.transmission}
              />

              <Select
                label="Тип топлива *"
                value={formData.fuel}
                onChange={(e) => handleInputChange('fuel', e.target.value)}
                options={fuelOptions}
                error={errors.fuel}
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                loading={loading}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {car ? 'Сохранить' : 'Добавить'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                className="flex-1"
              >
                Отмена
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}