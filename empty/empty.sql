set names utf8;


/*!40101 SET NAMES utf8 */;

--
-- Dumping data for table `users`
--

INSERT INTO `domains` VALUES ("user", "Users");

INSERT INTO `users` VALUES
 (9,'codyweb','Cody User','ydoc','user',50,0,99,'Y','cody@cody.com','','N',0);



--
-- Dumping data for table `atoms`
--

INSERT INTO `atoms` VALUES
 (21,1,10,'Global','','','2012-08-15 18:55:51','2012-08-15 18:55:54'),
 (22,21,10,'Map','','JPG','2012-08-15 20:57:34','2012-08-15 22:57:44');

INSERT INTO `atoms` VALUES
 (31,2,10,'a file','','pdf','2012-08-15 18:55:51','2012-08-15 18:55:54');



--
-- Dumping data for table `items` and `pages`
--

INSERT INTO `items` VALUES
 (101,'First page',1,1,100,'M',70,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','','');



INSERT INTO `pages` VALUES
 (101,'nl','Eerste pagina','first','Y','','','2010-01-01 00:00:00','2012-08-28 09:39:37'),
 (101,'en','First page','first','Y','','','2010-01-01 00:00:00','2012-08-28 09:39:37');


update pages set link = 'welcome' where item = 1;

 
--
-- Dumping data for table `content`
--

INSERT INTO `content` VALUES
 (0,101,'nl',10,'N','T',0,'','<p>....</p>'),
 (0,101,'en',10,'N','T',0,'','<p>....</p>');


INSERT INTO `content` VALUES
 (0,1,'nl',10,'Y','S',0,'phone','050-705336'),
 (0,1,'en',10,'Y','S',0,'phone','050-705336');


INSERT INTO `content` VALUES
 (0,1,'nl',10,'Y','S',0,'address','myStreet 007 - 54321 Bond City'),
 (0,1,'en',10,'Y','S',0,'address','myStreet 007 - 54321 Bond City');

