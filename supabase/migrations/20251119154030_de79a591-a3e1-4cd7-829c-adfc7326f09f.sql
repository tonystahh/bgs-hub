-- Create a function to check if a passcode is valid without marking it as used
CREATE OR REPLACE FUNCTION public.check_passcode_valid(p_passcode text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.registration_passcodes
    WHERE passcode = p_passcode AND is_used = FALSE
  );
END;
$$;