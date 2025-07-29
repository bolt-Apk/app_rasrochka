/*
  # Recreate database schema

  This migration safely recreates the database schema by:
  1. Dropping existing tables if they exist
  2. Creating fresh tables with all constraints and policies
  3. Setting up proper Row Level Security

  ## New Tables
  - `cars` - Automobile catalog with all specifications
  - `loan_applications` - Loan applications linked to cars

  ## Security
  - Enable RLS on both tables
  - Public can view cars, only authenticated users can modify
  - Public can insert applications, authenticated users can manage them
*/

-- Drop existing tables and their dependencies
DROP TABLE IF EXISTS loan_applications CASCADE;
DROP TABLE IF EXISTS cars CASCADE;

-- Create cars table
CREATE TABLE cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price numeric NOT NULL,
  image_url text NOT NULL,
  engine text NOT NULL,
  transmission text NOT NULL,
  fuel text NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT cars_price_check CHECK (price > 0),
  CONSTRAINT cars_year_check CHECK (year >= 1900 AND year <= 2030)
);

-- Create loan_applications table
CREATE TABLE loan_applications (
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
  status text DEFAULT 'Новая' NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT loan_applications_monthly_income_check CHECK (monthly_income > 0),
  CONSTRAINT loan_applications_loan_amount_check CHECK (loan_amount > 0),
  CONSTRAINT loan_applications_down_payment_check CHECK (down_payment >= 0),
  CONSTRAINT loan_applications_loan_term_check CHECK (loan_term > 0 AND loan_term <= 120),
  CONSTRAINT loan_applications_monthly_payment_check CHECK (monthly_payment > 0),
  CONSTRAINT loan_applications_status_check CHECK (status = ANY (ARRAY['Новая'::text, 'На рассмотрении'::text, 'Одобрена'::text, 'Отклонена'::text]))
);

-- Create indexes for cars
CREATE INDEX cars_brand_idx ON cars (brand);
CREATE INDEX cars_year_idx ON cars (year);
CREATE INDEX cars_price_idx ON cars (price);
CREATE INDEX cars_created_at_idx ON cars (created_at);

-- Create indexes for loan_applications
CREATE INDEX loan_applications_car_id_idx ON loan_applications (car_id);
CREATE INDEX loan_applications_status_idx ON loan_applications (status);
CREATE INDEX loan_applications_email_idx ON loan_applications (email);
CREATE INDEX loan_applications_phone_idx ON loan_applications (phone);
CREATE INDEX loan_applications_created_at_idx ON loan_applications (created_at);

-- Enable RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

-- Cars policies
CREATE POLICY "Cars are viewable by everyone"
  ON cars FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Cars can be inserted by authenticated users"
  ON cars FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Cars can be updated by authenticated users"
  ON cars FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Cars can be deleted by authenticated users"
  ON cars FOR DELETE
  TO authenticated
  USING (true);

-- Loan applications policies
CREATE POLICY "Applications can be inserted by anyone"
  ON loan_applications FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Applications are viewable by authenticated users"
  ON loan_applications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Applications can be updated by authenticated users"
  ON loan_applications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Applications can be deleted by authenticated users"
  ON loan_applications FOR DELETE
  TO authenticated
  USING (true);