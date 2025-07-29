import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Типы для базы данных
export interface Car {
  id: string
  brand: string
  model: string
  year: number
  price: number
  image_url: string
  engine: string
  transmission: string
  fuel: string
  created_at?: string
}

export interface LoanApplication {
  id: string
  car_id?: string
  full_name: string
  phone: string
  email: string
  monthly_income: number
  employment_type: string
  loan_amount: number
  down_payment: number
  loan_term: number
  monthly_payment: number
  status: 'Новая' | 'На рассмотрении' | 'Одобрена' | 'Отклонена'
  created_at?: string
  cars?: Car
}