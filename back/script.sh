if [ ! -d /app ]
then
  nest new /app --package-manager yarn
  rm -rf /app/.git
fi

yarn install
yarn upgrade
yarn start