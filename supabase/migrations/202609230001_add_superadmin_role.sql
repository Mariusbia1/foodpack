-- ==============================================================================
-- MIGRATION: AJOUT DU RÔLE SUPERADMIN & GESTION DE L'ÉQUIPE D'ADMINISTRATION
-- ==============================================================================

-- 1. Ajouter la valeur 'superadmin' à l'enum user_role si elle n'existe pas déjà
do $$
begin
  if not exists (
    select 1 from pg_enum 
    where enumlabel = 'superadmin' 
    and enumtypid = 'public.user_role'::regtype
  ) then
    alter type public.user_role add value 'superadmin';
  end if;
end $$;

-- 2. Mise à jour de la fonction utilitaire is_admin() pour inclure admin ET superadmin
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'superadmin')
  );
$$;

-- 3. Création de la fonction utilitaire is_superadmin()
create or replace function public.is_superadmin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'superadmin'
  );
$$;

-- 4. Promouvoir le premier administrateur existant ou l'administrateur principal en superadmin
update public.profiles
set role = 'superadmin'
where role = 'admin'
  and id = (
    select id from public.profiles
    where role = 'admin'
    order by created_at asc
    limit 1
  );

-- 5. Politique RLS pour permettre aux admins et superadmins de voir les profils
drop policy if exists "Admin total profiles" on public.profiles;
create policy "Admin total profiles" on public.profiles 
for all using (public.is_admin() or id = auth.uid());
