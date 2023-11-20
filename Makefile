serve:
	mkdocs serve

build:
	rm -rf site
	mkdocs build

serve-docker:
	docker build . -t jjjaaa
	docker run -p 8080:8000 -v $(pwd):/d jjjaaa
