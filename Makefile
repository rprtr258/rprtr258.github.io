serve:
	mkdocs serve

build:
	rm -rf site
	mkdocs build

PWD:=$(shell pwd)

serve-docker:
	docker build . -t jjjaaa
	docker run -p 8080:8000 -v $(PWD):/d jjjaaa
