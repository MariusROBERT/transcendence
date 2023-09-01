if [ ! -d /app ]
then
  nest new /app --package-manager yarn
  rm -rf /app/.git
fi
npm install
npm update
npm run start:dev