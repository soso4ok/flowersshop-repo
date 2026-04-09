terraform {
  backend "azurerm" {
    resource_group_name  = "tfstate-rg"
    storage_account_name = "fstateflowersa378f3"
    container_name       = "tfstate"
    key                  = "flowershop/prod.terraform.tfstate"
  }
}