import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MobileLayout } from '../components/layout/MobileLayout'
import { CarDetails } from '../components/cars/CarDetails'
import { LoanApplicationForm } from '../components/applications/LoanApplicationForm'
import { LoadingPage } from '../components/ui/LoadingSpinner'
import { useCars } from '../hooks/useCars'
import { Car } from '../lib/supabase'

export function CarDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getCarById } = useCars()
  
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLoanForm, setShowLoanForm] = useState(false)

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) {
        navigate('/catalog')
        return
      }

      try {
        const { data, error } = await getCarById(id)
        if (error || !data) {
          alert('Автомобиль не найден')
          navigate('/catalog')
          return
        }
        setCar(data)
      } catch (error) {
        console.error('Error fetching car:', error)
        navigate('/catalog')
      } finally {
        setLoading(false)
      }
    }

    fetchCar()
  }, [id, getCarById, navigate])

  if (loading) {
    return <LoadingPage />
  }

  if (!car) {
    return null
  }

  if (showLoanForm) {
    return (
      <MobileLayout showBottomNav={false}>
        <LoanApplicationForm car={car} />
      </MobileLayout>
    )
  }

  return (
    <MobileLayout showBottomNav={false}>
      <CarDetails
        car={car}
        onApplyLoan={() => setShowLoanForm(true)}
      />
    </MobileLayout>
  )
}