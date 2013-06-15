set names utf8;


/*!40101 SET NAMES utf8 */;

--
-- Dumping data for table `users`
--

-- insert into domains values ("user", "Users");

-- INSERT INTO `users` VALUES
-- (9,'codyweb','Cody User','ydoc','user',50,0,99,'Y','cody@cody.com','','N',0),



--
-- Dumping data for table `atoms`
--

INSERT INTO `atoms` VALUES
 (21,1,10,'Screenshots','','',now(),now()),
  (22,21,10,'Page editor','','',now(),now()),
    (23,22,10,'New page','','',now(),now()),
    (24,22,20,'Add content','','',now(),now());

INSERT INTO `atoms` VALUES
 (31,2,10,'Tutorials','','',now(),now()),
   (32,31,10,'Controller','','',now(),now()),
 (33,2,20,'Pictures','','',now(),now()),
 (34,2,30,'Logos','','',now(),now());

--
-- Dumping data for table `templates`
--

INSERT INTO `templates` VALUES
 (103,'Contact',       'ContactController', 'contact.ejs','',0,'N',0),
 (101,'Home',          'ContentController', 'index.ejs','',999,'N',100);

update templates set fn = "page.ejs" where id = 100;
update templates set fn = "login.ejs" where id = 2;

--
-- Dumping data for table `items`
--


UPDATE items set showcontent = 'S', orderby = 'M' where id = 1;
INSERT INTO `items` VALUES
 (110,'Home',1,1,101,'M',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),
  (111,'UserFriendly',110,1,100,'A',10,'2013-06-14','2013-06-14 00:00:00','2101-01-31 00:00:00','Y',NULL,'',''),
  (112,'Node',110,1,100,'A',20,'2013-06-14','2013-06-14 00:00:00','2101-01-31 00:00:00','Y',NULL,'',''),
  (113,'OpenSource',110,1,100,'A',30,'2013-06-14','2013-06-14 00:00:00','2101-01-31 00:00:00','Y',NULL,'',''),
  (114,'Hosting',110,1,100,'A',40,'2013-06-14','2013-06-14 00:00:00','2101-01-31 00:00:00','Y',NULL,'',''),
 (120,'About',1,1,100,'A',20,'2013-06-14','2013-06-14 00:00:00','2101-01-31 00:00:00','Y',NULL,'',''),
 (130,'Documentation',1,1,100,'A',30,'2013-06-14','2013-06-14 00:00:00','2101-01-31 00:00:00','Y',NULL,'',''),
 (140,'ContactUs',1,1,100,'A',40,'2013-06-14','2013-06-14 00:00:00','2101-01-31 00:00:00','Y',NULL,'','');

INSERT INTO `items` VALUES
 (20,'Admin',9,1,9,'M',70,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','S','N','',''),
  (21,'Admin - Contact us',20,1,103,'M',70,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','S','N','','');



INSERT INTO `pages` VALUES
  (20,'nl','Beheer','admin','Y','','','2010-01-01','2010-01-01'),
   (21,'nl','Contact Us','admin-contact','Y','','','2010-01-01','2010-01-01');

INSERT INTO `pages` VALUES
  (20,'en','Admin','admin','Y','','','2010-01-01','2010-01-01'),
   (21,'en','Contact Us','admin-contact','Y','','','2010-01-01','2010-01-01');

UPDATE pages set link = 'welcome' where item = 1;

INSERT INTO `pages` VALUES
  (110,'en','Home','info','Y','','','2010-01-01 00:00:00','2012-08-28 09:39:37'),
  (110,'nl','Home','info','Y','','','2010-01-01 00:00:00','2012-08-28 09:39:37'),
   (111,'en','User Friendly','','Y','','','2013-06-14 15:50:52','2013-06-14 16:00:03'),
   (111,'nl','Gebruiksvriendelijk','','Y','','','2013-06-14 15:50:52','2013-06-14 15:52:47'),
   (112,'en','Node.js','','Y','','','2013-06-14 15:50:27','2013-06-14 16:00:10'),
   (112,'nl','Node.js','','Y','','','2013-06-14 15:50:27','2013-06-14 15:53:36'),
   (113,'en','Open Source','','Y','','','2013-06-14 15:50:27','2013-06-14 16:00:10'),
   (113,'nl','Open Source','','Y','','','2013-06-14 15:50:27','2013-06-14 15:53:36'),
   (114,'en','Hosting','','Y','','','2013-06-14 15:50:27','2013-06-14 16:00:10'),
   (114,'nl','Hosting','','Y','','','2013-06-14 15:50:27','2013-06-14 15:53:36'),

  (120,'en','About','','Y','','','2013-06-14 16:03:10','2013-06-14 16:03:26'),
  (120,'nl','Over','','Y','','','2013-06-14 16:03:10','2013-06-14 16:03:14'),

  (130,'en','Documentation','','Y','','','2013-06-14 16:03:56','2013-06-14 16:04:02'),
  (130,'nl','Documentatie','','Y','','','2013-06-14 16:03:56','2013-06-14 16:04:35'),

  (140,'en','Contact','','Y','','','2013-06-14 16:03:56','2013-06-14 16:04:02'),
  (140,'nl','Contact','','Y','','','2013-06-14 16:03:56','2013-06-14 16:04:35');



 
--
-- Dumping data for table `content`
--

INSERT INTO `content` VALUES
(0,111,'en',10,'Y','T',0,'','<p><span>Vivamis sagittis lacus verl augue laoreet rutrum faucibus dolor auctor. Nullam quis risus eget urna mollis.</span></p>'),
(0,111,'nl',10,'Y','T',0,'','<p><span>Vivamis sagittis lacus verl augue laoreet rutrum faucibus dolor auctor. Nullam quis risus eget urna mollis.</span></p>'),

(0,111,'en',20,'N','T',0,'','<p><span>Vivamis sagittis lacus verl augue laoreet rutrum faucibus dolor auctor. Nullam quis risus eget urna mollis.</span></p>'),
(0,111,'nl',20,'N','T',0,'','<p><span>Vivamis sagittis lacus verl augue laoreet rutrum faucibus dolor auctor. Nullam quis risus eget urna mollis.</span></p>'),

(0,112,'nl',10,'Y','T',0,'','<p>nothing</p>'),
(0,112,'nl',10,'Y','T',0,'','<p>nothing</p>'),

(0,112,'nl',20,'N','T',0,'','<p>nothing</p>'),
(0,112,'nl',20,'N','T',0,'','<p>nothing</p>'),

(0,113,'nl',10,'N','T',0,'',''),
(0,113,'nl',10,'N','T',0,'',''),

(0,114,'nl',10,'N','T',0,'',''),
(0,114,'nl',10,'N','T',0,'','');
