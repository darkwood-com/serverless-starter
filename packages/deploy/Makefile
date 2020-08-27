##
##usage :
##-------

COMPOSER        = composer

ensure-stage-variable:
	@if [ -z $(STAGE) ]; then \
	echo "You must prefix your command with the STAGE variable.\n"; \
	exit 1; \
	fi
	if [[ "$(STAGE)" != "prod" && "$(STAGE)" != "preprod" ]]; then \
	echo "You must prefix your command with the STAGE=[prod|preprod] variable.\n"; \
	exit 1; \
	fi

clean:
	rm -rf build

install: clean ## install
	cp .env.api.development ../api/.env.dev.local
	cp .env.front.development ../front/.env.development

pack: ensure-stage-variable ## STAGE=[prod|preprod] pack
	$(MAKE) pack-api
	$(MAKE) pack-front

pack-api: ensure-stage-variable
	rm -rf ./pack/$(STAGE)/api
	mkdir -p ./pack/$(STAGE)/api
	rsync -avr --exclude='vendor' --exclude='.env.*.local' --exclude='var' ../api ./pack/$(STAGE)

	rm -rf ./pack/$(STAGE)/api/.env.*
	cp .env.api.$(STAGE) ./pack/$(STAGE)/api/.env.local

	(cd ./pack/$(STAGE)/api && rm -rf ./config/jwt)
	(cd ./pack/$(STAGE)/api && mkdir -p ./config/jwt)
	(cd ./pack/$(STAGE)/api && openssl genrsa -out ./config/jwt/private.pem -aes256 -passout pass:serverless-starter 4096)
	(cd ./pack/$(STAGE)/api && openssl rsa -pubout -in ./config/jwt/private.pem -out ./config/jwt/public.pem -passin pass:serverless-starter)

	(cd ./pack/$(STAGE)/api && rm -rf var vendor)
	(cd ./pack/$(STAGE)/api && $(COMPOSER) install --prefer-dist --optimize-autoloader --no-dev)

pack-front: ensure-stage-variable
	rm -rf ./pack/$(STAGE)/front
	mkdir -p ./pack/$(STAGE)/front
	rsync -avr --exclude='node_modules' --exclude='public' --exclude='.cache' --exclude='.env.*' ../front ./pack/$(STAGE)

	rm -rf ./pack/$(STAGE)/front/.env.*
	cp .env.front.$(STAGE) ./pack/$(STAGE)/front/.env.local

	(cd ./pack/$(STAGE)/front && rm -rf .cache dist public node_modules)
	(cd ./pack/$(STAGE)/front && npm install)
	(cd ./pack/$(STAGE)/front && DOCS_PATH=../../../../../docs GATSBY_ACTIVE_ENV=local ./node_modules/.bin/gatsby build)

deploy: ensure-stage-variable ## STAGE=[prod|preprod] deploy
	$(MAKE) deploy-api
	$(MAKE) deploy-front

deploy-api: ensure-stage-variable pack-api
	rm -rf .serverless
	serverless deploy -s $(STAGE)

	BUCKET_NAME=$$(serverless info -v -s $(STAGE) | grep ApiBucketOutput | sed s/ApiBucketOutput\:\ //g) && \
	aws s3 sync ./pack/$(STAGE)/api/public s3://$$BUCKET_NAME/ --exclude="*.php" --cache-control "public, max-age=300"

deploy-front: ensure-stage-variable pack-front
	BUCKET_NAME=$$(serverless info -v -s $(STAGE) | grep FrontBucketOutput | sed s/FrontBucketOutput\:\ //g) && \
	aws s3 sync ./pack/$(STAGE)/front/public s3://$$BUCKET_NAME/ && \
	aws s3 cp "s3://$$BUCKET_NAME/index.html" "s3://$$BUCKET_NAME/index.html" --metadata-directive REPLACE --content-type "text/html" --cache-control max-age=0

.SILENT: ensure-stage-variable

# DEFAULT
.DEFAULT_GOAL := help
help:
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

##
