-- Créez un rôle (utilisateur) et définissez le mot de passe
CREATE ROLE guillaumesimonet WITH PASSWORD 'pwd'; -- mettre la var d'env

-- Créez une base de données et attribuez le rôle comme propriétaire
CREATE DATABASE guillaumesimonet OWNER = guillaumesimonet;

-- Accordez les autorisations nécessaires au rôle sur la base de données
GRANT ALL PRIVILEGES ON DATABASE guillaumesimonet TO nom_utilisateur;