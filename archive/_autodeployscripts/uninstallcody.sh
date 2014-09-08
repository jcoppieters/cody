#!/bin/bash
export STARTDIR=$(cd $(dirname "$0"); pwd)
cd $STARTDIR
#DBNAME="cust$1";
#SITENAME="cust$1";
DBNAME="$1"
SITENAME="$1"

if [ $# -ne 1 ]
then
	echo "ERROR: you must supply one paramter.";
	echo "1) websitename";
#	echo "2) websitename";
	exit 1;
fi
mysql -e "DELETE FROM cody.websites WHERE name='$SITENAME';"


cd $STARTDIR

#./del-database.sh mysqlrootpassword dbname dbuser
./del-database.sh ydoc $DBNAME $SITENAME
#mysql -e "DROP DATABASE $DBNAME"
rm -rf /usr/local/src/cody/jcms/$SITENAME

cd /usr/local/src/cody/jcms
forever stop index.js 2>/dev/null
pkill -9 node
forever start index.js
#node ./index.js & 2>/dev/null >/dev/null
cd $STARTDIR
