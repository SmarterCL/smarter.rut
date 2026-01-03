-- Add missing totalPrice column to accounts table
ALTER TABLE public.accounts 
ADD COLUMN "totalPrice" numeric;
