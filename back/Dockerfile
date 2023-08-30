FROM	node:latest

WORKDIR /

RUN		npm i -g @nestjs/cli
RUN		nest new app --package-manager yarn

WORKDIR	/app
COPY	script.sh /
RUN		chmod +x /script.sh
CMD		["/script.sh"]