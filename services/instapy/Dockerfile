FROM python:3.7-slim-buster

WORKDIR /usr/instapy

COPY . .

RUN sed -i "s#deb http://deb.debian.org/debian buster main#deb http://deb.debian.org/debian buster main contrib non-free#g" /etc/apt/sources.list \
	&& apt-get update && apt-get install -y --no-install-recommends \
	wget=1.20.1-1.1 gcc=4:8.3.0-1 g++=4:8.3.0-1 \
	firefox-esr=68.10.0esr-1~deb10u1 firefoxdriver=3.14.1-1\
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/*
	
RUN pip3 install -r requirements.txt;

CMD ["python3", "-u", "start.py"]
