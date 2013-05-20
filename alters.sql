create table atoms as select * from objects;
alter table atoms modify id int(11) not null primary key auto_increment;

alter table users modify nr int(11) default 0;
alter table users add nomail char(1) not null default 'N';
