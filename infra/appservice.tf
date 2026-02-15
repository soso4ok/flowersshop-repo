resource "azurerm_service_plan" "app_service_plan" {
  name                = "${var.name_prefix}-appserviceplan"
  location            = var.location
  resource_group_name = azurerm_resource_group.backend_rg.name

  os_type  = "Linux"
  sku_name = "S1"
}

resource "azurerm_linux_web_app" "backend_app" {
  name                = "${var.name_prefix}-webapp"
  location            = var.location
  resource_group_name = azurerm_resource_group.backend_rg.name
  service_plan_id     = azurerm_service_plan.app_service_plan.id

  site_config {
    container_registry_use_managed_identity = true
    application_stack {
      docker_registry_url = "https://${azurerm_container_registry.acr.login_server}"
      docker_image_name   = "flowers-back-end:${var.docker_image_tag}"
    }

    vnet_route_all_enabled = true
  }

  identity {
    type = "SystemAssigned"
  }

  app_settings = {
    "WEBSITES_PORT" = var.app_port
    "INITIAL_DEPLOYMENT" = "true"
  }

  lifecycle {
    ignore_changes = [
      app_settings
    ]
  }
}

resource "azurerm_role_assignment" "acr_pull_for_app_service" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_linux_web_app.backend_app.identity[0].principal_id
}

resource "null_resource" "configure_app_settings" {
  depends_on = [
    azurerm_key_vault_secret.secrets,
    azurerm_role_assignment.back_end_kv_permissions,
    time_sleep.wait_for_rbac_propagation,
    azurerm_app_service_virtual_network_swift_connection.app_vnet_integration
  ]

  provisioner "local-exec" {
    command = <<-EOT
      echo "Configuring App Service settings with Key Vault references..."

      az webapp config appsettings set \
        --resource-group ${azurerm_resource_group.backend_rg.name} \
        --name ${azurerm_linux_web_app.backend_app.name} \
        --settings \
          WEBSITES_PORT="${var.app_port}" \
          POSTGRES_DB="@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["PostgresDB"].id})" \
          POSTGRES_USER="@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["PostgresUser"].id})" \
          POSTGRES_PASSWORD="@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["PostgresPassword"].id})" \
          POSTGRES_HOST="@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["PostgresHost"].id})" \
          POSTGRES_PORT="@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["PostgresPort"].id})" \
          APP_ADMIN_EMAIL="@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["AppAdminEmail"].id})" \
          APP_ADMIN_PASSWORD="@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["AppAdminPassword"].id})" \
          MAIL_HOST="@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["MailHost"].id})" \
          MAIL_PORT="@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["MailPort"].id})" \
          MAIL_USERNAME="@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["MailUsername"].id})" \
          MAIL_PASSWORD="@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["MailPassword"].id})" \
          JWT_SECRET="@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["JwtSecret"].id})" \
          JWT_EXPIRATION="@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["JwtExpiration"].id})" \
          JWT_REFRESH_EXPIRATION="@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.secrets["JwtRefreshExpiration"].id})"

      echo "App settings configured successfully!"
    EOT
  }

  triggers = {
    secrets_hash = join(",", [for k, v in azurerm_key_vault_secret.secrets : v.id])
    app_service_id = azurerm_linux_web_app.backend_app.id
  }
}

output "app_service_info" {
  description = "App Service deployment information"
  value = {
    name     = azurerm_linux_web_app.backend_app.name
    url      = "https://${azurerm_linux_web_app.backend_app.default_hostname}"
    resource_group = azurerm_resource_group.backend_rg.name
  }
}

output "manual_verification_commands" {
  description = "Commands to verify the deployment manually"
  value = <<-EOT
    # Check app settings
    az webapp config appsettings list --resource-group ${azurerm_resource_group.backend_rg.name} --name ${azurerm_linux_web_app.backend_app.name} --output table

    # Check application logs
    az webapp log tail --resource-group ${azurerm_resource_group.backend_rg.name} --name ${azurerm_linux_web_app.backend_app.name}

    # Test application health
    curl -I https://${azurerm_linux_web_app.backend_app.default_hostname}/health
  EOT
  sensitive = false
}