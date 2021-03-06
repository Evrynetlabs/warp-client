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
	-e WARP_NATIVE_ASSET_CUSTODIAN_ADDRESS=$(native_asset_custodian_address) \
	-e WARP_STELLAR_CREDIT_CUSTODIAN_ADDRESS=$(stellar_credit_custodian_address) \
	-e WARP_EVRYNET_CREDIT_CUSTODIAN_ADDRESS=$(evrynet_credit_custodian_address) \
	-e WARP_GRPC_HOST=$(grpc_host) \
	-e WARP_HTTP_PROVIDER_HOST=$(http_provider_host) \
	-e WARP_STELLAR_ESCROW_ACCOUNT=$(stellar_escrow_account) \
	-e WARP_STELLAR_ISSUER=$(stellar_issuer) \
	-e WARP_STELLAR_NETWORK="$(stellar_network)" \
	$(app_name)

.PHONY: compose-up
compose-up: 
	docker-compose -f docker/docker-compose.yml up --build $(app_name)

.PHONY: compose-down
compose-down: 
	docker-compose -f docker/docker-compose.yml down

.PHONY: test
test:
	yarn test --watchAll=false --coverage

.PHONY: lint
lint:
	yarn eslint:check

.PHONY: format
format:
	yarn format