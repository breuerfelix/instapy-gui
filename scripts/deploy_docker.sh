echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push felixbreuer/instapy-webserver:latest
docker push felixbreuer/instapy-service-config:latest
docker push felixbreuer/instapy-service-socket:latest
