-- ==============================================================================
-- MIGRATION: AJOUT DU SUPPORT DES VARIANTES & TARIFS PAR CONTENANCE / FORMAT
-- ==============================================================================

-- 1. Ajouter la colonne variants (jsonb) à la table products
alter table public.products 
add column if not exists variants jsonb not null default '[]'::jsonb;

-- Commentaire descriptif
comment on column public.products.variants is 'Liste des variantes du produit (ex: 250ml, 500ml, 1L) avec leurs tarifs respectifs et statuts de stock.';
