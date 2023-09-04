echo "script started !"

if [ ! -d /app ]
then
  npm create-react-app /app --template typescript
fi

echo "create app done !"
npm install
echo "npm install done !"
npm update
echo "npm update done !"
npm run start
echo "npm start done !"