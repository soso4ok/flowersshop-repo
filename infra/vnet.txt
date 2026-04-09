resource "azurerm_virtual_network" "vnet" {
  name                = "${var.name_prefix}-vnet"
  location            = var.location
  resource_group_name = azurerm_resource_group.backend_rg.name
  address_space       = ["10.0.0.0/16"]
}

resource "azurerm_subnet" "postgres_subnet" {
  name                = "${var.name_prefix}-postgres-subnet"
  resource_group_name = azurerm_resource_group.backend_rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]

  delegation {
    name = "dbforpostgresql"
    service_delegation {
      name = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = [
        "Microsoft.Network/virtualNetworks/subnets/join/action",
      ]
    }
  }
}

# Subnet for App Service VNet Integration
resource "azurerm_subnet" "app_service_subnet" {
  name                 = "${var.name_prefix}-appservice-subnet"
  resource_group_name  = azurerm_resource_group.backend_rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.2.0/24"]

  delegation {
    name = "appservice-delegation"
    service_delegation {
      name    = "Microsoft.Web/serverFarms"
      actions = ["Microsoft.Network/virtualNetworks/subnets/join/action"]
    }
  }
}


# Private DNS Zone for PostgreSQL
resource "azurerm_private_dns_zone" "private_dns_zone" {
  name                = "privatelink.postgres.database.azure.com"
  resource_group_name = azurerm_resource_group.backend_rg.name
}

# Link VNet to Private DNS Zone
resource "azurerm_private_dns_zone_virtual_network_link" "dns_zone_link" {
  name                  = "${var.name_prefix}-dns-link"
  resource_group_name   = azurerm_resource_group.backend_rg.name
  private_dns_zone_name = azurerm_private_dns_zone.private_dns_zone.name
  virtual_network_id    = azurerm_virtual_network.vnet.id
}

# VNet Integration for App Service
resource "azurerm_app_service_virtual_network_swift_connection" "app_vnet_integration" {
  app_service_id = azurerm_linux_web_app.backend_app.id
  subnet_id      = azurerm_subnet.app_service_subnet.id
}
