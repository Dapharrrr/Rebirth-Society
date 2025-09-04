# Système d'Administration

## Configuration

### 1. Ajouter des emails admin

Modifiez le fichier `app/admin/config/adminConfig.ts` :

```typescript
export const ADMIN_EMAILS = [
  'admin@rebirthsociety.com',
  'votre-email@example.com', // Remplacez par votre email
  'autre-admin@example.com',  // Ajoutez d'autres admins
];
```

### 2. Comment ça fonctionne

- **Protection automatique** : La page `/admin` est automatiquement protégée
- **Vérification par email** : Seuls les utilisateurs avec un email dans la liste `ADMIN_EMAILS` peuvent accéder
- **Redirection automatique** : Les utilisateurs non autorisés sont redirigés vers la page d'accueil
- **Lien conditionnel** : Le lien "Admin" n'apparaît dans la navbar que pour les admins

### 3. Utilisation

#### Page Admin
```typescript
import AdminGuard from './components/AdminGuard';

export default function MaPageAdmin() {
  return (
    <AdminGuard>
      {/* Contenu protégé - visible seulement pour les admins */}
    </AdminGuard>
  );
}
```

#### Hook useIsAdmin
```typescript
import { useIsAdmin } from './components/AdminGuard';

function MonComposant() {
  const { isAdmin, isLoading } = useIsAdmin();
  
  if (isLoading) return <div>Chargement...</div>;
  if (!isAdmin) return <div>Accès refusé</div>;
  
  return <div>Contenu admin</div>;
}
```

### 4. Sécurité

- ✅ **Pas de modification du schéma Prisma** nécessaire
- ✅ **Protection côté client** avec redirection automatique
- ✅ **Configuration centralisée** dans un seul fichier
- ✅ **Facile à maintenir** et modifier

### 5. Ajouter de nouveaux admins

1. Modifiez `app/admin/config/adminConfig.ts`
2. Ajoutez l'email dans le tableau `ADMIN_EMAILS`
3. L'utilisateur doit se reconnecter pour que les changements prennent effet

### 6. Dépannage

- **Lien Admin invisible** : Vérifiez que l'email est bien dans `ADMIN_EMAILS`
- **Redirection en boucle** : Vérifiez que l'utilisateur est bien connecté
- **Accès refusé** : Vérifiez la console pour les erreurs de vérification 