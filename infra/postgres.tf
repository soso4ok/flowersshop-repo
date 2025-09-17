resource "azurerm_postgresql_flexible_server" "psql" {
  name                   = "${var.name_prefix}-psql"
  resource_group_name    = azurerm_resource_group.backend_rg.name
  location               = var.location

  administrator_login    = var.postgres_user
  administrator_password = var.postgres_password

  sku_name               = "B_Standard_B1ms"
  storage_mb             = 32768
  version                = "13"
  zone                   = "1"

  delegated_subnet_id    = azurerm_subnet.postgres_subnet.id
  private_dns_zone_id    = azurerm_private_dns_zone.private_dns_zone.id


  depends_on = [azurerm_private_dns_zone_virtual_network_link.dns_zone_link]

}

resource "azurerm_postgresql_flexible_server_database" "psql_db" {
  name      = var.postgres_db
  server_id = azurerm_postgresql_flexible_server.psql.id
  collation = "en_US.utf8"
  charset   = "UTF8"
}
