
# WARP-CLIENT

## This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), [Warp-js](https://github.com/evrynet-official/warp-js), and [Evrynet](https://evrynet.io).

## Available Scripts

In the project directory, you can run:

> `make compose-dev`

For full docker-compose local run, or

> `make compose-build`

For only building a docker compose images.

And if you only want to run the application with existing build services as well, run:

>  `make compose-run`

For unit testing, run:

>  `make test`

For Lint check, run:

>  `make lint`

On `make compose-run` and `make compose-build`, you can specify warp configuration environments through flags

Available flags: 

| Flag | Environment | Description |
| --- | --- | --- |
| `warp_address` | `WARP_ADDRESS` |address of warp contract|
| `grpc_host` | `WARP_GRPC_HOST` | grpc host from warp client to grpc proxy|
| `http_provider_host` | `WARP_HTTP_PROVIDER_HOST` |host of evrynet http provider |

Example:

> ### `make compose-dev warp_address=foo grpc_host=http://localhost:8080 http_provider_host=http://localhost:8080`



