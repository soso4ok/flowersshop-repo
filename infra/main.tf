terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0.2"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1.0"
    }
  }

  required_version = ">= 1.1.0"
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}

resource "random_pet" "suffix" {
  length = 2
}

# Resource Group
resource "azurerm_resource_group" "flowers_back-end-rg" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    Environment = "Development"
    Team        = "Back-end"
  }
}

