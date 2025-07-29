import React, { useState, useMemo } from 'react'
import { Search, Filter, SlidersHorizontal } from 'lucide-react'
import { Input, Select } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { MobileLayout } from '../components/layout/MobileLayout'
import { CarCard } from '../components/cars/CarCard'
import { LoadingCard } from '../components/ui/LoadingSpinner'
import { useCars } from '../hooks/useCars'
import { debounce } from '../lib/utils'

export function CatalogPage() {
  const { cars, loading } = useCars()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [yearRange, setYearRange] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Получаем уникальные марки
  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(cars.map(car => car.brand))].sort()
    return [
      { value: '', label: 'Все марки' },
      ...uniqueBrands.map(brand => ({ value: brand, label: brand }))
    ]
  }, [cars])

  const priceOptions = [
    { value: '', label: 'Любая цена' },
    { value: '0-1000000', label: 'До 1 млн ₽' },
    { value: '1000000-2000000', label: '1-2 млн ₽' },
    { value: '2000000-3000000', label: '2-3 млн ₽' },
    { value: '3000000-999999999', label: 'От 3 млн ₽' },
  ]

  const yearOptions = [
    { value: '', label: 'Любой год' },
    { value: '2020-2024', label: '2020-2024' },
    { value: '2015-2019', label: '2015-2019' },
    { value: '2010-2014', label: '2010-2014' },
    { value: '2000-2009', label: '2000-2009' },
  ]

  // Фильтрация автомобилей
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      // Поиск по названию
      const matchesSearch = searchQuery === '' || 
        `${car.brand} ${car.model}`.toLowerCase().includes(searchQuery.toLowerCase())

      // Фильтр по марке
      const matchesBrand = selectedBrand === '' || car.brand === selectedBrand

      // Фильтр по цене
      let matchesPrice = true
      if (priceRange) {
        const [minPrice, maxPrice] = priceRange.split('-').map(Number)
        matchesPrice = car.price >= minPrice && car.price <= maxPrice
      }

      // Фильтр по году
      let matchesYear = true
      if (yearRange) {
        const [minYear, maxYear] = yearRange.split('-').map(Number)
        matchesYear = car.year >= minYear && car.year <= maxYear
      }

      return matchesSearch && matchesBrand && matchesPrice && matchesYear
    })
  }, [cars, searchQuery, selectedBrand, priceRange, yearRange])

  const debouncedSearch = debounce((value: string) => {
    setSearchQuery(value)
  }, 300)

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedBrand('')
    setPriceRange('')
    setYearRange('')
  }

  const hasActiveFilters = selectedBrand || priceRange || yearRange

  return (
    <MobileLayout>
      <div className="bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-900 mb-4">
              Каталог автомобилей
            </h1>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Поиск по марке и модели..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Фильтры</span>
                {hasActiveFilters && (
                  <span className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    !
                  </span>
                )}
              </Button>
              
              <span className="text-sm text-gray-500">
                {filteredCars.length} автомобилей
              </span>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
              <div className="space-y-4 pt-4">
                <Select
                  label="Марка"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  options={brands}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Цена"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    options={priceOptions}
                  />
                  
                  <Select
                    label="Год"
                    value={yearRange}
                    onChange={(e) => setYearRange(e.target.value)}
                    options={yearOptions}
                  />
                </div>
                
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Сбросить фильтры
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <LoadingCard key={index} />
              ))}
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="space-y-4">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Автомобили не найдены
              </h3>
              <p className="text-gray-500 mb-4">
                Попробуйте изменить параметры поиска
              </p>
              {hasActiveFilters && (
                <Button variant="secondary" onClick={clearFilters}>
                  Сбросить фильтры
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  )
}