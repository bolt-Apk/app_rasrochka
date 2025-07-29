/*
  # Create cars table

  1. New Tables
    - `cars`
      - `id` (uuid, primary key)
      - `brand` (text) - Car brand
      - `model` (text) - Car model  
      - `year` (integer) - Manufacturing year
      - `price` (numeric) - Car price
      - `image_url` (text) - Image URL
      - `engine` (text) - Engine type
      - `transmission` (text) - Transmission type
      - `fuel` (text) - Fuel type
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on `cars` table
    - Add policy for public read access
    - Add policies for authenticated users to manage cars

  3. Indexes
    - Index on brand for filtering
    - Index on price for sorting
    - Index on year for filtering
    - Index on created_at for sorting
*/

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

-- Add constraints
ALTER TABLE cars 
ADD CONSTRAINT cars_price_check CHECK (price > 0),
ADD CONSTRAINT cars_year_check CHECK (year >= 1900 AND year <= 2030);

-- Create indexes
CREATE INDEX IF NOT EXISTS cars_brand_idx ON cars (brand);
CREATE INDEX IF NOT EXISTS cars_price_idx ON cars (price);
CREATE INDEX IF NOT EXISTS cars_year_idx ON cars (year);
CREATE INDEX IF NOT EXISTS cars_created_at_idx ON cars (created_at);

-- Enable RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Create policies
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