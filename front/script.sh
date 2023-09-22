echo "script started !"

if [ ! -d /app ]
then
  npm create-react-app /app --template typescript
  echo "create app done !"
fi

npm install
echo "npm install done !"
#npm update
#echo "npm update done !"
npm run start