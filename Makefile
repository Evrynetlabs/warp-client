app_name = warp

.PHONY: dev
dev: 
	yarn start

.PHONY: build
build: 
	yarn build

.PHONY: compose-dev
compose-dev: compose-build compose-run

.PHONY: compose-build
compose-build: 
	docker-compose -f docker/docker-compose.yml build $(app_name)

.PHONY: compose-build-nocache
compose-build-nocache: 
	docker-compose -f docker/docker-compose.yml build --no-cache $(app_name)

.PHONY: compose-run
compose-run: 
	docker-compose -f docker/docker-compose.yml run --service-ports \
	-e WARP_ADDRESS=$(warp_address) \
	-e WARP_GRPC_HOST=$(grpc_host) \
	-e WARP_HTTP_PROVIDER_HOST=$(http_provider_host) \
	$(app_name)

.PHONY: compose-up
compose-up: 
	docker-compose -f docker/docker-compose.yml up $(app_name)

.PHONY: compose-down
compose-down: 
	docker-compose -f docker/docker-compose.yml down

.PHONY: test
test:
	yarn test --watchAll=false --coverage

.PHONY: lint
lint:
	yarn eslint:check