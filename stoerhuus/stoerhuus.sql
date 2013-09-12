use cody;

insert into websites values
  (5,'stoerhuus','v1.0a1','cody','ydoc','localhost','/usr/local/data/storehuus','stoerhuus','','Y',
   'stoerhuus.local,stoerhuus.akiworks.be','rtaillieu@mac.com','Y');



create database stoerhuus default charset utf8;

use stoerhuus;

INSERT INTO `templates` VALUES
 (103,'With intros', 'Displays also all intro content of the pages below','ContentController', 'intros.ejs','',0,'N',0);

insert into atoms values
 (4, 0, 10, 'Layout', '', '', '2010-01-01', '2010-01-01'),
 (11,4,10,'Logo','','---','2010-01-01','2010-01-01'),
 (12,4,10,'Header','','---','2010-01-01','2010-01-01'),
 (13,4,10,'Footer','','---','2010-01-01','2010-01-01');

 INSERT INTO `content` VALUES
 (0,1,'nl',60,'N','S',0,'Google Analytics code','UA-9438915-4'),
 (0,1,'en',60,'N','S',0,'Google Analytics code','UA-9438915-4');


INSERT INTO `templates` VALUES
 (18,'Admin-Forms', 'Incoming data from forms','FormDataController', '-/cms/forms-list.ejs','',0,'Y',0),
 (19,'Admin-Comments', 'View approve, edit or trash comments','CommentController', '-/cms/comments.ejs','',0,'Y',0);

INSERT INTO `items` VALUES
  (20,'Administration', 9, 1,2,'M',10,'2010-01-01','2010-01-01','2100-01-01','S','Y','',''),
    (21,'Admin - Forms',      20, 1,18,'A',10,'2010-01-01','2010-01-01','2100-01-01','Y','Y','',''),
    (22,'Admin - Comments',   20, 1,19,'A',10,'2010-01-01','2010-01-01','2100-01-01','Y','Y','','');

INSERT INTO `pages` VALUES
  (20,'nl','Beheer','admin','Y','','','2010-01-01','2010-01-01'),
	  (21,'nl','Formulieren','data','Y','','','2010-01-01','2010-01-01'),
	  (22,'nl','Commentaar','comments','Y','','','2010-01-01','2010-01-01'),
  (20,'en','Administration','admin','Y','','','2010-01-01','2010-01-01'),
	  (21,'en','Forms','data','Y','','','2010-01-01','2010-01-01'),
	  (22,'en','Comments','comments','Y','','','2010-01-01','2010-01-01');
