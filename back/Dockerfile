FROM	node:latest

WORKDIR /

RUN		npm update -g
RUN		npm i -g @nestjs/cli

WORKDIR	/app
COPY	script.sh /
RUN		chmod +x /script.sh
CMD		["/script.sh"]

#RUN yarn install && yarn upgrade
# CMD ["npm", " run start:dev"]