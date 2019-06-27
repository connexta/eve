REGISTRY=registry.phx.connexta.com:5000
IMAGE_OWNER=devops
IMAGE_NAME=eve-wallboard
GIT_BRANCH:=$(shell git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,' 2>/dev/null)
ifneq (${GIT_BRANCH}, master)
	IMAGE_TAG=${GIT_BRANCH}
else
	IMAGE_TAG=latest
endif
BUILD_TAG:=$(REGISTRY)/$(IMAGE_OWNER)/$(IMAGE_NAME):$(IMAGE_TAG)

<<<<<<< HEAD
.PHONY: help
=======
PHONY: help
>>>>>>> 3599bcefa6296a10ec1d068dbd63822c8e8d406f
help: ## Display help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: image
image: ## Build docker image
	@echo "\nBuilding image: $(BUILD_TAG)\n"
	@docker build --pull -t $(BUILD_TAG) .

.PHONY: push
push: ## Push docker image
	@echo "\nPushing image: $(BUILD_TAG)\n"
<<<<<<< HEAD
	@docker push $(BUILD_TAG)
=======
	@docker push $(BUILD_TAG)
>>>>>>> 3599bcefa6296a10ec1d068dbd63822c8e8d406f
