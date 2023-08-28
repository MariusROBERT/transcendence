all:
	docker-compose --project-directory srcs up -d --build

down :
	docker-compose --project-directory srcs down -v

clean: down
	docker system prune -af --volumes

fclean: down
	docker system prune -af --volumes

re: fclean all

.PHONY: all volumes down clean fclean re