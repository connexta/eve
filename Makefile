REGISTRY=registry.phx.connexta.com:5000
IMAGE_OWNER=devops
IMAGE_NAME=eve-wallboard
BUILD_TAG:=$(REGISTRY)/$(IMAGE_OWNER)/$(IMAGE_NAME)

include .env

.env:
	@echo ".env not found!"

PHONY: help
help: ## Display help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: image
image: ## Build docker image
	@echo "\nBuilding image: $(BUILD_TAG):$(GIT_BRANCH)\n"
	@docker build --pull -t $(BUILD_TAG):$(GIT_BRANCH) --build-arg SLACK_CHANNEL=$(SLACK_CHANNEL) --build-arg SLACK_TOKEN=$(SLACK_TOKEN) \
	--build-arg GITHUB_CLIENT_ID=$(GITHUB_CLIENT_ID) --build-arg GITHUB_CLIENT_SECRET=$(GITHUB_CLIENT_SECRET) \
	--build-arg NODE_ENV=production --build-arg SOAESB_BEARER_TOKEN=$(SOAESB_BEARER_TOKEN) .

.PHONY: push
push: ## Push docker image
	@echo "\nPushing image: $(BUILD_TAG):$(GIT_BRANCH)\n"
	@docker push $(BUILD_TAG):$(GIT_BRANCH)

###Developer Tools
.PHONY: pretty
pretty:
	@echo "Prettifying the world except node_modules"
	@yarn prettier --end-of-line lf --write "{,!(node_modules)/**/}*.js"

#disable auto conversion to crlf.
#Run only once!
.PHONY: lf
lf:
	@git config --global core.autocrlf false

.PHONY: run
run:
	@echo "RUNNING image: $$(docker images | grep -E 'master' | awk -e '{print $$3}')"
	@docker kill wallboard; docker run --rm -p 3000:3000 --name wallboard $$(docker images | grep -E 'master' | awk -e '{print $$3}'); docker kill wallboard

.PHONY: shell
shell:
	@docker exec -it wallboard /bin/sh

.PHONY: go
go:
	@echo "make images and run it!"
	@make image GIT_BRANCH=master
	@make run

.PHONY: killAll
killAll:
	@echo "kill all running and created docker images"
	@docker kill wallboard
	@echo "killing running docker image"
	@docker rmi -f $$(docker images -q)

