if [ ! -d /app ]
then
  nest new /app --package-manager npm
  rm -rf /app/.git
fi

npm install
npm upgrade


# Accédez au répertoire /app
cd /app

npm run start:dev