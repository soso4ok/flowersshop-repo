resource "azurerm_container_registry" "acr" {
  name                = "acrflowersdbcompanyx3f8a1"
  resource_group_name = azurerm_resource_group.flowers_back-end-rg.name
  location            = var.location
  sku                 = "Basic"
  admin_enabled       = false
}