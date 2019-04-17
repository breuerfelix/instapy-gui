FROM python:3-alpine

WORKDIR /usr/instapy

COPY . .

RUN apk add --update --no-cache --virtual .build-dependencies \
	gcc \
	musl-dev \
  && pip3 install -r requirements.txt \
  && apk del .build-dependencies

EXPOSE 80

CMD ["python3", "-u", "start.py"]
