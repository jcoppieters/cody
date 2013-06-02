set names utf8;


/*!40101 SET NAMES utf8 */;

--
-- Dumping data for table `users`
--

// insert into domains values ("user", "Users");

//INSERT INTO `users` VALUES
// (9,'codyweb','Cody User','ydoc','user',50,0,99,'Y','cody@cody.com','','N',0),



--
-- Dumping data for table `atoms`
--

//INSERT INTO `atoms` VALUES
// (21,1,10,'Algemeen','','','2012-08-15 18:55:51','2012-08-15 18:55:54'),
//  (22,21,10,'Kaartje','','JPG','2012-08-15 20:57:34','2012-08-15 22:57:44');

//INSERT INTO `atoms` VALUES
// (31,2,10,'a file','','pdf','2012-08-15 18:55:51','2012-08-15 18:55:54');

--
-- Dumping data for table `templates`
--

//INSERT INTO `templates` VALUES
// (103,'Contact',       'ContactController', 'front/contact.ejs','',0,'N',0);


--
-- Dumping data for table `items`
--

//INSERT INTO `items` VALUES
//  (20,'Admin',9, 1,2,'M',1,'2010-01-01','2010-01-01','2100-01-01','S','Y','',''),
//    (21,'Admin - Agenda',20,1,21,'A',10,'2010-01-01','2010-01-01','2100-01-01','Y','Y','','');


//INSERT INTO `items` VALUES
// (101,'Info',1,1,100,'M',70,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','S','N','','');





//INSERT INTO `pages` VALUES
//  (20,'nl','Beheer - Praktijk','admin','Y','','','2010-01-01','2010-01-01'),
//    (21,'nl','Agenda','agenda','Y','','','2010-01-01','2010-01-01');

//INSERT INTO `pages` VALUES
//  (101,'nl','Info','info','Y','','','2010-01-01 00:00:00','2012-08-28 09:39:37');

//INSERT INTO `pages` VALUES
//  (20,'en','Managment','admin','Y','','','2010-01-01','2010-01-01'),
//    (21,'en','Agenda','agenda','Y','','','2010-01-01','2010-01-01');

//INSERT INTO `pages` VALUES
(101,'en','Info','info','Y','','','2010-01-01 00:00:00','2012-08-28 09:39:37');


update pages set link = 'welcome' where item = 1;

 
--
-- Dumping data for table `content`
--

//INSERT INTO `content` VALUES
// (0,101,'nl',10,'N','T',0,'','<p>De huisartsenpraktijk \'De Essen\' is een jonge en dynamische groepspraktijk waar de zorg voor onze pati&euml;nten centraal staat.&nbsp;Wij&nbsp;willen&nbsp;deze zorg bieden,&nbsp;als team, zoveel&nbsp;als mogelijk wetenschappelijk onderbouwd,&nbsp;met respect&nbsp;voor&nbsp;uw en onze visie.&nbsp;<br />&nbsp;</p>\n<p>Om deze zorg mogelijk te maken,&nbsp;wensen wij een paar afspraken met u te maken. Deze zijn te vinden op onze website.&nbsp;<br />&nbsp;</p>\n<p>Wij hopen zo op een fijne samenwerking en bedanken u voor het vertrouwen dat u stelt in onze praktijk.</p>');

//INSERT INTO `content` VALUES
// (0,101,'en',10,'N','T',0,'','<p>De huisartsenpraktijk \'De Essen\' is een jonge en dynamische groepspraktijk waar de zorg voor onze pati&euml;nten centraal staat.&nbsp;Wij&nbsp;willen&nbsp;deze zorg bieden,&nbsp;als team, zoveel&nbsp;als mogelijk wetenschappelijk onderbouwd,&nbsp;met respect&nbsp;voor&nbsp;uw en onze visie.&nbsp;<br />&nbsp;</p>\n<p>Om deze zorg mogelijk te maken,&nbsp;wensen wij een paar afspraken met u te maken. Deze zijn te vinden op onze website.&nbsp;<br />&nbsp;</p>\n<p>Wij hopen zo op een fijne samenwerking en bedanken u voor het vertrouwen dat u stelt in onze praktijk.</p>');



//INSERT INTO `content` VALUES
// (0,99,'nl',10,'Y','S',0,'From Email','secretariaat@de-essen.be');



//INSERT INTO `content` VALUES
//  (0,99,'en',10,'Y','S',0,'From Email','secretariaat@de-essen.be');

