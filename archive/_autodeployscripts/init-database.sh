#!/bin/bash
EXPECTED_ARGS=4
E_BADARGS=2
MYSQL=`which mysql`
 
Q1="CREATE DATABASE IF NOT EXISTS $2;"
Q2="GRANT ALL ON $2.* TO '$3'@'%' IDENTIFIED BY '$4'; GRANT ALL ON $2.* TO '$3'@'localhost' IDENTIFIED BY '$4';"
Q3="FLUSH PRIVILEGES;"
SQL="${Q1}${Q2}${Q3}"
 
if [ $# -ne $EXPECTED_ARGS ]
then
  echo "Gebruik: $0 mysqlrootpassword dbname dbuser dbpass"
  exit $E_BADARGS
fi
 
$MYSQL -ucody --password=$1 -e "$SQL"
