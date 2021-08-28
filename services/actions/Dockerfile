FROM python:3.8

WORKDIR /usr/instapy

COPY . .

RUN pip3 install wheel && pip3 install -r requirements.txt

CMD ["python3", "-u", "main.py"]
