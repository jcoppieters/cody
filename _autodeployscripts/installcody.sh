#!/bin/bash
export STARTDIR=$(cd $(dirname "$0"); pwd)
cd $STARTDIR


if [ $# -ne 3 ]
then
        echo "ERROR: you must supply one paramter.";
        echo "1) websitename";
	echo "2) admin password";
	echo "3) admin email";
        exit 1;
fi


#DBNAME="cust$1";
#SITENAME="cust$1";
DBNAME="$1";
SITENAME="$1"
EMAIL="$3";
USERNAME="rsuper";

#remove the line below for production use
#mysql -e "DROP DATABASE $DBNAME"
mysql -e "CREATE DATABASE $DBNAME"
mysql $DBNAME < ./data/empty-fulldump.sql
tar -xzf ./data/template.tar.gz -C /usr/local/src/cody/jcms/
mv /usr/local/src/cody/jcms/template /usr/local/src/cody/jcms/$SITENAME

#PASSWORD=`< /dev/urandom tr -dc _A-Z-a-z-0-9 | head -c10`
PASSWORD=$2
#./init-database.sh mysqlrootpassword dbname dbuser dbpass
./init-database.sh ydoc $DBNAME $SITENAME $PASSWORD
mysql -e "INSERT INTO cody.websites(name, dbuser, dbpassword, dbhost, datapath, db, active) VALUES ('$SITENAME', '$SITENAME', '$PASSWORD', 'localhost', '/usr/local/src/cody/jcms/$SITENAME/data', '$DBNAME', 'Y');";
mysql -e "DELETE FROM $DBNAME.users;";
mysql -e "insert into $DBNAME.users(username,name,password,domain,level,maxbadlogins,active,email,note,nomail,sortorder) values ('$USERNAME', 'Cody user', '$PASSWORD', 'users',99,99,'Y','$EMAIL','note','N','0');";
echo "The created database and user and db are $DBNAME and the password is $PASSWORD";
echo "The login for the website admin is $USERNAME / $PASSWORD";
cd /usr/local/src/cody/jcms
/usr/local/bin/forever stop index.js 2>/dev/null
pkill -9 node
/usr/local/bin/forever start index.js
#node ./index.js & 2>/dev/null >/dev/null
cd $STARTDIR
