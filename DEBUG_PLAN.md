# Plan de Debuggage - Praticiens Equivio

Si la page "Dentisterie équine" affiche "Aucun dentiste équin trouvé" (0 résultats), suivez ces étapes pour identifier la cause.

## 1. Vérifier les Logs Serveur (Debug Panel)
En mode développement (`npm run dev`), regardez la console de votre terminal (pas celle du navigateur). Vous verrez des logs commençant par `--- DEBUG PANEL: Dentisterie Équine ---`.

- **Si `Rows fetched: 0`** : La requête fonctionne mais ne trouve aucune correspondance.
- **Si une erreur s'affiche** : Lisez le message d'erreur Supabase retourné.

## 2. Vérifier la Chaîne de Caractères "specialty"
La requête filtre strictement sur la valeur : `'Dentisterie équine'`.
- Accédez à votre dashboard Supabase > Table Editor > `practitioners`.
- Vérifiez la colonne `specialty`.
- Si les valeurs sont "Dentiste équin", "Dentiste", ou "Dentisterie" (sans équine), vous devez soit :
  - Mettre à jour les données en base pour correspondre à `'Dentisterie équine'`.
  - OU modifier le mapping dans `src/app/praticiens/[specialite]/page.tsx` :
    ```typescript
    dentistes: "Autre Valeur",
    ```

## 3. Vérifier le Statut
Le code filtre strictement sur `status = 'active'`.
- Dans Supabase, vérifiez que vos praticiens ont bien `status = 'active'`.
- Si la colonne `status` n'existe pas ou contient d'autres valeurs (`published`, `validated`, etc.), ajustez la ligne `.eq('status', 'active')` dans le code.

## 4. Vérifier les Policies RLS (Row Level Security)
Si la table `practitioners` a RLS activé mais aucune policy `SELECT` pour le rôle `anon` (public), Supabase retournera 0 résultat (sans erreur explicite parfois).
- **Test :** Dans le dashboard Supabase > SQL Editor, exécutez :
  ```sql
  SELECT count(*) FROM practitioners WHERE specialty = 'Dentisterie équine';
  ```
  Si cela retourne des lignes mais que l'app en retourne 0, c'est un problème de RLS.
- **Solution :** Ajoutez une policy :
  ```sql
  create policy "Public Select" on practitioners for select using (true);
  ```

## 5. Vérifier la Table
Assurez-vous que le code requête bien la table `practitioners` et non une table d'import temporaire (ex: `import_practitioners_ready`).
- Le code actuel : `.from('practitioners')`

## Résumé des vérifications
1. **Table** : `practitioners`
2. **Filtre** : `specialty = 'Dentisterie équine'`
3. **Statut** : `status = 'active'`
4. **RLS** : Lecture publique autorisée
