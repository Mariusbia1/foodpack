# Configuration Supabase — FOOD PACK

## 1. Créer le projet

Créez un projet sur Supabase, puis attendez que sa base de données soit prête.

## 2. Installer le schéma

Dans **SQL Editor**, ouvrez puis exécutez intégralement :

`supabase/schema_emballages.sql`

Le script crée les tables (`products`, `categories`, `product_images`, `orders`, `order_items`, `gallery_items`, `testimonials`, `site_settings`, `profiles`), les règles de sécurité RLS, les buckets de stockage public `catalog` et `gallery`, ainsi que les données d'initialisation.

## 3. Configurer le frontend local

Créez un fichier `.env.local` à la racine :

```env
VITE_SUPABASE_URL=https://VOTRE_PROJET.supabase.co
VITE_SUPABASE_ANON_KEY=VOTRE_CLE_PUBLIQUE
```

Ces valeurs se trouvent dans **Project Settings → API**. N’utilisez jamais la clé `service_role` dans le frontend.

Redémarrez ensuite Vite :

```bash
npm run dev
```

## 4. Créer le compte administrateur

Dans **Authentication → Users**, créez l’administrateur avec son e-mail et son mot de passe.

Dans **SQL Editor**, remplacez l’adresse ci-dessous et exécutez :

```sql
update public.profiles
set role = 'admin', full_name = 'Administrateur FOOD PACK'
where id = (
  select id from auth.users where email = 'admin@exemple.com'
);
```

La connexion se fera ensuite sur `/admin/connexion`.

## 5. Configurer Vercel

Dans **Project Settings → Environment Variables**, ajoutez :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Ajoutez-les aux environnements Production et Preview, puis relancez le déploiement.

## Sécurité

- Le catalogue publié est lisible publiquement.
- Les créations de commandes sont autorisées publiquement.
- Les modifications du catalogue, des commandes et du contenu exigent un compte ayant le rôle `admin`.
- Les images sont téléversées dans le bucket public `catalog`.
