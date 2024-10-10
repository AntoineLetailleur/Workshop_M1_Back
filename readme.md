# Workshop - EPSI M1 EISI DEV - Lille

## GROUPE

Axel Laude : Dev BACK  
Daniel Fanion : Dev BACK  
Antoine LETAILLEUR : Dev BACK  
Eliseo MURILLO : Dev FRONT  
Thibault SCORIELLE : Dev FRONT  

## Installer l'API localement

`npm install`  
  
Depuis votre dossier 'app'  

`npx prisma generate`  // Pour générer le client Prisma
`npx prisma migrate deploy` // Pour appliquer les migrations  
  
Pour peupler votre base de données  
  
`npm run seed`  
  
## Lancer l'API

`npm start`

## Afficher variable d'environnement

`echo $env:DATABASE_URL`

## Lancer le container pour la base de données

`docker run --name some-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:latest`