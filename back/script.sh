if [ ! -d /app ]
then
  nest new /app --package-manager yarn
  rm -rf /app/.git
fi

yarn install
yarn upgrade


# Accédez au répertoire /app
cd /app

# Installation des dépendances spécifiées
yarn add @nestjs/typeorm typeorm mysql2 class-validator class-transformer @nestjs/websockets @nestjs/platform-socket.io bcrypt
yarn add --dev @types/bcrypt @nestjs/passport passport @nestjs/jwt passport-jwt

yarn start