FROM python:3-alpine

WORKDIR /usr/instapy

COPY services /usr/instapy/services
COPY scripts /usr/instapy/scripts

RUN sh scripts/setup_service_config.sh

EXPOSE 3000

CMD ["sh", "scripts/start_service_config.sh"]
