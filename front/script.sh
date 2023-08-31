if [ ! -d /app ]
then
  npx create-react-app /app --template typescript
fi

npm install
npm update
npm start