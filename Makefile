REGISTRY=registry.phx.connexta.com:5000
IMAGE_OWNER=devops
IMAGE_NAME=blue-ocean-wallboard
GIT_BRANCH:=$(shell git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,' 2>/dev/null)
ifneq (${GIT_BRANCH}, master)
	IMAGE_TAG=${GIT_BRANCH}
else
	IMAGE_TAG=latest
endif
BUILD_TAG:=$(REGISTRY)/$(IMAGE_OWNER)/$(IMAGE_NAME):$(IMAGE_TAG)

PHONY: help
help: ## Display help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: image
image: ## Build docker image
	@echo "\nBuilding image: $(BUILD_TAG)\n"
	@docker build --pull -t $(BUILD_TAG) .

.PHONY: push
push: ## Push docker image
	@echo "\nPushing image: $(BUILD_TAG)\n"
	@docker push $(BUILD_TAG)
