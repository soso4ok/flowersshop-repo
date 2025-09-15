resource "azurerm_service_plan" "back_end" {
    name                = "flowers-appserviceplan-${random_string.suffix.result}"
    location            = var.location
    resource_group_name = azurerm_resource_group.flowers_back-end-rg.name

    os_type  = "Linux"
    sku_name = "B1"
  }


resource "azurerm_linux_web_app" "java_back_end_17" {
  name                = "flowers-webapp-${random_string.suffix.result}"
  location            = var.location
  resource_group_name = azurerm_resource_group.flowers_back-end-rg.name
  service_plan_id     = azurerm_service_plan.back_end.id

  site_config {
    application_stack {
      docker_image     = "${azurerm_container_registry.acr.login_server}/flowers-back-end"
      docker_image_tag = var.docker_image_tag
    }
  }

  identity {
      type = "SystemAssigned"
  }

  app_settings = {

    # PostgreSQL
    "POSTGRES_DB"       = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["PostgresDB"].id})"
    "POSTGRES_USER"     = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["PostgresUser"].id})"
    "POSTGRES_PASSWORD" = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["PostgresPassword"].id})"
    "POSTGRES_HOST"     = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["PostgresHost"].id})"
    "POSTGRES_PORT"     = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["PostgresPort"].id})"

    # App admin
    "APP_ADMIN_EMAIL"    = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["AppAdminEmail"].id})"
    "APP_ADMIN_PASSWORD" = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["AppAdminPassword"].id})"

    # Email
    "MAIL_HOST"     = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["MailHost"].id})"
    "MAIL_PORT"     = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["MailPort"].id})"
    "MAIL_USERNAME" = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["MailUsername"].id})"
    "MAIL_PASSWORD" = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["MailPassword"].id})"

    # JWT
    "JWT_SECRET"             = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["JwtSecret"].id})"
    "JWT_EXPIRATION"         = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["JwtExpiration"].id})"
    "JWT_REFRESH_EXPIRATION" = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["JwtRefreshExpiration"].id})"
  }
}

resource "azurerm_role_assignment" "acr_pull_for_app_service" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_linux_web_app.java_back_end_17.identity[0].principal_id
}



