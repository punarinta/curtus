#!/bin/bash

cd "$(dirname "$0")"

echo "What's your URL shortener domain name?"
read -p ': ' DOMAIN_NAME

echo "Preparing your environment..."
apt update
apt upgrade -y
apt install nginx build-essential certbot python3-certbot-nginx
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
nvm install v15.14.0
nvm alias default v15.14.0
nvm install-latest-npm
npm i -g pm2
pm2 startup

echo "Installing Curtus..."
mkdir /apps
cd apps
git clone https://github.com/punarinta/curtus.git
cd curtus

npm i
pm2 start "npm run server" --name "curtus"
pm2 save

sed "s/YOUR_SHORTENER_DOMAIN/$DOMAIN_NAME/g" ./curtus-nginx.conf > "/etc/nginx/sites-enabled/$DOMAIN_NAME.conf"

if ! nginx -t; then
    echo "Error: nginx test failed"
    exit 1
fi

service nginx reload

echo "Generating SSL certificate..."
if ! certbot --nginx --reinstall --redirect -d "$DOMAIN_NAME"; then
    echo "Error: 'Let's Encrypt' certbot failed"
    exit 2
fi

echo "Configuring Certbot automatic updates..."
(crontab -u root -l; echo "0 12 * * * /usr/bin/certbot renew --quiet" ) | crontab -u root -
