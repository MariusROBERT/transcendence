#builder
FROM	node:21-alpine as builder
WORKDIR	/app
COPY	docker-storage/package.json .
COPY	docker-storage/package-lock.json .
RUN		npm install
COPY	docker-storage .
RUN		npm run build

# nginx
FROM	nginx:1.25.3-alpine
WORKDIR	/etc/nginx/html
RUN		rm -rf ./*
COPY	--from=builder /app/build .
COPY	nginx/nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT	["nginx", "-g", "daemon off;"]