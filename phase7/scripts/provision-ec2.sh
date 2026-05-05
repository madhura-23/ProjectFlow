#!/bin/bash
# ============================================================
#  EC2 Server Provisioning — Run ONCE on a fresh Ubuntu 22.04
#  ssh ubuntu@your-ec2-ip 'bash -s' < scripts/provision-ec2.sh
# ============================================================
set -e

echo "→ Updating system..."
sudo apt-get update && sudo apt-get upgrade -y

echo "→ Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "→ Installing PM2 globally..."
sudo npm install -g pm2

echo "→ Installing Nginx..."
sudo apt-get install -y nginx

echo "→ Installing Certbot (Let's Encrypt SSL)..."
sudo apt-get install -y certbot python3-certbot-nginx

echo "→ Creating app directory..."
sudo mkdir -p /var/www/saas-project-manager
sudo chown ubuntu:ubuntu /var/www/saas-project-manager

echo "→ Cloning your repo..."
# Replace with your actual repo URL
read -p "Enter your GitHub repo URL: " REPO_URL
git clone "$REPO_URL" /var/www/saas-project-manager
cd /var/www/saas-project-manager

echo "→ Installing dependencies..."
npm ci

echo "→ Copying Nginx config..."
sudo cp phase7/nginx/saas-project-manager.conf /etc/nginx/sites-available/
echo "  !! Edit /etc/nginx/sites-available/saas-project-manager.conf"
echo "  !! Replace YOUR_DOMAIN.com with your actual domain"
read -p "Press ENTER after updating the domain in nginx config..." _

sudo ln -sf /etc/nginx/sites-available/saas-project-manager.conf \
            /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

echo "→ Obtaining SSL certificate..."
read -p "Enter your domain (e.g. myapp.com): " DOMAIN
sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN"

echo "→ Setting up PM2 startup..."
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

echo ""
echo "✅ Server provisioned!"
echo "   Next: copy .env.local, run 'npm run build', then 'pm2 start ecosystem.config.js'"
