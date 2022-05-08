
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
ghpages:
	git checkout -b gh-pages
	git push origin gh-pages
	git checkout main
	git branch -d gh-pages
plugins:
	cp node_modules/jquery/dist/jquery.min.js lib/common/js/jquery.min.js
	cp node_modules/destyle.css/destyle.min.css lib/common/css/destyle.min.css
