#!/bin/bash
yum update -y
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs git

cd /home/ec2-user
git clone https://github.com/djjrip/ggloop-cloud.git
cd ggloop-cloud/backend
echo "STRIPE_SECRET_KEY=sk_live_YOUR_STRIPE_SECRET_KEY_HERE" > .env
echo "PORT=3000" >> .env
npm install

npm install -g pm2
pm2 start server.js
pm2 save
pm2 startup
