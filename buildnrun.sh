cd my-app
npm install
npm install react-scripts --save
chmod +x node_modules/.bin/react-scripts
REACT_APP_BE_IP=`dig +short myip.opendns.com @resolver1.opendns.com` npm run build

cd ..
chmod a+x node_modules/.bin/tsc
cd scrabble-backend
npm install
npm run build

#Start backend
forever start scrabble-backend/server.js

#Start webapp
serve -p 80 -s my-app/build