FROM python:3-alpine

WORKDIR /usr/instapy

COPY services /usr/instapy/services
COPY scripts /usr/instapy/scripts

RUN sh scripts/setup_service_socket.sh

EXPOSE 3001

CMD ["sh", "scripts/start_service_socket.sh"]
