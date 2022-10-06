FROM docker.io/library/python:alpine
WORKDIR /tmp
RUN apk add --update --no-cache --virtual .build-deps gcc musl-dev g++ gfortran &&\
    apk add --no-cache git ca-certificates curl &&\
    pip install --no-cache-dir mkdocs-material mkdocs-awesome-pages-plugin mkdocs-table-reader-plugin &&\
    apk del .build-deps
WORKDIR /d
CMD ["mkdocs", "serve", "-a", "0.0.0.0:8000"]
