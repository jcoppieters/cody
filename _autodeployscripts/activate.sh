#!/bin/bash
# mysql --skip-column-names --raw --batch -e "select id, name, dbuser, dbpassword from cody.websites where active='N'" | echo `awk 'BEGIN{FS="\t"} { printf "%s %s %s %s", $1, $2, $3, $4; print "\n"; }'`

#mysql --raw --batch -e "select * from cody.websites where NOT active='Y'" | while read id; do 
#	echo "$id";
#done

export STARTDIR=$(cd $(dirname "$0"); pwd)
cd $STARTDIR

function dowork {
echo "doing work";
dbquery=$(mysql --skip-column-names -e "select id, name, dbuser, dbpassword from cody.websites where active='N';")
array=( $( for i in $dbquery ; do echo $i ; done ) )

#echo ${array[@]}
cnt=${#array[@]}
for (( i=0 ; i<cnt ; i=i+4 ))
do
	id="${array[$i]}";
	name="${array[$i+1]}";
	dbuser="${array[$i+2]}";
	dbpassword="${array[$i+3]}";

	#echo "id: $id";
	#echo "name: $name";
	#echo "dbuser: $dbuser";
	#echo "dbpassword: $dbpassword";
	./installcody.sh $name $dbpassword adminmail@provider.com
	mysql -e "UPDATE cody.websites SET active='Y' WHERE id=$id";
	./startcody.sh
done
}


#for (( j=0 ; j<6 ; j=j+1 ))
while true
do
dowork;
sleep 9;
done
