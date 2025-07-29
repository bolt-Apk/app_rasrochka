/*
  # Create loan applications table

  1. New Tables
    - `loan_applications`
      - `id` (uuid, primary key)
      - `car_id` (uuid, foreign key to cars)
      - `full_name` (text, not null)
      - `phone` (text, not null)
      - `email` (text, not null)
      - `monthly_income` (numeric, not null, > 0)
      - `employment_type` (text, not null)
      - `loan_amount` (numeric, not null, > 0)
      - `down_payment` (numeric, not null, >= 0)
      - `loan_term` (integer, not null, 1-120 months)
      - `monthly_payment` (numeric, not null, > 0)
      - `status` (text, not null, default 'Новая')
      - `created_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on `loan_applications` table
    - Add policies for public insert access
    - Add policies for authenticated user read/update/delete

  3. Indexes
    - Index on car_id for joins
    - Index on email for lookups
    - Index on phone for lookups
    - Index on status for filtering
    - Index on created_at for ordering

  4. Foreign Keys
    - loan_applications.car_id -> cars.id (CASCADE DELETE)
*/

-- Create loan_applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS loan_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid,
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

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'loan_applications_car_id_fkey' 
    AND table_name = 'loan_applications'
  ) THEN
    ALTER TABLE loan_applications 
    ADD CONSTRAINT loan_applications_car_id_fkey 
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add check constraints only if they don't exist
DO $$
BEGIN
  -- Monthly income check
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'loan_applications_monthly_income_check' 
    AND constraint_schema = 'public'
  ) THEN
    ALTER TABLE loan_applications ADD CONSTRAINT loan_applications_monthly_income_check CHECK (monthly_income > 0);
  END IF;

  -- Loan amount check
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'loan_applications_loan_amount_check' 
    AND constraint_schema = 'public'
  ) THEN
    ALTER TABLE loan_applications ADD CONSTRAINT loan_applications_loan_amount_check CHECK (loan_amount > 0);
  END IF;

  -- Down payment check
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'loan_applications_down_payment_check' 
    AND constraint_schema = 'public'
  ) THEN
    ALTER TABLE loan_applications ADD CONSTRAINT loan_applications_down_payment_check CHECK (down_payment >= 0);
  END IF;

  -- Loan term check
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'loan_applications_loan_term_check' 
    AND constraint_schema = 'public'
  ) THEN
    ALTER TABLE loan_applications ADD CONSTRAINT loan_applications_loan_term_check CHECK (loan_term > 0 AND loan_term <= 120);
  END IF;

  -- Monthly payment check
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'loan_applications_monthly_payment_check' 
    AND constraint_schema = 'public'
  ) THEN
    ALTER TABLE loan_applications ADD CONSTRAINT loan_applications_monthly_payment_check CHECK (monthly_payment > 0);
  END IF;

  -- Status check
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'loan_applications_status_check' 
    AND constraint_schema = 'public'
  ) THEN
    ALTER TABLE loan_applications ADD CONSTRAINT loan_applications_status_check 
    CHECK (status IN ('Новая', 'На рассмотрении', 'Одобрена', 'Отклонена'));
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS loan_applications_car_id_idx ON loan_applications (car_id);
CREATE INDEX IF NOT EXISTS loan_applications_email_idx ON loan_applications (email);
CREATE INDEX IF NOT EXISTS loan_applications_phone_idx ON loan_applications (phone);
CREATE INDEX IF NOT EXISTS loan_applications_status_idx ON loan_applications (status);
CREATE INDEX IF NOT EXISTS loan_applications_created_at_idx ON loan_applications (created_at);

-- Enable RLS
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Applications can be inserted by anyone" ON loan_applications;
DROP POLICY IF EXISTS "Applications are viewable by authenticated users" ON loan_applications;
DROP POLICY IF EXISTS "Applications can be updated by authenticated users" ON loan_applications;
DROP POLICY IF EXISTS "Applications can be deleted by authenticated users" ON loan_applications;

-- Create RLS policies
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