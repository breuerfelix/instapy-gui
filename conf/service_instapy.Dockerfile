FROM python:3-alpine

WORKDIR /usr/instapy

COPY services /usr/instapy/services
COPY scripts /usr/instapy/scripts

RUN sh scripts/setup_service_instapy.sh

CMD ["sh", "scripts/start_service_instapy.sh"]
