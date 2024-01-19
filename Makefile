REGISTRY := 162728859685.dkr.ecr.us-west-1.amazonaws.com
DEPLOY_SHA := $(shell git rev-parse --short HEAD)
WEB_TAG := ${REGISTRY}/repository:web-${DEPLOY_SHA}

# default

ecr: web push-secrets

# ecr

ecr-login:
	@aws ecr get-login-password --region us-west-1 --profile prod | docker login --username AWS --password-stdin ${REGISTRY}

# secrets

read-secrets:
	@aws secretsmanager \
		get-secret-value \
		--secret-id $(shell aws secretsmanager list-secrets --query "SecretList[?Name=='ENV'].ARN|[0]" --output text --profile prod) \
		--query "SecretString" \
		--output text \
		--profile prod | jq

push-secrets:
	@aws secretsmanager \
		put-secret-value \
		--secret-id ENV \
		--secret-string \
			"{\"DATABASE_URL\": \"${PRODUCTION_DATABASE_URL}\", \
			  \"NEXTAUTH_SECRET\": \"${PRODUCTION_NEXTAUTH_SECRET}\", \
			  \"FACEBOOK_CLIENT_SECRET\": \"${FACEBOOK_CLIENT_SECRET}\", \
			  \"GOOGLE_CLIENT_SECRET\": \"${GOOGLE_CLIENT_SECRET}\", \
			  \"TWITTER_CLIENT_SECRET\": \"${TWITTER_CLIENT_SECRET}\", \
			  \"DISCORD_CLIENT_SECRET\": \"${DISCORD_CLIENT_SECRET}\", \
			  \"OPENAI_API_KEY\": \"${OPENAI_API_KEY}\"}" \
		--profile prod

# web

build-web:
	@docker build \
		-t ${WEB_TAG} \
		-f ./apps/web/Dockerfile \
		--build-arg DATABASE_URL=${DATABASE_URL} \
		--build-arg FACEBOOK_CLIENT_SECRET=${FACEBOOK_CLIENT_SECRET} \
		--build-arg GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET} \
		--build-arg TWITTER_CLIENT_SECRET=${TWITTER_CLIENT_SECRET} \
		--build-arg DISCORD_CLIENT_SECRET=${DISCORD_CLIENT_SECRET} \
		--build-arg OPENAI_API_KEY=${OPENAI_API_KEY} \
		.

# To debug, run with `--detach ${WEB_TAG} sleep infinity` and then
# open a shell with: `docker exec -it <id> /bin/bash`
run-web: build-web
	@docker run \
        --env AWS_ACCESS_KEY_ID=$(shell aws configure get aws_access_key_id) \
		--env AWS_SECRET_ACCESS_KEY=${shell aws configure get aws_secret_access_key} \
		--env DATABASE_URL=${PRODUCTION_DATABASE_URL} \
		--env NEXTAUTH_URL=http://localhost:3000 \
		--env FACEBOOK_CLIENT_SECRET=${FACEBOOK_CLIENT_SECRET} \
		--env GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET} \
		--env TWITTER_CLIENT_SECRET=${TWITTER_CLIENT_SECRET} \
		--env DISCORD_CLIENT_SECRET=${DISCORD_CLIENT_SECRET} \
		--env OPENAI_API_KEY=${OPENAI_API_KEY} \
		--publish 3000:3000 \
		${WEB_TAG}

push-web: ecr-login
	@docker push ${WEB_TAG}

web: build-web push-web
