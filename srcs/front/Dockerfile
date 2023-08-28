FROM	node:latest

RUN		#npm run build

WORKDIR	/app

COPY	./ft_crepesv2/* /app/

RUN		npm update && npm install
CMD		["npm", "start"]