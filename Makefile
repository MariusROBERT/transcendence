all:
	mkdir -p front/docker-storage back/docker-storage database/docker-storage
	docker-compose up -d --build

down :
	docker-compose down -v

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

.PHONY: all volumes down clean fclean re