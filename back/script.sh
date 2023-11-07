if [ ! -d /app ]
then
  nest new /app --package-manager npm
  rm -rf /app/.git
fi

npm install
#npm upgrade

npm run build
npm start:prod

#nest build
#nest start --build
