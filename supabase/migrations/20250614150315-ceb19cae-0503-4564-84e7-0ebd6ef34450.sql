
-- Create support_chats table for client/freelancer to admin communication
CREATE TABLE public.support_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('client', 'freelancer')),
  subject TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create support_messages table
CREATE TABLE public.support_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  support_chat_id UUID REFERENCES public.support_chats(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('client', 'freelancer', 'admin')),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for support_chats
ALTER TABLE public.support_chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own support chats" 
  ON public.support_chats 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own support chats" 
  ON public.support_chats 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own support chats" 
  ON public.support_chats 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add RLS policies for support_messages
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view support messages for their chats" 
  ON public.support_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.support_chats 
      WHERE id = support_chat_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create support messages for their chats" 
  ON public.support_messages 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.support_chats 
      WHERE id = support_chat_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update support messages they sent" 
  ON public.support_messages 
  FOR UPDATE 
  USING (auth.uid() = sender_id);

-- Update notifications table to include more notification types
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS chat_id UUID,
ADD COLUMN IF NOT EXISTS support_chat_id UUID;

-- Create function to get unread message count for a user
CREATE OR REPLACE FUNCTION get_unread_message_count(user_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  count_result INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO count_result
  FROM public.messages m
  JOIN public.chats c ON m.chat_id = c.id
  WHERE (c.client_id = user_uuid OR c.freelancer_id = user_uuid)
    AND m.sender_id != user_uuid
    AND m.read = false;
  
  RETURN COALESCE(count_result, 0);
END;
$$;

-- Create function to get unread support message count for a user
CREATE OR REPLACE FUNCTION get_unread_support_message_count(user_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  count_result INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO count_result
  FROM public.support_messages sm
  JOIN public.support_chats sc ON sm.support_chat_id = sc.id
  WHERE sc.user_id = user_uuid
    AND sm.sender_id != user_uuid
    AND sm.read = false;
  
  RETURN COALESCE(count_result, 0);
END;
$$;

-- Create function to get total notification count for a user
CREATE OR REPLACE FUNCTION get_notification_count(user_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  count_result INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO count_result
  FROM public.notifications
  WHERE user_id = user_uuid
    AND read = false;
  
  RETURN COALESCE(count_result, 0);
END;
$$;
