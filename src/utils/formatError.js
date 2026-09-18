/**
 * Convertit toute erreur technique (Supabase, Auth, Réseau, Validation)
 * en un message clair, rassurant et compréhensible en français pour l'utilisateur/administrateur.
 */
export function formatErrorMessage(error, defaultMessage = 'Une erreur est survenue lors de l’opération. Veuillez réessayer.') {
  if (!error) return defaultMessage

  const message = typeof error === 'string' ? error : error.message || ''
  const code = error.code || ''
  const details = error.details || ''
  const fullText = `${message} ${code} ${details}`.toLowerCase()

  // 1. Erreurs de schéma ou de colonnes inconnues
  if (fullText.includes('could not find the') || fullText.includes('column of') || fullText.includes('schema cache')) {
    return 'Le formulaire a été envoyé avec un champ non reconnu par la base de données. Veuillez actualiser la page.'
  }

  // 2. Doublons (Unique constraint)
  if (fullText.includes('23505') || fullText.includes('duplicate key') || fullText.includes('unique constraint')) {
    if (fullText.includes('slug')) {
      return 'Un article ou une catégorie avec ce même nom ou identifiant (slug) existe déjà. Veuillez modifier le nom.'
    }
    if (fullText.includes('email')) {
      return 'Cette adresse e-mail est déjà enregistrée.'
    }
    if (fullText.includes('code')) {
      return 'Ce code promo existe déjà.'
    }
    return 'Un élément identique existe déjà dans le système.'
  }

  // 3. Clés étrangères (Foreign key violation / Suppression impossible)
  if (fullText.includes('23503') || fullText.includes('foreign key')) {
    return 'Cette action est impossible car cet élément est lié à d’autres données existantes (produits ou commandes).'
  }

  // 4. Authentification & RLS (Permissions)
  if (
    fullText.includes('jwt expired') ||
    fullText.includes('invalid refresh token') ||
    fullText.includes('permission denied') ||
    fullText.includes('row-level security') ||
    fullText.includes('unauthorized') ||
    fullText.includes('401') ||
    fullText.includes('403')
  ) {
    return 'Votre session a expiré ou vous n’avez pas les droits nécessaires. Veuillez vous reconnecter.'
  }

  // 5. Identifiants de connexion incorrects
  if (fullText.includes('invalid login credentials')) {
    return 'Adresse e-mail ou mot de passe incorrect.'
  }

  // 6. E-mail non confirmé
  if (fullText.includes('email not confirmed')) {
    return 'L’adresse e-mail n’a pas encore été confirmée.'
  }

  // 7. Mot de passe trop court
  if (fullText.includes('password should be at least') || fullText.includes('weak password')) {
    return 'Le mot de passe doit contenir au moins 6 caractères.'
  }

  // 8. Réseau / Serveur déconnecté
  if (
    fullText.includes('failed to fetch') ||
    fullText.includes('networkerror') ||
    fullText.includes('err_internet_disconnected') ||
    fullText.includes('network request failed')
  ) {
    return 'Impossible de contacter le serveur. Vérifiez votre connexion internet.'
  }

  // 9. Upload de fichier / Supabase Storage
  if (
    fullText.includes('payload too large') ||
    fullText.includes('entity too large') ||
    fullText.includes('storage') ||
    fullText.includes('bucket')
  ) {
    return 'L’image sélectionnée est trop volumineuse ou le format n’est pas valide (max 5 Mo recommandé).'
  }

  // 10. Élément non trouvé
  if (fullText.includes('pgrst116') || fullText.includes('not found') || fullText.includes('404')) {
    return 'L’élément demandé est introuvable ou a déjà été supprimé.'
  }

  // 11. Si le message original est déjà en français et concis
  if (
    message &&
    !message.includes('column') &&
    !message.includes('schema') &&
    !message.includes('PostgrestError') &&
    !message.includes('relation') &&
    !message.includes('syntax') &&
    !message.includes('JSON')
  ) {
    return message
  }

  return defaultMessage
}
