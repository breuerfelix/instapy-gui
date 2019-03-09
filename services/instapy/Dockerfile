FROM python:3-alpine

WORKDIR /usr/instapy

COPY . .

RUN apk --update --no-cache add \
  chromium \
  chromium-chromedriver

RUN apk add --update --no-cache --virtual .build-dependencies \
	python3-dev \
	gcc \
	musl-dev \
	g++ \
  && pip3 install -r requirements.txt \
  && pip3 uninstall -y instapy-chromedriver \
  && apk del .build-dependencies

CMD ["sh", "start.sh"]
