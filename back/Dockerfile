FROM	node:21-alpine

WORKDIR /
RUN		npm i -g @nestjs/cli

WORKDIR	/app
COPY	docker-storage/package.json .
COPY	docker-storage/package-lock.json .
RUN		npm install
COPY	docker-storage .
RUN		npm run build
CMD		["npm", "run", "start:prod"]