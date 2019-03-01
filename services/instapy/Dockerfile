FROM python:3-alpine

WORKDIR /usr/instapy

COPY services/instapy /usr/instapy/services/instapy
COPY services/python_shared /usr/instapy/services/python_shared

RUN sh services/instapy/setup.sh

CMD ["sh", "services/instapy/start.sh"]
