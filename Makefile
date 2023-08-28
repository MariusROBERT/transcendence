all: volumes
	docker-compose --project-directory srcs up -d --build

volumes:
	mkdir -p /home/$(USER)/data/wordpress
	mkdir -p /home/$(USER)/data/mariadb

down :
	docker-compose --project-directory srcs down -v

clean: down
	docker system prune -af --volumes

fclean: down
	docker system prune -af --volumes
	rm -rf /home/$(USER)/data/wordpress
	rm -rf /home/$(USER)/data/mariadb

re: fclean all

.PHONY: all volumes down clean fclean re