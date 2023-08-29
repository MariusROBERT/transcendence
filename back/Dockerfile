FROM	node:latest

WORKDIR /

RUN		npm update -g
RUN		npm i -g @nestjs/cli
RUN		nest new app --package-manager yarn

WORKDIR	/app
RUN		npm update
CMD		["npm", "run", "start:dev"]