#!/bin/bash
EXPECTED_ARGS=3
E_BADARGS=2
MYSQL=`which mysql`
 
Q1="DROP DATABASE IF EXISTS $2;"
Q2="DROP USER '$3'@'%'; DROP USER '$3'@'localhost';"
Q3="FLUSH PRIVILEGES;"
SQL="${Q1}${Q2}${Q3}"
 
if [ $# -ne $EXPECTED_ARGS ]
then
  echo "Gebruik: $0 mysqlrootpassword dbname dbuser"
  exit $E_BADARGS
fi
 
$MYSQL -ucody --password=$1 -e "$SQL"
