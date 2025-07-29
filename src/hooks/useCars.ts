import { useState, useEffect } from 'react'
import { supabase, Car } from '../lib/supabase'

export function useCars() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCars = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCars(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки автомобилей')
    } finally {
      setLoading(false)
    }
  }

  const addCar = async (car: Omit<Car, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .insert([car])
        .select()
        .single()

      if (error) throw error
      setCars(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Ошибка добавления автомобиля'
      return { data: null, error }
    }
  }

  const updateCar = async (id: string, updates: Partial<Car>) => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setCars(prev => prev.map(car => car.id === id ? data : car))
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Ошибка обновления автомобиля'
      return { data: null, error }
    }
  }

  const deleteCar = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id)

      if (error) throw error
      setCars(prev => prev.filter(car => car.id !== id))
      return { error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Ошибка удаления автомобиля'
      return { error }
    }
  }

  const getCarById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Ошибка загрузки автомобиля'
      return { data: null, error }
    }
  }

  useEffect(() => {
    fetchCars()
  }, [])

  return {
    cars,
    loading,
    error,
    fetchCars,
    addCar,
    updateCar,
    deleteCar,
    getCarById,
  }
}