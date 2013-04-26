create table atoms as select * from objects;
alter table atoms modify id int(11) not null primary key auto_increment;

