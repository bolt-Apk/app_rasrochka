/*
  # Create loan_applications table

  1. New Tables
    - `loan_applications`
      - `id` (uuid, primary key)
      - `car_id` (uuid, foreign key to cars.id, nullable)
      - `full_name` (text, not null) - ФИО клиента
      - `phone` (text, not null) - Телефон
      - `email` (text, not null) - Email
      - `monthly_income` (numeric, not null) - Ежемесячный доход (> 0)
      - `employment_type` (text, not null) - Тип занятости
      - `loan_amount` (numeric, not null) - Сумма кредита (> 0)
      - `down_payment` (numeric, not null) - Первоначальный взнос (>= 0)
      - `loan_term` (integer, not null) - Срок кредита в месяцах (1-120)
      - `monthly_payment` (numeric, not null) - Ежемесячный платеж (> 0)
      - `status` (text, not null, default 'Новая') - Статус заявки
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `loan_applications` table
    - Add policy for public to insert applications
    - Add policies for authenticated users to view and manage applications

  3. Indexes
    - Primary key on id
    - Foreign key to cars table with cascade delete
    - Indexes on car_id, email, phone, status, created_at for better performance
*/

CREATE TABLE IF NOT EXISTS loan_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid REFERENCES cars(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  monthly_income numeric NOT NULL,
  employment_type text NOT NULL,
  loan_amount numeric NOT NULL,
  down_payment numeric NOT NULL,
  loan_term integer NOT NULL,
  monthly_payment numeric NOT NULL,
  status text NOT NULL DEFAULT 'Новая',
  created_at timestamptz DEFAULT now()
);

-- Add constraints
ALTER TABLE loan_applications ADD CONSTRAINT loan_applications_monthly_income_check CHECK (monthly_income > 0);
ALTER TABLE loan_applications ADD CONSTRAINT loan_applications_loan_amount_check CHECK (loan_amount > 0);
ALTER TABLE loan_applications ADD CONSTRAINT loan_applications_down_payment_check CHECK (down_payment >= 0);
ALTER TABLE loan_applications ADD CONSTRAINT loan_applications_loan_term_check CHECK (loan_term > 0 AND loan_term <= 120);
ALTER TABLE loan_applications ADD CONSTRAINT loan_applications_monthly_payment_check CHECK (monthly_payment > 0);
ALTER TABLE loan_applications ADD CONSTRAINT loan_applications_status_check CHECK (status = ANY (ARRAY['Новая', 'На рассмотрении', 'Одобрена', 'Отклонена']));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS loan_applications_car_id_idx ON loan_applications (car_id);
CREATE INDEX IF NOT EXISTS loan_applications_email_idx ON loan_applications (email);
CREATE INDEX IF NOT EXISTS loan_applications_phone_idx ON loan_applications (phone);
CREATE INDEX IF NOT EXISTS loan_applications_status_idx ON loan_applications (status);
CREATE INDEX IF NOT EXISTS loan_applications_created_at_idx ON loan_applications (created_at);

-- Enable Row Level Security
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Applications can be inserted by anyone"
  ON loan_applications
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Applications are viewable by authenticated users"
  ON loan_applications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Applications can be updated by authenticated users"
  ON loan_applications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Applications can be deleted by authenticated users"
  ON loan_applications
  FOR DELETE
  TO authenticated
  USING (true);