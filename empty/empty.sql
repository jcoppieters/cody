set names utf8;


/*!40101 SET NAMES utf8 */;

--
-- Dumping data for table `users`
--

INSERT INTO `domains` VALUES ("user", "Users");

INSERT INTO `users` VALUES
 (9,'cody-empty','Cody User','ydoc','user',50,0,99,'Y','cody@cody.com','','N',0);



--
-- Dumping data for table `atoms`
--

INSERT INTO `atoms` VALUES
 (21,1,10,'Global','','','2012-08-15 18:55:51','2012-08-15 18:55:54'),
 (22,21,10,'Map','','JPG','2012-08-15 20:57:34','2012-08-15 22:57:44');

INSERT INTO `atoms` VALUES
 (31,2,10,'a file','','pdf','2012-08-15 18:55:51','2012-08-15 18:55:54');


-- Place holders for the layout elements
insert into atoms values
 (4, 0, 10, 'Layout', '', '', '2010-01-01', '2010-01-01'),
 (11,4,10,'Logo','','---','2010-01-01','2010-01-01'),
 (12,4,10,'Header','','---','2010-01-01','2010-01-01'),
 (13,4,10,'Footer','','---','2010-01-01','2010-01-01');

--
-- Dumping data for table `items` and `pages`
--

INSERT INTO `items` VALUES
(101,'Info',1,1,100,'M',70,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y',NULL,'list',''),
(102,'Content',1,1,100,'A',5,'2013-07-11','2013-07-11 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),
(103,'About',1,1,100,'A',5,'2013-07-11','2013-07-11 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),
(104,'Page 1',102,1,100,'A',5,'2013-07-11','2013-07-11 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),
(105,'Page 2',102,1,100,'A',5,'2013-07-11','2013-07-11 00:00:00','2101-01-31 00:00:00','Y',NULL,'list','');



INSERT INTO `pages` VALUES
(101,'nl','Info','info','Y','','','2010-01-01 00:00:00','2013-07-04 20:13:26'),
(101,'en','Info','info','Y','','','2010-01-01 00:00:00','2013-07-11 15:44:54'),

(102,'en','Content','content','Y','','','2013-07-11 16:00:40','2013-07-11 16:01:10'),
(102,'nl','Inhoud','inhoud','Y','','','2013-07-11 16:00:40','2013-07-11 16:01:26'),

(103,'en','About','about','Y','','','2013-07-11 16:00:47','2013-07-11 16:01:01'),
(103,'nl','Over ons','','Y','','','2013-07-11 16:00:47','2013-07-11 16:01:33'),

(104,'en','First page','','Y','','','2013-07-11 16:40:30','2013-07-11 17:35:46'),
(104,'nl','Pagina een','','Y','','','2013-07-11 16:40:30','2013-07-11 16:47:16'),

(105,'en','Second page','','Y','','','2013-07-11 16:40:43','2013-07-11 17:35:52'),
(105,'nl','Pagina twee','','Y','','','2013-07-11 16:40:43','2013-07-11 16:40:52');


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

INSERT INTO `content` VALUES
 (0,1,'nl',30,'N','S',0,'footer.first','links'),
 (0,1,'nl',40,'N','S',0,'footer.second','rechts'),
 (0,1,'nl',50,'N','S',0,'footer.third','midden'),
 (0,1,'en',30,'N','S',0,'footer.first','left'),
 (0,1,'en',40,'N','S',0,'footer.second','right'),
 (0,1,'en',50,'N','S',0,'footer.third','middle');
