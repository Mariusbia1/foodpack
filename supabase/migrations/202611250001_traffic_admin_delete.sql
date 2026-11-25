-- Allow admins to delete traffic logs when resetting analytics to 0
drop policy if exists "Admin suppression traffic" on public.traffic_logs;
create policy "Admin suppression traffic"
  on public.traffic_logs
  for delete
  using (public.is_admin());
