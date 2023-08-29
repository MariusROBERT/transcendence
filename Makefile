all:
	docker-compose up -d --build

down :
	docker-compose down -v

clean: down
	docker system prune -af --volumes

fclean: down
	docker system prune -af --volumes

re: fclean
	@make all

.PHONY: all volumes down clean fclean re