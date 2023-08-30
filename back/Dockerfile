FROM	node:latest

WORKDIR /

RUN		npm update -g
RUN		npm i -g @nestjs/cli
RUN		nest new app --package-manager yarn
RUN		rm -rf /app/.git

WORKDIR	/app
COPY	script.sh /
RUN		chmod +x /script.sh
CMD		["/script.sh"]