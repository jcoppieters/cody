-- MySQL dump 10.13  Distrib 5.5.3-m3, for apple-darwin10.2.0 (i386)
--
-- Host: localhost    Database: codyweb
-- ------------------------------------------------------
-- Server version	5.5.3-m3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `atoms`
--

DROP TABLE IF EXISTS `atoms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `atoms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent` int(11) NOT NULL DEFAULT '0',
  `sortorder` int(11) DEFAULT '0',
  `name` varchar(64) NOT NULL DEFAULT '',
  `note` varchar(255) DEFAULT NULL,
  `extention` varchar(3) DEFAULT '',
  `created` datetime DEFAULT '0000-00-00 00:00:00',
  `updated` datetime DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=52 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atoms`
--

LOCK TABLES `atoms` WRITE;
/*!40000 ALTER TABLE `atoms` DISABLE KEYS */;
INSERT INTO `atoms` VALUES (1,0,10,'Images','','','2012-07-09 14:18:36','2012-07-09 14:18:36'),(2,0,20,'Files','','','2012-07-09 14:18:36','2012-07-09 14:18:36'),(3,0,20,'Forms','','','2012-07-09 14:18:36','2012-07-09 14:18:36'),(21,1,10,'Screenshots','','','2013-06-14 18:12:27','2013-06-14 18:12:27'),(22,21,10,'Page editor','','','2013-06-14 18:12:27','2013-06-14 18:12:27'),(23,22,10,'New page','','','2013-06-14 18:12:27','2013-06-14 18:12:27'),(24,22,20,'Add content','','','2013-06-14 18:12:27','2013-06-14 18:12:27'),(31,2,10,'Tutorials','','','2013-06-14 18:12:27','2013-06-14 18:12:27'),(32,31,10,'Controller','','','2013-06-14 18:12:27','2013-06-14 18:12:27'),(33,2,20,'Pictures','','','2013-06-14 18:12:27','2013-06-14 18:12:27'),(34,2,30,'Logos','','','2013-06-14 18:12:27','2013-06-14 18:12:27'),(36,1,5,'People','','','2013-06-19 15:47:52','2013-06-19 15:47:55'),(37,36,5,'Johan','JC14','JPG','2013-06-19 15:48:03','2013-06-19 16:09:14'),(38,34,5,'cody','logoM','png','2013-06-19 17:04:27','2013-06-19 17:05:01'),(39,23,5,'Step 1','Screen Shot 2013-06-19 at 18.19.20','JPG','2013-06-19 18:29:32','2013-06-19 18:29:53'),(40,23,5,'Step 2','','---','2013-06-19 18:29:57','2013-06-19 18:29:59'),(44,36,5,'Tim','photo','JPG','2013-06-21 15:10:38','2013-06-21 15:10:46'),(43,36,5,'Jelle','Pass-2','png','2013-06-21 14:50:27','2013-06-21 14:53:56'),(51,48,5,'Instadeal','Screen Shot 2013-06-24 at 17.23.17','JPG','2013-06-24 17:37:07','2013-06-24 17:37:20'),(48,1,5,'Examples','','xxx','2013-06-24 17:35:52','2013-06-24 17:35:56'),(50,48,5,'Essen','Screen Shot 2013-06-24 at 17.24.16','JPG','2013-06-24 17:36:51','2013-06-24 17:37:04');
/*!40000 ALTER TABLE `atoms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content`
--

DROP TABLE IF EXISTS `content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `content` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item` int(11) NOT NULL DEFAULT '0',
  `language` varchar(2) NOT NULL DEFAULT 'nl',
  `sortorder` int(11) DEFAULT '0',
  `intro` char(1) NOT NULL DEFAULT 'N',
  `kind` char(1) NOT NULL DEFAULT 'T',
  `atom` int(11) DEFAULT '0',
  `name` varchar(32) NOT NULL DEFAULT '',
  `data` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `item` (`item`,`language`)
) ENGINE=MyISAM AUTO_INCREMENT=142 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content`
--

LOCK TABLES `content` WRITE;
/*!40000 ALTER TABLE `content` DISABLE KEYS */;
INSERT INTO `content` VALUES (1,97,'nl',10,'N','T',0,'Page Content','<p><span>Cody draagt zorg voor uw privacy. Lees deze Privacyverklaring om meer te weten te komen over de manier waarop persoonsgegevens worden ingezameld en verwerkt op deze website. In dit geval handelt Cody Howest daarbij steeds in overeenstemming met de bepalingen van de Belgische privacywet (Wet van 8 december 1992 tot bescherming van de persoonlijke levenssfeer ten opzichte van de verwerking van persoonsgegevens). De persoonlijke gegevens beperken zich enkel tot uw e-mailadres.</span></p>\n<p><span><strong>Verantwoordelijke</strong></span></p>\n<p><span>De verantwoordelijke voor de verwerking is Cody Howest; Rijselstraat 5, 8000 Brugge.</span></p>\n<p><span><strong>Kennisname</strong></span></p>\n<p><span>U kan van deze persoonsgegevens kennis nemen door een aanvraag te richten aan Cody Howest</span><span>(brief, fax of e-mail) en ze, indien nodig, doen verbeteren of verwijderen. Indien u niet gecontacteerd wenst te worden in het kader van email marketing, zullen uw gegevens op uw verzoek kosteloos uit de betrokken lijsten worden</span></p>\n<p><span><strong>Cookies</strong></span></p>\n<p><span>Wij gebruiken cookies om uw toekomstig bezoek aan onze site vlotter te laten verlopen. Een cookie is een klein stukje tekst dat op uw harde schijf wordt geplaatst. Cookies worden veel gebruikt om een hoger functionaliteit, en dus betere dienst, aan de bezoekers te kunnen aanbieden. [U kan het gebruik van cookies uitschakelen, al leidt dit er wel toe dat effecten opsommen die ten gevolge van het uitschakelen van cookies worden veroorzaakt.]</span></p>\n<p><span><strong>Veiligheid</strong></span></p>\n<p><span>Cody Howest verbindt zich ertoe om al de gepaste technische en organisatorische maatregelen te treffen om uw persoonsgegevens te beschermen tegen vernietiging, verlies, onbedoelde wijziging, beschadiging of openbaarmaking.</span></p>\n<p><span><strong>Toestemming</strong></span></p>\n<p><span>Door u akkoord te verklaren met deze voorwaarden en condities geeft u ook uw toestemming voor de verwerking van uw persoonsgegevens voor de doeleinden zoals hierboven beschreven.</span></p>'),(2,98,'nl',10,'N','T',0,'Page Content','<p><span>Door gebruik te maken van deze website verklaart u zich akkoord met onderstaande voorwaarden en condities.</span></p>\n<p><span><strong>1. Website</strong></span></p>\n<p>De eigenaar van deze website is&nbsp;<br /> Cody Howest,<br /> Rijselstraat 5<br /> 8000, Brugge,&nbsp;<br /> Belgi&euml;<br /> Tel: 32(0)50 xx,&nbsp;<br /> E-mail: info@howest.be&nbsp;<br />ON: xx</p>\n<p><span>Als u niet akkoord gaat met onderstaande voorwaarden wordt u verzocht de website te verlaten. Cody behoudt zich het recht voor deze voorwaarden periodisch aan te passen waarna de leden op de hoogte zullen worden gebracht van deze wijzigingen. Wanneer u na deze kennisgeving de website blijft gebruiken verklaart u zich akkoord met de doorgevoerde wijzigingen. Cody Howest&nbsp; kan eventueel andere diensten aanbieden aan de gebruikers van deze site. In dat geval zullen de geldende voorwaarden apart worden medegedeeld.</span></p>\n<p><span><strong>2. Toegankelijkheid</strong></span></p>\n<p><span>Cody Howest&nbsp; probeert zo goed als mogelijk de website 24 uur per dag toegankelijk te houden, nochtans kan het gebeuren dat de website ontoegankelijk is voor een korte periode omwille van onderhoudswerken, aanpassingen of technische redenen.</span></p>\n<p><span><strong>3. Verantwoordelijkheid</strong></span></p>\n<p><span>Cody Howest weerlegt elke verantwoordelijkheid met betrekking tot deze website en de aangeboden informatie. Cody Howest&nbsp; verzekert niet dat de informatie op deze website correct, compleet of actueel is. Alle informatie, producten en diensten op deze website kunnen fouten bevatten. De gebruiker wordt verzocht hiermee rekening te houden.</span></p>\n<div><span><br /></span></div>'),(3,97,'en',10,'N','T',0,'Page Content','<p><span>Cody draagt zorg voor uw privacy. Lees deze Privacyverklaring om meer te weten te komen over de manier waarop persoonsgegevens worden ingezameld en verwerkt op deze website. In dit geval handelt Cody Howest daarbij steeds in overeenstemming met de bepalingen van de Belgische privacywet (Wet van 8 december 1992 tot bescherming van de persoonlijke levenssfeer ten opzichte van de verwerking van persoonsgegevens). De persoonlijke gegevens beperken zich enkel tot uw e-mailadres.</span></p>\n<p><span><strong>Verantwoordelijke</strong></span></p>\n<p><span>De verantwoordelijke voor de verwerking is Cody Howest; Rijselstraat 5, 8000 Brugge.</span></p>\n<p><span><strong>Kennisname</strong></span></p>\n<p><span>U kan van deze persoonsgegevens kennis nemen door een aanvraag te richten aan Cody Howest</span><span>(brief, fax of e-mail) en ze, indien nodig, doen verbeteren of verwijderen. Indien u niet gecontacteerd wenst te worden in het kader van email marketing, zullen uw gegevens op uw verzoek kosteloos uit de betrokken lijsten worden</span></p>\n<p><span><strong>Cookies</strong></span></p>\n<p><span>Wij gebruiken cookies om uw toekomstig bezoek aan onze site vlotter te laten verlopen. Een cookie is een klein stukje tekst dat op uw harde schijf wordt geplaatst. Cookies worden veel gebruikt om een hoger functionaliteit, en dus betere dienst, aan de bezoekers te kunnen aanbieden. [U kan het gebruik van cookies uitschakelen, al leidt dit er wel toe dat effecten opsommen die ten gevolge van het uitschakelen van cookies worden veroorzaakt.]</span></p>\n<p><span><strong>Veiligheid</strong></span></p>\n<p><span>Cody Howest verbindt zich ertoe om al de gepaste technische en organisatorische maatregelen te treffen om uw persoonsgegevens te beschermen tegen vernietiging, verlies, onbedoelde wijziging, beschadiging of openbaarmaking.</span></p>\n<p><span><strong>Toestemming</strong></span></p>\n<p><span>Door u akkoord te verklaren met deze voorwaarden en condities geeft u ook uw toestemming voor de verwerking van uw persoonsgegevens voor de doeleinden zoals hierboven beschreven.</span></p>'),(4,98,'en',10,'N','T',0,'Page Content','<p><span>Door gebruik te maken van deze website verklaart u zich akkoord met onderstaande voorwaarden en condities.</span></p>\n<p><span><strong>1. Website</strong></span></p>\n<p>De eigenaar van deze website is&nbsp;<br /> Cody Howest,<br /> Rijselstraat 5<br /> 8000, Brugge,&nbsp;<br /> Belgi&euml;<br /> Tel: 32(0)50 xx,&nbsp;<br /> E-mail: info@howest.be&nbsp;<br />ON: xx</p>\n<p><span>Als u niet akkoord gaat met onderstaande voorwaarden wordt u verzocht de website te verlaten. Cody behoudt zich het recht voor deze voorwaarden periodisch aan te passen waarna de leden op de hoogte zullen worden gebracht van deze wijzigingen. Wanneer u na deze kennisgeving de website blijft gebruiken verklaart u zich akkoord met de doorgevoerde wijzigingen. Cody Howest&nbsp; kan eventueel andere diensten aanbieden aan de gebruikers van deze site. In dat geval zullen de geldende voorwaarden apart worden medegedeeld.</span></p>\n<p><span><strong>2. Toegankelijkheid</strong></span></p>\n<p><span>Cody Howest&nbsp; probeert zo goed als mogelijk de website 24 uur per dag toegankelijk te houden, nochtans kan het gebeuren dat de website ontoegankelijk is voor een korte periode omwille van onderhoudswerken, aanpassingen of technische redenen.</span></p>\n<p><span><strong>3. Verantwoordelijkheid</strong></span></p>\n<p><span>Cody Howest weerlegt elke verantwoordelijkheid met betrekking tot deze website en de aangeboden informatie. Cody Howest&nbsp; verzekert niet dat de informatie op deze website correct, compleet of actueel is. Alle informatie, producten en diensten op deze website kunnen fouten bevatten. De gebruiker wordt verzocht hiermee rekening te houden.</span></p>\n<div><span><br /></span></div>'),(5,111,'en',10,'Y','T',0,'Page Content','<p><span>Cody is built upon 15 years of expercience with many other CMS and web application frameworks ranging from widely available aging systems like Wordpress, Drupal, Sharepoint and DotNetNuke over in house developed systems in C and Java/JSP till <span>state of the art stuff like Ruby on Rails and Google\'s Angular.</span></span></p>\r\n<p><span><span>We took from each of those systems the bare minimum and made a strong extendable kernel. you can plug </span></span>in extra functionality, self written or taken from our community of web app developers.</p>'),(7,111,'en',20,'N','T',0,'Page Content','<p><span>Vivamis sagittis lacus verl augue laoreet rutrum faucibus dolor auctor. Nullam quis risus eget urna mollis.</span></p>'),(119,111,'nl',20,'N','T',0,'Page content','<p><span>Vivamis sagittis lacus verl augue laoreet rutrum faucibus dolor auctor. Nullam quis risus eget urna mollis.</span></p>'),(117,112,'nl',20,'N','T',0,'Page content','<p><span>Vivamis sagittis lacus verl augue laoreet rutrum faucibus dolor auctor. Nullam quis risus eget urna mollis.</span></p>'),(13,113,'nl',20,'N','T',0,'Page Content',''),(15,114,'nl',20,'N','T',0,'Page Content',''),(17,120,'nl',20,'N','I',37,'',''),(18,120,'nl',30,'N','T',0,'Page Content','<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.</p>\r\n<p><img title=\"- Johan\" src=\"../data/images/37.JPG\" alt=\"- Johan\" width=\"293\" height=\"212\" /></p>\r\n<p>Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.</p>'),(21,120,'nl',50,'N','M',0,'',''),(20,120,'nl',40,'N','F',38,'',''),(23,120,'nl',10,'Y','S',0,'Short intro','asdasd sad asd\r\nsad sadsad as'),(31,114,'en',20,'N','T',0,'Page Content',''),(33,0,'',10,'Y','S',0,'Short descriptionn',''),(32,114,'en',30,'N','T',0,'Page Content','<p>If you\'re willing to try out our new CMS, give us some feedback and don\'t want to program new controllers yourself, we offer you free hosting for your own website.</p>'),(36,0,'',20,'N','T',0,'Page content',''),(37,0,'',10,'Y','S',0,'Short descriptionn',''),(38,0,'',20,'N','T',0,'Page content',''),(126,130,'nl',10,'N','T',0,'Text',''),(127,130,'nl',10,'N','S',0,'String',''),(129,110,'nl',10,'N','I',50,'Image',''),(130,110,'nl',20,'N','I',51,'Image',''),(131,114,'en',10,'Y','T',0,'Text','<p>If you don\'t need custom built functionality, you can host your own website here for free.</p>\r\n<p>If you want to extend your application with more than the standard functionality, you can host your own site, we\'ll provide you step by step instructions on how to set up a server and write extra models, views and controllers.</p>'),(115,114,'nl',10,'Y','S',0,'Short intro','introooooo'),(118,111,'nl',10,'Y','S',0,'Short description',''),(116,112,'nl',10,'Y','S',0,'Short description',''),(114,113,'nl',10,'Y','S',0,'Short intro','intro'),(132,112,'en',10,'Y','T',0,'Text','<p>Cody runs on top of Node.js, a platform built on Google Chrome\'s JavaScript runtime for easily building fast, scalable network applications.</p>\r\n<p>Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for running everything from simple websites to data-intensive real-time web applications across distributed devices.</p>\r\n<p>Cody is written from ground up in Javascript. From now on you can use s<span>erver and client side this same 1</span> language for creating your next web app.</p>'),(133,112,'en',20,'N','T',0,'Text',''),(134,113,'en',20,'N','T',0,'Text','<p> </p>\r\n<p>Imagine if everything we\'ve learned throughout history was kept hidden or its use was restricted to only those who are willing to pay for it. Education and research would suffer. Publishing books or sharing information of any sort would become difficult. But that\'s exactly the mentality behind the proprietary software model. In the same way shared knowledge propels the whole of society forward, open technology development can drive innovation.</p>\r\n<p><a href=\"http://www.pcworld.com/article/209891/10_reasons_open_source_is_good_for_business.html\" target=\"_blank\">10 reasons why open source is good for business</a></p>'),(136,110,'en',10,'N','I',50,'Image',''),(137,110,'en',20,'N','I',51,'Image',''),(135,113,'en',10,'Y','T',0,'Text','<p>Cody is fully open source. You can copy it, read the code, modify it, use it however you want. There is no fee, licence price.</p>\r\n<p>Open source simply creates better software. Everyone collaborates around the world. As a result, the open source model builds higher-quality, more secure, more easily integrated software. And it does it at a vastly accelerated pace, often at a lower cost.</p>\r\n<p>Openness. Transparency. Collaboration. Diversity. Rapid prototyping.</p>');
/*!40000 ALTER TABLE `content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domains`
--

DROP TABLE IF EXISTS `domains`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domains` (
  `id` varchar(32) NOT NULL DEFAULT '',
  `name` varchar(32) DEFAULT '?'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domains`
--

LOCK TABLES `domains` WRITE;
/*!40000 ALTER TABLE `domains` DISABLE KEYS */;
INSERT INTO `domains` VALUES ('admin','Admin'),('cms','CMS Users'),('user','Users');
/*!40000 ALTER TABLE `domains` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL DEFAULT '',
  `parent` int(11) NOT NULL DEFAULT '0',
  `user` int(11) DEFAULT '0',
  `template` int(11) NOT NULL DEFAULT '1',
  `orderby` char(1) DEFAULT 'A',
  `sortorder` int(11) DEFAULT '0',
  `dated` date DEFAULT '0000-00-00',
  `validfrom` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `validto` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `showcontent` char(1) DEFAULT 'Y',
  `needslogin` char(1) DEFAULT 'N',
  `defaultrequest` varchar(32) DEFAULT '',
  `alloweddomains` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `parent_idx` (`parent`)
) ENGINE=MyISAM AUTO_INCREMENT=156 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,'Website',-1,1,100,'M',100,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','S','N','',''),(3,'Pages',-1,1,100,'M',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(2,'Login',3,1,2,'A',99,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),(99,'Global',3,1,100,'A',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),(4,'Footer',-1,1,100,'M',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(97,'Privacy Verklaring',4,1,100,'A',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),(98,'Disclaimer',4,1,100,'A',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),(9,'Dashboard',-1,1,9,'M',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(10,'CMS',9,1,2,'M',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','S','Y','',''),(11,'CMS - Page',10,1,11,'A',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(12,'CMS - Images',10,1,12,'A',20,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(13,'CMS - Files',10,1,13,'A',30,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(14,'CMS - Forms',10,1,14,'A',40,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(15,'CMS - Users',10,1,15,'A',50,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','list',''),(16,'CMS - Templates',10,1,16,'A',60,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','list',''),(17,'CMS - System',10,1,17,'A',70,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(110,'Home',1,1,101,'M',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y',NULL,'list',''),(111,'UserFriendly',110,1,100,'A',40,'2013-06-14','2013-06-14 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),(112,'Node',110,1,100,'A',20,'2013-06-14','2013-06-14 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),(113,'OpenSource',110,1,100,'A',10,'2013-06-14','2013-06-14 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),(114,'Hosting',110,1,100,'A',30,'2013-06-14','2013-06-14 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),(120,'About',1,1,100,'A',20,'2013-06-14','2013-06-14 00:00:00','2101-01-31 00:00:00','S',NULL,'list',''),(130,'Documentation',1,1,100,'A',30,'2013-06-14','2013-06-14 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),(140,'ContactUs',1,1,100,'A',40,'2013-06-14','2013-06-14 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),(20,'Admin',9,1,9,'M',70,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','S','N','',''),(21,'Admin - Contact us',20,1,103,'M',70,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','S','N','',''),(149,'Developers',120,1,100,'A',5,'2013-07-11','2013-07-11 14:51:25','2101-01-31 23:59:59','Y',NULL,'list',''),(151,'Javascript',120,1,100,'A',5,'2013-07-11','2013-07-11 14:55:45','2101-01-31 23:59:59','Y',NULL,'list',''),(152,'Database',130,1,100,'A',20,'2013-07-11','2013-07-11 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),(153,'Making a Controller',130,1,100,'A',10,'2013-07-11','2013-07-11 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),(154,'Your first view',130,1,100,'A',40,'2013-07-11','2013-07-11 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),(155,'Building a website',130,1,100,'A',30,'2013-07-11','2013-07-11 00:00:00','2101-01-31 00:00:00','Y',NULL,'list','');
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `languages`
--

DROP TABLE IF EXISTS `languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `languages` (
  `id` varchar(4) NOT NULL DEFAULT '',
  `name` varchar(32) DEFAULT '',
  `sortorder` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `languages`
--

LOCK TABLES `languages` WRITE;
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
INSERT INTO `languages` VALUES ('en','English',1),('nl','Nederlands',2);
/*!40000 ALTER TABLE `languages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `levels`
--

DROP TABLE IF EXISTS `levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `levels` (
  `id` int(11) DEFAULT NULL,
  `name` varchar(32) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `levels`
--

LOCK TABLES `levels` WRITE;
/*!40000 ALTER TABLE `levels` DISABLE KEYS */;
INSERT INTO `levels` VALUES (2,'user'),(50,'admin'),(99,'super');
/*!40000 ALTER TABLE `levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pages` (
  `item` int(11) NOT NULL DEFAULT '0',
  `language` varchar(2) NOT NULL DEFAULT '',
  `title` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `active` char(1) DEFAULT 'Y',
  `keywords` varchar(255) DEFAULT '',
  `description` varchar(255) DEFAULT '',
  `created` datetime DEFAULT '0000-00-00 00:00:00',
  `updated` datetime DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`item`,`language`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pages`
--

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT INTO `pages` VALUES (1,'nl','Website','welcome','Y','','','2010-01-01 00:00:00','2013-01-23 10:40:29'),(3,'nl','Pages','','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(2,'nl','Login','login','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(99,'nl','Global','global','Y','','','2010-01-01 00:00:00','2012-08-15 22:02:59'),(4,'nl','Footer','','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(97,'nl','Privacy Verklaring','privacy','Y','','','2010-01-01 00:00:00','2013-03-19 09:30:30'),(98,'nl','Disclaimer','disclaimer','Y','','','2010-01-01 00:00:00','2012-08-20 17:09:50'),(9,'nl','Dashboard','dashboard','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(10,'nl','Website CMS','cms','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(11,'nl','Structuur','pages','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(12,'nl','Beelden','images','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(13,'nl','Bestanden','files','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(14,'nl','Formulieren','forms','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(15,'nl','Gebruikers','users','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(16,'nl','Sjablonen','templates','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(17,'nl','Systeem','system','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(1,'en','Website','welcome','Y','','','2010-01-01 00:00:00','2013-01-23 10:40:29'),(3,'en','Pages','','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(2,'en','Login','login','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(99,'en','Global','global','Y','','','2010-01-01 00:00:00','2012-08-15 22:02:59'),(4,'en','Footer','','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(97,'en','Privacy','privacy','Y','','','2010-01-01 00:00:00','2013-03-19 09:30:30'),(98,'en','Disclaimer','disclaimer','Y','','','2010-01-01 00:00:00','2012-08-20 17:09:50'),(9,'en','Dashboard','dashboard','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(10,'en','Website CMS','cms','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(11,'en','Structure','pages','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(12,'en','Images','images','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(13,'en','Files','files','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(14,'en','Forms','forms','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(15,'en','Users','users','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(16,'en','Templates','templates','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(17,'en','System','system','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(20,'nl','Beheer','admin','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(21,'nl','Contact Us','admin-contact','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(20,'en','Admin','admin','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(21,'en','Contact Us','admin-contact','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(110,'en','Home','info','Y','','','2010-01-01 00:00:00','2013-07-11 12:27:55'),(110,'nl','Home','info','Y','','','2010-01-01 00:00:00','2013-06-24 17:38:04'),(111,'en','User Friendly','','Y','','','2013-06-14 15:50:52','2013-07-11 14:55:18'),(111,'nl','Gebruiksvriendelijk','','Y','','','2013-06-14 15:50:52','2013-06-22 18:01:52'),(112,'en','Node.js','','Y','','','2013-06-14 15:50:27','2013-07-11 14:55:05'),(112,'nl','Node.js','','Y','','','2013-06-14 15:50:27','2013-06-22 15:27:21'),(113,'en','Open Source','','Y','','','2013-06-14 15:50:27','2013-07-11 14:55:00'),(113,'nl','Open Source','','Y','','','2013-06-14 15:50:27','2013-06-22 15:23:31'),(114,'en','Hosting','','Y','','','2013-06-14 15:50:27','2013-07-11 14:55:12'),(114,'nl','Hosting','','Y','','','2013-06-14 15:50:27','2013-06-22 15:23:59'),(120,'en','About','','Y','','','2013-06-14 16:03:10','2013-07-11 15:48:13'),(120,'nl','About','','Y','','','2013-06-14 16:03:10','2013-06-19 17:46:59'),(130,'en','Documentation','','Y','','','2013-06-14 16:03:56','2013-07-11 15:48:22'),(130,'nl','Documentation','','Y','','','2013-06-14 16:03:56','2013-06-19 17:50:07'),(140,'en','Contact','','Y','','','2013-06-14 16:03:56','2013-07-11 15:28:27'),(140,'nl','Contact','','Y','','','2013-06-14 16:03:56','2013-06-14 16:04:35'),(149,'en','Developers','','Y','','','2013-07-11 14:51:25','2013-07-11 14:51:54'),(149,'nl','New item','','Y','','','2013-07-11 14:51:25','2013-07-11 14:51:25'),(151,'nl','New item','','Y','','','2013-07-11 14:55:45','2013-07-11 14:55:45'),(151,'en','Javascript','','Y','','','2013-07-11 14:55:45','2013-07-11 14:55:50'),(152,'en','Database','database','Y','','','2013-07-11 14:56:47','2013-07-11 15:00:01'),(152,'nl','Database','database','Y','','','2013-07-11 14:56:47','2013-07-11 14:58:44'),(153,'en','Making a Controller','controller','Y','','','2013-07-11 14:57:05','2013-07-11 15:00:07'),(153,'nl','Controller','controller','Y','','','2013-07-11 14:57:05','2013-07-11 14:59:13'),(154,'en','Your first view','views','Y','','','2013-07-11 14:57:22','2013-07-11 14:59:39'),(154,'nl','Eerste view','views','Y','','','2013-07-11 14:57:22','2013-07-11 14:59:46'),(155,'en','Building a website','','Y','','','2013-07-11 15:02:44','2013-07-11 15:02:53'),(155,'nl','Een website maken','website','Y','','','2013-07-11 15:02:44','2013-07-11 15:03:15');
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `templates`
--

DROP TABLE IF EXISTS `templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT '',
  `controller` varchar(64) DEFAULT '',
  `fn` varchar(128) DEFAULT '',
  `allowedtemplates` varchar(255) DEFAULT '',
  `maxnumber` int(11) DEFAULT '99999',
  `system` char(1) DEFAULT 'N',
  `defaultchild` int(11) DEFAULT '0',
  `description` varchar(127) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=116 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `templates`
--

LOCK TABLES `templates` WRITE;
/*!40000 ALTER TABLE `templates` DISABLE KEYS */;
INSERT INTO `templates` VALUES (2,'Login','LoginController','login.ejs','',0,'Y',0,''),(9,'Dashboard','DashboardController','-/cms/dashboard.ejs','',0,'Y',0,''),(11,'CMS-Page','PageController','-/cms/pages.ejs','',0,'Y',0,''),(12,'CMS-Images','ImageController','-/cms/images.ejs','',0,'Y',0,''),(13,'CMS-Files','FileController','-/cms/files.ejs','',0,'Y',0,''),(14,'CMS-Forms','FormController','-/cms/forms.ejs','',0,'Y',0,''),(15,'CMS-Users','UserController','-/cms/users.ejs','',0,'Y',0,''),(16,'CMS-Templates','TemplateController','-/cms/templates.ejs','',0,'Y',0,''),(17,'CMS-System','SystemController','','',0,'Y',0,''),(100,'Content','ContentController','page.ejs','',999,'N',100,''),(103,'Contact','ContactController','contact.ejs','',0,'N',0,''),(101,'Home','ContentController','index.ejs','101',999,'N',100,'Use only for the home page\r\nshow intro description of sub pages');
/*!40000 ALTER TABLE `templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(128) NOT NULL DEFAULT '-',
  `name` varchar(128) NOT NULL DEFAULT '-',
  `password` varchar(32) NOT NULL DEFAULT '-',
  `domain` varchar(32) NOT NULL DEFAULT '',
  `level` int(11) NOT NULL DEFAULT '0',
  `badlogins` int(11) NOT NULL DEFAULT '0',
  `maxbadlogins` int(11) NOT NULL DEFAULT '999',
  `active` char(1) NOT NULL DEFAULT 'Y',
  `email` varchar(128) NOT NULL DEFAULT '',
  `note` varchar(255) NOT NULL DEFAULT '',
  `nomail` char(1) NOT NULL DEFAULT 'N',
  `sortorder` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_idx` (`username`,`active`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'rsuper','rWorks Super','akitest','rWorks',99,0,99,'Y','johan577@mac.com','','N',10),(2,'radmin','rWorks Admin','akitest','rWorks',50,0,99,'Y','johan577@mac.com','','N',0),(3,'rtest','rWorks Test','akitest','rWorks',2,0,99,'Y','johan577@mac.com','','N',0),(11,'user','Mr. User Vaneigens','user','users',50,0,99,'Y','user@cody-cms.be','','N',10);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-07-11 17:39:23
