REGISTRY=registry.phx.connexta.com:5000
IMAGE_OWNER=devops
IMAGE_NAME=eve-wallboard
IMAGE_TAG=master
BUILD_TAG:=$(REGISTRY)/$(IMAGE_OWNER)/$(IMAGE_NAME):$(IMAGE_TAG)

PHONY: help
help: ## Display help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: image
image: ## Build docker image
	@echo "\nBuilding image: $(BUILD_TAG)\n"
	@docker build --pull -t $(BUILD_TAG) --build-arg SLACK_CHANNEL=$(SLACK_CHANNEL) --build-arg SLACK_TOKEN=$(SLACK_TOKEN) .

.PHONY: push
push: ## Push docker image
	@echo "\nPushing image: $(BUILD_TAG)\n"
	@docker push $(BUILD_TAG)