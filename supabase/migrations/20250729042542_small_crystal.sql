/*
  # Create cars table

  1. New Tables
    - `cars`
      - `id` (uuid, primary key)
      - `brand` (text, not null)
      - `model` (text, not null)
      - `year` (integer, not null, 1900-2030)
      - `price` (numeric, not null, > 0)
      - `image_url` (text, not null)
      - `engine` (text, not null)
      - `transmission` (text, not null)
      - `fuel` (text, not null)
      - `created_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on `cars` table
    - Add policies for public read access
    - Add policies for authenticated user modifications

  3. Indexes
    - Index on brand for filtering
    - Index on price for sorting
    - Index on year for filtering
    - Index on created_at for ordering
*/

-- Create cars table if it doesn't exist
CREATE TABLE IF NOT EXISTS cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price numeric NOT NULL,
  image_url text NOT NULL,
  engine text NOT NULL,
  transmission text NOT NULL,
  fuel text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add constraints only if they don't exist
DO $$
BEGIN
  -- Check constraint for price
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'cars_price_check' 
    AND constraint_schema = 'public'
  ) THEN
    ALTER TABLE cars ADD CONSTRAINT cars_price_check CHECK (price > 0);
  END IF;

  -- Check constraint for year
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'cars_year_check' 
    AND constraint_schema = 'public'
  ) THEN
    ALTER TABLE cars ADD CONSTRAINT cars_year_check CHECK (year >= 1900 AND year <= 2030);
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS cars_brand_idx ON cars (brand);
CREATE INDEX IF NOT EXISTS cars_price_idx ON cars (price);
CREATE INDEX IF NOT EXISTS cars_year_idx ON cars (year);
CREATE INDEX IF NOT EXISTS cars_created_at_idx ON cars (created_at);

-- Enable RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Cars are viewable by everyone" ON cars;
DROP POLICY IF EXISTS "Cars can be inserted by authenticated users" ON cars;
DROP POLICY IF EXISTS "Cars can be updated by authenticated users" ON cars;
DROP POLICY IF EXISTS "Cars can be deleted by authenticated users" ON cars;

-- Create RLS policies
CREATE POLICY "Cars are viewable by everyone"
  ON cars
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Cars can be inserted by authenticated users"
  ON cars
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Cars can be updated by authenticated users"
  ON cars
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Cars can be deleted by authenticated users"
  ON cars
  FOR DELETE
  TO authenticated
  USING (true);