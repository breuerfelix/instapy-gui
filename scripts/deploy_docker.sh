echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push felixbreuer/instapy-webserver:latest
docker push felixbreuer/instapy-config:latest
docker push felixbreuer/instapy-auth:latest
docker push felixbreuer/instapy-socket:latest
docker push felixbreuer/instapy:latest
docker push felixbreuer/instapy-grafana:latest
