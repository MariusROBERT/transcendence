echo "script started !"

if [ ! -d /app ]
then
  npm create-react-app /app --template typescript
  echo "create app done !"
fi

npm install
echo "npm install done !"



##npm install -g serve
##serve -s build -l 3000