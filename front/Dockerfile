FROM	node:latest

WORKDIR	/

RUN		npm update -g
RUN		npm uninstall -g create-react-app

RUN		npx create-react-app app --template typescript

WORKDIR	/app
RUN		npm update
CMD		["npm", "start"]