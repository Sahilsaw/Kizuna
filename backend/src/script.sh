cd /home/ubuntu/Kizuna
git pull origin main
npm run build
pm2 restart kizuna-backend