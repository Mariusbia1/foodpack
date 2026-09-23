-- ==============================================================================
-- MIGRATION: AJOUT DU RÔLE SUPERADMIN & GESTION DE L'ÉQUIPE D'ADMINISTRATION
-- ==============================================================================

-- 1. Ajouter la valeur 'superadmin' à l'enum user_role si elle n'existe pas déjà
alter type public.user_role add value if not exists 'superadmin';

-- 2. Mise à jour de la fonction utilitaire is_admin() pour inclure admin ET superadmin
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role::text in ('admin', 'superadmin')
  );
$$;

-- 3. Création de la fonction utilitaire is_superadmin()
create or replace function public.is_superadmin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role::text = 'superadmin'
  );
$$;

-- 4. Promouvoir le premier administrateur existant ou l'administrateur principal en superadmin
update public.profiles
set role = 'superadmin'::public.user_role
where role::text = 'admin'
  and id = (
    select id from public.profiles
    where role::text = 'admin'
    order by created_at asc
    limit 1
  );

-- 5. Politique RLS pour permettre aux admins et superadmins de voir les profils
drop policy if exists "Admin total profiles" on public.profiles;
create policy "Admin total profiles" on public.profiles 
for all using (public.is_admin() or id = auth.uid());
