/*
  # Create cars table

  1. New Tables
    - `cars`
      - `id` (uuid, primary key)
      - `brand` (text, not null) - Марка автомобиля
      - `model` (text, not null) - Модель автомобиля
      - `year` (integer, not null) - Год выпуска (1900-2030)
      - `price` (numeric, not null) - Цена (> 0)
      - `image_url` (text, not null) - Ссылка на изображение
      - `engine` (text, not null) - Тип двигателя
      - `transmission` (text, not null) - Коробка передач
      - `fuel` (text, not null) - Тип топлива
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `cars` table
    - Add policy for public to read all cars
    - Add policies for authenticated users to manage cars

  3. Indexes
    - Primary key on id
    - Indexes on brand, year, price, created_at for better query performance
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
ALTER TABLE cars ADD CONSTRAINT cars_year_check CHECK (year >= 1900 AND year <= 2030);
ALTER TABLE cars ADD CONSTRAINT cars_price_check CHECK (price > 0);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS cars_brand_idx ON cars (brand);
CREATE INDEX IF NOT EXISTS cars_year_idx ON cars (year);
CREATE INDEX IF NOT EXISTS cars_price_idx ON cars (price);
CREATE INDEX IF NOT EXISTS cars_created_at_idx ON cars (created_at);

-- Enable Row Level Security
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