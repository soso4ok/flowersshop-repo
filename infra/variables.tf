variable "resource_group_name" {
  default = "flowers-backend-rg-europe"
}

variable "location" {
  description = "Location"
  type        = string
  sensitive   = true
}


# Back-end vars

# PostgreSQL
variable "postgres_host" {
  description = "The hostname"
  type        = string
  sensitive   = true
}

variable "postgres_db" {
  description = "The name of the PostgreSQL database."
  type        = string
  sensitive   = true
}

variable "postgres_user" {
  description = "The username for PostgreSQL."
  type        = string
  sensitive   = true
}

variable "postgres_password" {
  description = "The password for the PostgreSQL user."
  type        = string
  sensitive   = true
}

variable "postgres_port" {
  description = "The port for PostgreSQL connection."
  type        = string
  default     = "5432"
}

# Application
variable "app_port" {
  description = "The port application runs on inside the container."
  type        = string
  default     = "8080"
}

variable "app_admin_email" {
  description = "The admin email for the application."
  type        = string
  sensitive   = true
}

variable "app_admin_password" {
  description = "The admin password for the application."
  type        = string
  sensitive   = true
}

# Mail
variable "mail_host" {
  description = "The SMTP server host."
  type        = string
  sensitive   = true
}

variable "mail_port" {
  description = "The SMTP server port."
  type        = string
  default     = "587"
}

variable "mail_username" {
  description = "The username for SMTP authentication."
  type        = string
  sensitive   = true
}

variable "mail_password" {
  description = "The password for SMTP authentication."
  type        = string
  sensitive   = true
}

# Security
variable "jwt_secret" {
  description = "The secret key for signing JWTs."
  type        = string
  sensitive   = true
}

variable "jwt_expiration" {
  description = "The expiration time for JWT tokens"
  type        = string
  default     = "1h"
}

variable "jwt_refresh_expiration" {
  description = "The expiration time for JWT refresh tokens (e.g., '30d')."
  type        = string
  default     = "30d"
}

# Credentials
variable "subscription_id" {
  description = "Azure Subscription ID"
  type        = string
  sensitive = true
}

# variable "current_user_object_id" {
#   description = "Current user's object ID for Key Vault access"
#   type        = string
#   sensitive = true
# }

variable "client_id" {
  description = "Azure Client ID"
  type        = string
  sensitive   = true
}
variable "client_secret" {
  description = "Azure Client Secret"
  type        = string
  sensitive   = true
}
variable "tenant_id" {
  description = "Azure Tenant ID"
  type        = string
  sensitive   = true
}
variable "subscription_id" {
  description = "Azure Subscription ID"
  type        = string
  sensitive   = true
}
