-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('student', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role app_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create registration_passcodes table for student registration
CREATE TABLE public.registration_passcodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passcode TEXT UNIQUE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on passcodes
ALTER TABLE public.registration_passcodes ENABLE ROW LEVEL SECURITY;

-- Only admins can view passcodes (we'll create the function below)
CREATE POLICY "Admins can view all passcodes"
  ON public.registration_passcodes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can insert passcodes"
  ON public.registration_passcodes FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Function to validate and use passcode
CREATE OR REPLACE FUNCTION public.validate_and_use_passcode(
  p_passcode TEXT,
  p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_passcode_id UUID;
BEGIN
  -- Check if passcode exists and is not used
  SELECT id INTO v_passcode_id
  FROM public.registration_passcodes
  WHERE passcode = p_passcode AND is_used = FALSE
  FOR UPDATE;
  
  IF v_passcode_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Mark passcode as used
  UPDATE public.registration_passcodes
  SET is_used = TRUE,
      used_by = p_user_id,
      used_at = NOW()
  WHERE id = v_passcode_id;
  
  RETURN TRUE;
END;
$$;

-- Function to handle new user signup and create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'student')
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = p_user_id;
$$;

-- Insert some initial passcodes for testing (can be changed later)
INSERT INTO public.registration_passcodes (passcode) VALUES
  ('BROTO2024'),
  ('STUDENT001'),
  ('WELCOME123');