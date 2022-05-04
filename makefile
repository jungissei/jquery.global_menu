
up:
	docker-compose up
dev:
	docker-compose up -d
	open http://localhost:8080/demo/index.html
down:
	docker-compose down --remove-orphans
restart:
	@make down
	@make up
app:
	docker-compose exec php bin/bash
