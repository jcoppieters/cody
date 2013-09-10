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
 (0,1,'nl',60,'N','S',0,'Google Analytics code','UA-xxxxxxx-x'),
 (0,1,'en',60,'N','S',0,'Google Analytics code','UA-xxxxxxx-x');


