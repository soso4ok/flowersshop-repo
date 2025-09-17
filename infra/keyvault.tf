resource "azurerm_key_vault" "kv" {
  name                        = substr(replace("kv-${var.name_prefix}", "-", ""), 0, 24)
  location                    = var.location
  resource_group_name         = azurerm_resource_group.backend_rg.name
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  sku_name                    = "standard"
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false

  access_policy = []
}

data "azurerm_client_config" "current" {}


resource "azurerm_key_vault_access_policy" "terraform_runner_policy" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = data.azurerm_client_config.current.object_id

  secret_permissions = [
    "Get", "List", "Set", "Delete", "Purge", "Recover"
  ]

  lifecycle {
    create_before_destroy = true
  }
}

resource "azurerm_key_vault_access_policy" "back_end_access_policy" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = azurerm_linux_web_app.backend_app.identity[0].tenant_id
  object_id    = azurerm_linux_web_app.backend_app.identity[0].principal_id

  secret_permissions = [
    "Get",
    "List",
  ]
}

locals {
  key_vault_secrets = {
    "PostgresDB"           = { value = var.postgres_db, content_type = "text/plain" }
    "PostgresUser"         = { value = var.postgres_user, content_type = "text/plain" }
    "PostgresPassword"     = { value = var.postgres_password, content_type = "text/plain" }
    "PostgresHost"         = { value = azurerm_postgresql_flexible_server.psql.fqdn, content_type = "text/plain" }
    "PostgresPort"         = { value = var.postgres_port, content_type = "text/plain" }
    "AppAdminEmail"        = { value = var.app_admin_email, content_type = "text/plain" }
    "AppAdminPassword"     = { value = var.app_admin_password, content_type = "text/plain" }
    "MailHost"             = { value = var.mail_host, content_type = "text/plain" }
    "MailPort"             = { value = var.mail_port, content_type = "text/plain" }
    "MailUsername"         = { value = var.mail_username, content_type = "text/plain" }
    "MailPassword"         = { value = var.mail_password, content_type = "text/plain" }
    "JwtSecret"            = { value = var.jwt_secret, content_type = "text/plain" }
    "JwtExpiration"        = { value = var.jwt_expiration, content_type = "text/plain" }
    "JwtRefreshExpiration" = { value = var.jwt_refresh_expiration, content_type = "text/plain" }
  }
}

resource "azurerm_key_vault_secret" "secrets" {
  for_each    = local.key_vault_secrets
  name        = each.key
  value       = each.value.value
  key_vault_id= azurerm_key_vault.kv.id
  content_type= each.value.content_type

  depends_on  = [
    azurerm_key_vault_access_policy.terraform_runner_policy
  ]
}
