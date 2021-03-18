FROM python:3.8-slim-buster

WORKDIR /usr/instapy

COPY . .

RUN sed -i "s#deb http://deb.debian.org/debian buster main#deb http://deb.debian.org/debian buster main contrib non-free#g" /etc/apt/sources.list \
	&& apt-get update && apt-get install -y --no-install-recommends \
	wget gcc g++ \
	firefox-esr \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*

RUN pip3 install -r requirements.txt;

CMD ["python3", "-u", "start.py"]
