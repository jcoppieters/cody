screen

cd /usr/local/src/cody
rm -rf jcms
git clone http://bitbucket.org/jcoppieters/jcms
rm -rf jcms/node_modules

npm install express
npm install mysql@2.0.0-alpha8
npm install mime
npm install ejs

mysql mysql -e 'CREATE DATABASE essen DEFAULT CHARACTER SET utf8'
mysql essen < cody/cody.sql
mysql essen < essen/essen.sql

mysql mysql -e 'CREATE DATABASE codyweb DEFAULT CHARACTER SET utf8'
mysql codyweb < cody/cody.sql
mysql codyweb < codyweb/codyweb.sql

echo "current urls: http://localhost:3000/codyweb/nl & /en + /essen/nl & /en + */nl/dashboard & */en/dashboard"

while [ 1 ]; do  echo "restart node *****************************************************************************"; node index.js; done

ctl-a ctl-d