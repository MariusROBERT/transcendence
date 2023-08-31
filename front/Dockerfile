FROM	node:latest

WORKDIR	/

RUN		npm update -g
RUN		npm uninstall -g create-react-app

WORKDIR	/app

COPY	script.sh /
RUN		chmod +x /script.sh
CMD		["/script.sh"]
