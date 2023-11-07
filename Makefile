all:
	mkdir -p front/docker-storage back/docker-storage database/docker-storage
	rm -rf back/docker-storage/node_modules front/docker-storage/node_modules
	docker-compose up -d --build

dev:
	mkdir -p front/docker-storage back/docker-storage database/docker-storage
	docker-compose -f docker-compose-dev.yml up -d --build

down:
	docker-compose down -v

up:
	docker-compose up -d

clean: down
	docker system prune -af --volumes

fclean: down
	docker system prune -af --volumes

ssl:
	mkdir -p front/nginx/security back/docker-storage/security
	openssl req -x509 -nodes -newkey rsa:4096 -out front/nginx/security/fullchain.pem -keyout front/nginx/security/privkey.pem -subj "/C=FR"
	cp front/nginx/security/fullchain.pem back/docker-storage/security
	cp front/nginx/security/privkey.pem back/docker-storage/security

re: fclean
	@make all

ls:
	@docker ps -a
	@echo ""
	@docker volume ls
	@echo ""
	@docker images

lint:
	docker exec -it front npm run lint
	docker exec -it back npm run lint

lint-fix:
	docker exec -it front npm run lint:fix
	docker exec -it back npm run lint:fix

install:
	docker exec -it front npm install
	docker exec -it back npm install

.PHONY: all down up clean fclean ls lint lint-fix install re