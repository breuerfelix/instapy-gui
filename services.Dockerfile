FROM python:3-alpine

WORKDIR /usr/instapy

COPY . .

RUN sh scripts/setup_docker.sh

EXPOSE 80

CMD ["sh", "scripts/start_services.sh"]
