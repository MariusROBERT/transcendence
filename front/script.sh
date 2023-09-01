if [ ! -d /app ]
then
  npm create-react-app /app --template typescript
fi

npm install
npm update
npm start