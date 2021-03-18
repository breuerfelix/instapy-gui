FROM python:3-alpine

WORKDIR /usr/instapy

COPY . .

RUN apk add --update --no-cache --virtual .build-dependencies \
  gcc g++ \
  musl-dev \
  libffi-dev \
  openssl-dev \
  python3-dev \
  cargo \
  && python -m pip install -r requirements.txt \
  && apk del .build-dependencies

EXPOSE 80

CMD ["python3", "-u", "start.py"]
