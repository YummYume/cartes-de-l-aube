COMPOSE=docker compose
COMPOSECI=docker compose -f compose.ci.yml
EXECAPI=$(COMPOSE) exec api
EXECFRONT=$(COMPOSE) exec front
ifeq (up,$(firstword $(MAKECMDGOALS)))
  # use the second argument for "up"
  UP_ENV_FILE := $(wordlist 2, 2, $(MAKECMDGOALS))
  # ...and turn them into do-nothing targets
  $(eval $(UP_ENV_FILE):;@:)
endif

# Starting and stopping the project
start:
	$(COMPOSE) build --force-rm
	$(COMPOSE) up -d --remove-orphans --force-recreate

start-nocache:
	$(COMPOSE) build --force-rm --no-cache
	$(COMPOSE) up -d --remove-orphans --force-recreate
start-ci:
	$(COMPOSECI) build --force-rm --no-cache
	$(COMPOSECI) up -d api front mongodb mariadb --remove-orphans --force-recreate

up:
ifndef UP_ENV_FILE
	$(COMPOSE) up -d --remove-orphans
else
	$(COMPOSE) --env-file ${UP_ENV_FILE} up -d --remove-orphans
endif

stop:
	$(COMPOSE) stop

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) restart

# SSH
ssh-api:
	$(EXECAPI) sh

bash-api:
	$(EXECAPI) bash

ssh-front:
	$(EXECFRONT) sh

bash-front:
	$(EXECFRONT) bash

# Logs
logs:
	$(COMPOSE) logs

logs-api:
	$(COMPOSE) logs api

logs-front:
	$(COMPOSE) logs front

# Utils
list-routes:
	$(EXECAPI) yarn list:routes

sync-operators:
	$(EXECAPI) yarn sync:operators

# Yarn
upgrade-api:
	$(EXECAPI) yarn upgrade-interactive

upgrade-latest-api:
	$(EXECAPI) yarn upgrade-interactive --latest

upgrade-front:
	$(EXECFRONT) yarn upgrade-interactive

upgrade-latest-front:
	$(EXECFRONT) yarn upgrade-interactive --latest

# Lint
lint-api:
	$(EXECAPI) yarn lint

lint-fix-api:
	$(EXECAPI) yarn lint:fix

format-api:
	$(EXECAPI) yarn format

format-fix-api:
	$(EXECAPI) yarn format:fix

lint-front:
	$(EXECFRONT) yarn lint

lint-fix-front:
	$(EXECFRONT) yarn lint:fix

format-front:
	$(EXECFRONT) yarn format

format-fix-front:
	$(EXECFRONT) yarn format:fix

# Testing
test-unit-front:
	$(EXECFRONT) yarn test:unit

test-unit-watch-front:
	$(EXECFRONT) yarn test:unit:watch

test-unit-api:
	$(EXECAPI) yarn test

gen-migration:
	$(EXECAPI) yarn typeorm migration:generate -o -p -d ./typeorm/data-source.js ./typeorm/migrations/$(n)