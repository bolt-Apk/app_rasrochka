/*
  # Create loan applications table

  1. New Tables
    - `loan_applications`
      - `id` (uuid, primary key)
      - `car_id` (uuid, foreign key to cars)
      - `full_name` (text) - Applicant full name
      - `phone` (text) - Phone number
      - `email` (text) - Email address
      - `monthly_income` (numeric) - Monthly income
      - `employment_type` (text) - Employment type
      - `loan_amount` (numeric) - Requested loan amount
      - `down_payment` (numeric) - Down payment amount
      - `loan_term` (integer) - Loan term in months
      - `monthly_payment` (numeric) - Monthly payment amount
      - `status` (text) - Application status
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on `loan_applications` table
    - Add policy for public insert access (for submitting applications)
    - Add policies for authenticated users to view and manage applications

  3. Indexes
    - Index on car_id for joins
    - Index on email for lookups
    - Index on phone for lookups
    - Index on status for filtering
    - Index on created_at for sorting

  4. Foreign Keys
    - car_id references cars(id) with CASCADE delete
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
  down_payment numeric NOT NULL DEFAULT 0,
  loan_term integer NOT NULL,
  monthly_payment numeric NOT NULL,
  status text NOT NULL DEFAULT 'Новая',
  created_at timestamptz DEFAULT now()
);

-- Add constraints
ALTER TABLE loan_applications 
ADD CONSTRAINT loan_applications_monthly_income_check CHECK (monthly_income > 0),
ADD CONSTRAINT loan_applications_loan_amount_check CHECK (loan_amount > 0),
ADD CONSTRAINT loan_applications_down_payment_check CHECK (down_payment >= 0),
ADD CONSTRAINT loan_applications_loan_term_check CHECK (loan_term > 0 AND loan_term <= 120),
ADD CONSTRAINT loan_applications_monthly_payment_check CHECK (monthly_payment > 0),
ADD CONSTRAINT loan_applications_status_check CHECK (status IN ('Новая', 'На рассмотрении', 'Одобрена', 'Отклонена'));

-- Create indexes
CREATE INDEX IF NOT EXISTS loan_applications_car_id_idx ON loan_applications (car_id);
CREATE INDEX IF NOT EXISTS loan_applications_email_idx ON loan_applications (email);
CREATE INDEX IF NOT EXISTS loan_applications_phone_idx ON loan_applications (phone);
CREATE INDEX IF NOT EXISTS loan_applications_status_idx ON loan_applications (status);
CREATE INDEX IF NOT EXISTS loan_applications_created_at_idx ON loan_applications (created_at);

-- Enable RLS
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