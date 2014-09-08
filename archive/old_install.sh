screen

cd /usr/local/src/cody
rm -rf jcms
git clone http://bitbucket.org/jcoppieters/jcms
rm -rf jcms/node_modules

npm install express
npm install mysql@2.0.0-alpha8
npm install mime
npm install ejs
npm install nodemailer
npm install nodeunit -g
npm install forever -g

mysql mysql -e 'CREATE DATABASE essen DEFAULT CHARACTER SET utf8'
mysql essen < cody/cody.sql
mysql essen < essen/essen.sql

mysql mysql -e 'CREATE DATABASE codyweb DEFAULT CHARACTER SET utf8'
mysql codyweb < cody/cody.sql
mysql codyweb < codyweb/codyweb.sql

mysql mysql -e 'CREATE DATABASE empty DEFAULT CHARACTER SET utf8'
mysql empty < cody/cody.sql
mysql empty < empty/empty.sql

echo "current urls: http://localhost:3000/codyweb/nl/ & /en + /essen/nl/ & /en/ + */nl/dashboard & */en/dashboard"

cd jcms
forever start index.js

ctl-a ctl-d

