all:
	mkdir -p front/docker-storage back/docker-storage database/docker-storage
	docker-compose up -d --build

down:
	docker-compose down -v

up:
	docker-compose up -d

clean: down
	docker system prune -af --volumes

fclean: down
	docker system prune -af --volumes

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

.PHONY: all down up clean fclean ls lint lint-fix re