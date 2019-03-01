FROM python:3-alpine

WORKDIR /usr/instapy

COPY services/config /usr/instapy/services/config
COPY services/python_shared /usr/instapy/services/python_shared

RUN sh services/config/setup.sh

EXPOSE 80

CMD ["sh", "services/config/start.sh"]
