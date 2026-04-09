#!/bin/bash
# App Settings Configuration Script
# Run this after terraform apply completes successfully

az webapp config appsettings set \
  --resource-group ${resource_group_name} \
  --name ${webapp_name} \
  --settings \
    WEBSITES_PORT="${app_port}" \
    POSTGRES_DB="@Microsoft.KeyVault(SecretUri=${secrets["PostgresDB"].id})" \
    POSTGRES_USER="@Microsoft.KeyVault(SecretUri=${secrets["PostgresUser"].id})" \
    POSTGRES_PASSWORD="@Microsoft.KeyVault(SecretUri=${secrets["PostgresPassword"].id})" \
    POSTGRES_HOST="@Microsoft.KeyVault(SecretUri=${secrets["PostgresHost"].id})" \
    POSTGRES_PORT="@Microsoft.KeyVault(SecretUri=${secrets["PostgresPort"].id})" \
    APP_ADMIN_EMAIL="@Microsoft.KeyVault(SecretUri=${secrets["AppAdminEmail"].id})" \
    APP_ADMIN_PASSWORD="@Microsoft.KeyVault(SecretUri=${secrets["AppAdminPassword"].id})" \
    MAIL_HOST="@Microsoft.KeyVault(SecretUri=${secrets["MailHost"].id})" \
    MAIL_PORT="@Microsoft.KeyVault(SecretUri=${secrets["MailPort"].id})" \
    MAIL_USERNAME="@Microsoft.KeyVault(SecretUri=${secrets["MailUsername"].id})" \
    MAIL_PASSWORD="@Microsoft.KeyVault(SecretUri=${secrets["MailPassword"].id})" \
    JWT_SECRET="@Microsoft.KeyVault(SecretUri=${secrets["JwtSecret"].id})" \
    JWT_EXPIRATION="@Microsoft.KeyVault(SecretUri=${secrets["JwtExpiration"].id})" \
    JWT_REFRESH_EXPIRATION="@Microsoft.KeyVault(SecretUri=${secrets["JwtRefreshExpiration"].id})"

echo "App settings configured successfully!"
echo "You can verify the configuration with:"
echo "az webapp config appsettings list --resource-group ${resource_group_name} --name ${webapp_name}"