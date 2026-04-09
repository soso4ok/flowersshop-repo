resource "azurerm_container_registry" "acr" {
  name                = replace(substr("${var.name_prefix}acr", 0, 50), "-", "")
  resource_group_name = azurerm_resource_group.backend_rg.name
  location            = var.location
  sku                 = "Basic"
  admin_enabled       = false
}

output "acr_name" {
  description = "The name of the Azure Container Registry."
  value       = azurerm_container_registry.acr.name
}