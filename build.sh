cd my-app
npm install
npm install react-scripts --save
chmod +x node_modules/.bin/react-scripts
rm -r build/*
REACT_APP_BE_IP=`dig +short myip.opendns.com @resolver1.opendns.com` npm run build

cd ..
cd scrabble-backend
npm install
rm -r build/*
chmod a+x node_modules/.bin/tsc
npm run build