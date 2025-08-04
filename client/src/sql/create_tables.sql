
-- Create bids table
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  freelancer_id UUID REFERENCES public.freelancers(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  message TEXT NOT NULL,
  delivery_time TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'paid')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bid_id UUID REFERENCES public.bids(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'completed', 'cancelled')),
  payment_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for bids
CREATE POLICY "freelancers_can_create_bids" ON public.bids
  FOR INSERT
  WITH CHECK (freelancer_id = auth.uid());

CREATE POLICY "freelancers_can_view_own_bids" ON public.bids
  FOR SELECT
  USING (freelancer_id = auth.uid());

CREATE POLICY "clients_can_view_bids_for_their_jobs" ON public.bids
  FOR SELECT
  USING (
    job_id IN (
      SELECT id FROM public.jobs WHERE client_id = auth.uid()
    )
  );

CREATE POLICY "clients_can_update_bid_status" ON public.bids
  FOR UPDATE
  USING (
    job_id IN (
      SELECT id FROM public.jobs WHERE client_id = auth.uid()
    )
  );

-- Create policies for orders
CREATE POLICY "users_can_view_own_orders" ON public.orders
  FOR SELECT
  USING (
    bid_id IN (
      SELECT b.id FROM public.bids b
      JOIN public.jobs j ON b.job_id = j.id
      WHERE j.client_id = auth.uid() OR b.freelancer_id = auth.uid()
    )
  );

CREATE POLICY "system_can_create_orders" ON public.orders
  FOR INSERT
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bids_job_id ON public.bids(job_id);
CREATE INDEX IF NOT EXISTS idx_bids_freelancer_id ON public.bids(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_orders_bid_id ON public.orders(bid_id);
