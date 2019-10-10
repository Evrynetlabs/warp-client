
# WARP-CLIENT

## This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), [Warp-js](https://github.com/evrynet-official/warp-js), and [Evrynet](https://evrynet.io).

## Available Scripts

In the project directory, you can run:

> ### `make dev`

For starting a dev server

If you want to only want to build the application, simply run:

> ### `make build`

And if you want to run the application as well, run:

> ### `make run`

For unit testing, run:

> ### `make unit-test`

On `make run` and `make build`, you can specify warp configuration environments through flags

Available flags: 

| Flag | Environment | Description |
| --- | --- | --- |
| `warp_address` | `WARP_ADDRESS` |address of warp contract|
| `grpc_host` | `WARP_GRPC_HOST` | grpc host from warp client to grpc proxy|
| `http_provider_host` | `WARP_HTTP_PROVIDER_HOST` |host of evrynet http provider |

Example:

> ### `make dev warp_address=foo grpc_host=http://localhost:8080 http_provider_host=http://localhost:8080`



