# ============================================================
#  GitHub Repository Secrets — Add these in:
#  GitHub → Settings → Secrets → Actions → New repository secret
# ============================================================

## Required for CI/CD deploy to work:

| Secret Name          | Value / Where to get it                          |
|----------------------|--------------------------------------------------|
| DATABASE_URL         | postgresql://user:pass@rds-endpoint:5432/db      |
| NEXTAUTH_SECRET      | Run: openssl rand -base64 32                     |
| NEXTAUTH_URL         | https://yourdomain.com                           |
| AWS_ACCESS_KEY_ID    | IAM → Your user → Security credentials           |
| AWS_SECRET_ACCESS_KEY| IAM → Your user → Security credentials           |
| EC2_HOST             | Your EC2 public IP or domain                     |
| EC2_USER             | ubuntu (default for Ubuntu AMI)                  |
| EC2_SSH_KEY          | Contents of your .pem key file (cat key.pem)     |
| DOMAIN               | yourdomain.com                                   |
| SENTRY_DSN           | From sentry.io → Project → Settings → DSN        |

## How to generate NEXTAUTH_SECRET:
## Open terminal and run:
##   openssl rand -base64 32
## Copy the output → paste as the secret value

## How to add EC2_SSH_KEY:
## cat your-key.pem | pbcopy   (mac)
## cat your-key.pem | xclip    (linux)
## Paste the ENTIRE contents including -----BEGIN----- lines
