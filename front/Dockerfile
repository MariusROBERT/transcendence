FROM	node:latest

WORKDIR	/

RUN		npm uninstall -g create-react-app

RUN		npx create-react-app app --template typescript
EXPOSE	3000

WORKDIR	/app
CMD		["npm", "start"]