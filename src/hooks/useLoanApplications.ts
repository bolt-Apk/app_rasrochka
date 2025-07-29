import { useState, useEffect } from 'react'
import { supabase, LoanApplication } from '../lib/supabase'

export function useLoanApplications() {
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('loan_applications')
        .select(`
          *,
          cars (
            id,
            brand,
            model,
            year,
            price,
            image_url
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки заявок')
    } finally {
      setLoading(false)
    }
  }

  const submitApplication = async (application: Omit<LoanApplication, 'id' | 'created_at' | 'status' | 'cars'>) => {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .insert([{
          ...application,
          status: 'Новая' as const
        }])
        .select(`
          *,
          cars (
            id,
            brand,
            model,
            year,
            price,
            image_url
          )
        `)
        .single()

      if (error) throw error
      setApplications(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Ошибка отправки заявки'
      return { data: null, error }
    }
  }

  const updateApplicationStatus = async (id: string, status: LoanApplication['status']) => {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .update({ status })
        .eq('id', id)
        .select(`
          *,
          cars (
            id,
            brand,
            model,
            year,
            price,
            image_url
          )
        `)
        .single()

      if (error) throw error
      setApplications(prev => prev.map(app => app.id === id ? data : app))
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Ошибка обновления статуса'
      return { data: null, error }
    }
  }

  const deleteApplication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('loan_applications')
        .delete()
        .eq('id', id)

      if (error) throw error
      setApplications(prev => prev.filter(app => app.id !== id))
      return { error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Ошибка удаления заявки'
      return { error }
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  return {
    applications,
    loading,
    error,
    fetchApplications,
    submitApplication,
    updateApplicationStatus,
    deleteApplication,
  }
}