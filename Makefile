APP_NAME = warp

.PHONY: dev
dev: build run

.PHONY: build
build: 
	docker-compose -f docker/docker-compose.yml build $(APP_NAME)

.PHONY: build-nocache
build-nocache: 
	docker-compose -f docker/docker-compose.yml build --no-cache $(APP_NAME)

.PHONY: run
run: 
	docker-compose -f docker/docker-compose.yml run --service-ports \
	-e WARP_ADDRESS=$(warp_address) \
	-e WARP_GRPC_HOST=$(grpc_host) \
	-e WARP_HTTP_PROVIDER_HOST=$(http_provider_host) \
	$(APP_NAME)

.PHONY: up
up: 
	docker-compose -f docker/docker-compose.yml up --build

.PHONY: down
down: 
	docker-compose -f docker/docker-compose.yml down

.PHONY: unit-test
unit-test:
	yarn test