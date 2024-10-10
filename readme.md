# Workshop - EPSI M1 EISI DEV - Lille  
  
## GROUPE  
  
Axel Laude : Dev BACK  
Daniel Fanion : Dev BACK  
Antoine LETAILLEUR : Dev BACK  
Eliseo MURILLO : Dev FRONT  
Thibault SCORIELLE : Dev FRONT  
  
## Installer l'API localement  
  
`npm install` // Pour installer toutes les dépendances qui se trouvent dans votre package.json  
`docker run --name some-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:latest` // Pour lancer le container Docker pour la base de données  
  
### Depuis votre dossier 'app'  
  
`npx prisma generate` // Pour générer le client Prisma  
`npx prisma migrate deploy` // Pour appliquer les migrations  
  
### Depuis votre répertoire parent  
  
`npm run seed` // Pour peupler votre base de données

## Lancer l'API

`npm start`  
  
## Afficher variable d'environnement
  
`echo $env:DATABASE_URL`  
