-- MySQL dump 10.13  Distrib 5.5.3-m3, for apple-darwin10.2.0 (i386)
--
-- Host: localhost    Database: empty
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
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atoms`
--

LOCK TABLES `atoms` WRITE;
/*!40000 ALTER TABLE `atoms` DISABLE KEYS */;
INSERT INTO `atoms` VALUES (1,0,10,'Images','','','2012-07-09 14:18:36','2012-07-09 14:18:36'),
(2,0,20,'Files','','','2012-07-09 14:18:36','2012-07-09 14:18:36'),
(3,0,20,'Forms','','','2012-07-09 14:18:36','2012-07-09 14:18:36'),
(21,1,10,'Global','','','2012-08-15 18:55:51','2012-08-15 18:55:54'),
(22,21,10,'Test image','Testing one-two','jpg','2012-08-15 20:57:34','2013-07-09 15:34:34'),
(31,2,10,'Test file','','pdf','2012-08-15 18:55:51','2012-08-15 18:55:54');
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
) ENGINE=MyISAM AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content`
--

LOCK TABLES `content` WRITE;
/*!40000 ALTER TABLE `content` DISABLE KEYS */;
INSERT INTO `content` VALUES (1,97,'nl',10,'N','T',0,'','<p><span>Cody draagt zorg voor uw privacy. Lees deze Privacyverklaring om meer te weten te komen over de manier waarop persoonsgegevens worden ingezameld en verwerkt op deze website. In dit geval handelt Cody Howest daarbij steeds in overeenstemming met de bepalingen van de Belgische privacywet (Wet van 8 december 1992 tot bescherming van de persoonlijke levenssfeer ten opzichte van de verwerking van persoonsgegevens). De persoonlijke gegevens beperken zich enkel tot uw e-mailadres.</span></p>\n<p><span><strong>Verantwoordelijke</strong></span></p>\n<p><span>De verantwoordelijke voor de verwerking is Cody Howest; Rijselstraat 5, 8000 Brugge.</span></p>\n<p><span><strong>Kennisname</strong></span></p>\n<p><span>U kan van deze persoonsgegevens kennis nemen door een aanvraag te richten aan Cody Howest</span><span>(brief, fax of e-mail) en ze, indien nodig, doen verbeteren of verwijderen. Indien u niet gecontacteerd wenst te worden in het kader van email marketing, zullen uw gegevens op uw verzoek kosteloos uit de betrokken lijsten worden</span></p>\n<p><span><strong>Cookies</strong></span></p>\n<p><span>Wij gebruiken cookies om uw toekomstig bezoek aan onze site vlotter te laten verlopen. Een cookie is een klein stukje tekst dat op uw harde schijf wordt geplaatst. Cookies worden veel gebruikt om een hoger functionaliteit, en dus betere dienst, aan de bezoekers te kunnen aanbieden. [U kan het gebruik van cookies uitschakelen, al leidt dit er wel toe dat effecten opsommen die ten gevolge van het uitschakelen van cookies worden veroorzaakt.]</span></p>\n<p><span><strong>Veiligheid</strong></span></p>\n<p><span>Cody Howest verbindt zich ertoe om al de gepaste technische en organisatorische maatregelen te treffen om uw persoonsgegevens te beschermen tegen vernietiging, verlies, onbedoelde wijziging, beschadiging of openbaarmaking.</span></p>\n<p><span><strong>Toestemming</strong></span></p>\n<p><span>Door u akkoord te verklaren met deze voorwaarden en condities geeft u ook uw toestemming voor de verwerking van uw persoonsgegevens voor de doeleinden zoals hierboven beschreven.</span></p>'),
(2,98,'nl',10,'N','T',0,'','<p><span>Door gebruik te maken van deze website verklaart u zich akkoord met onderstaande voorwaarden en condities.</span></p>\n<p><span><strong>1. Website</strong></span></p>\n<p>De eigenaar van deze website is&nbsp;<br /> Cody Howest,<br /> Rijselstraat 5<br /> 8000, Brugge,&nbsp;<br /> Belgi&euml;<br /> Tel: 32(0)50 xx,&nbsp;<br /> E-mail: info@howest.be&nbsp;<br />ON: xx</p>\n<p><span>Als u niet akkoord gaat met onderstaande voorwaarden wordt u verzocht de website te verlaten. Cody behoudt zich het recht voor deze voorwaarden periodisch aan te passen waarna de leden op de hoogte zullen worden gebracht van deze wijzigingen. Wanneer u na deze kennisgeving de website blijft gebruiken verklaart u zich akkoord met de doorgevoerde wijzigingen. Cody Howest&nbsp; kan eventueel andere diensten aanbieden aan de gebruikers van deze site. In dat geval zullen de geldende voorwaarden apart worden medegedeeld.</span></p>\n<p><span><strong>2. Toegankelijkheid</strong></span></p>\n<p><span>Cody Howest&nbsp; probeert zo goed als mogelijk de website 24 uur per dag toegankelijk te houden, nochtans kan het gebeuren dat de website ontoegankelijk is voor een korte periode omwille van onderhoudswerken, aanpassingen of technische redenen.</span></p>\n<p><span><strong>3. Verantwoordelijkheid</strong></span></p>\n<p><span>Cody Howest weerlegt elke verantwoordelijkheid met betrekking tot deze website en de aangeboden informatie. Cody Howest&nbsp; verzekert niet dat de informatie op deze website correct, compleet of actueel is. Alle informatie, producten en diensten op deze website kunnen fouten bevatten. De gebruiker wordt verzocht hiermee rekening te houden.</span></p>\n<div><span><br /></span></div>'),
(3,97,'en',10,'N','T',0,'','<p><span>Cody draagt zorg voor uw privacy. Lees deze Privacyverklaring om meer te weten te komen over de manier waarop persoonsgegevens worden ingezameld en verwerkt op deze website. In dit geval handelt Cody Howest daarbij steeds in overeenstemming met de bepalingen van de Belgische privacywet (Wet van 8 december 1992 tot bescherming van de persoonlijke levenssfeer ten opzichte van de verwerking van persoonsgegevens). De persoonlijke gegevens beperken zich enkel tot uw e-mailadres.</span></p>\n<p><span><strong>Verantwoordelijke</strong></span></p>\n<p><span>De verantwoordelijke voor de verwerking is Cody Howest; Rijselstraat 5, 8000 Brugge.</span></p>\n<p><span><strong>Kennisname</strong></span></p>\n<p><span>U kan van deze persoonsgegevens kennis nemen door een aanvraag te richten aan Cody Howest</span><span>(brief, fax of e-mail) en ze, indien nodig, doen verbeteren of verwijderen. Indien u niet gecontacteerd wenst te worden in het kader van email marketing, zullen uw gegevens op uw verzoek kosteloos uit de betrokken lijsten worden</span></p>\n<p><span><strong>Cookies</strong></span></p>\n<p><span>Wij gebruiken cookies om uw toekomstig bezoek aan onze site vlotter te laten verlopen. Een cookie is een klein stukje tekst dat op uw harde schijf wordt geplaatst. Cookies worden veel gebruikt om een hoger functionaliteit, en dus betere dienst, aan de bezoekers te kunnen aanbieden. [U kan het gebruik van cookies uitschakelen, al leidt dit er wel toe dat effecten opsommen die ten gevolge van het uitschakelen van cookies worden veroorzaakt.]</span></p>\n<p><span><strong>Veiligheid</strong></span></p>\n<p><span>Cody Howest verbindt zich ertoe om al de gepaste technische en organisatorische maatregelen te treffen om uw persoonsgegevens te beschermen tegen vernietiging, verlies, onbedoelde wijziging, beschadiging of openbaarmaking.</span></p>\n<p><span><strong>Toestemming</strong></span></p>\n<p><span>Door u akkoord te verklaren met deze voorwaarden en condities geeft u ook uw toestemming voor de verwerking van uw persoonsgegevens voor de doeleinden zoals hierboven beschreven.</span></p>'),
(4,98,'en',10,'N','T',0,'','<p><span>Door gebruik te maken van deze website verklaart u zich akkoord met onderstaande voorwaarden en condities.</span></p>\n<p><span><strong>1. Website</strong></span></p>\n<p>De eigenaar van deze website is&nbsp;<br /> Cody Howest,<br /> Rijselstraat 5<br /> 8000, Brugge,&nbsp;<br /> Belgi&euml;<br /> Tel: 32(0)50 xx,&nbsp;<br /> E-mail: info@howest.be&nbsp;<br />ON: xx</p>\n<p><span>Als u niet akkoord gaat met onderstaande voorwaarden wordt u verzocht de website te verlaten. Cody behoudt zich het recht voor deze voorwaarden periodisch aan te passen waarna de leden op de hoogte zullen worden gebracht van deze wijzigingen. Wanneer u na deze kennisgeving de website blijft gebruiken verklaart u zich akkoord met de doorgevoerde wijzigingen. Cody Howest&nbsp; kan eventueel andere diensten aanbieden aan de gebruikers van deze site. In dat geval zullen de geldende voorwaarden apart worden medegedeeld.</span></p>\n<p><span><strong>2. Toegankelijkheid</strong></span></p>\n<p><span>Cody Howest&nbsp; probeert zo goed als mogelijk de website 24 uur per dag toegankelijk te houden, nochtans kan het gebeuren dat de website ontoegankelijk is voor een korte periode omwille van onderhoudswerken, aanpassingen of technische redenen.</span></p>\n<p><span><strong>3. Verantwoordelijkheid</strong></span></p>\n<p><span>Cody Howest weerlegt elke verantwoordelijkheid met betrekking tot deze website en de aangeboden informatie. Cody Howest&nbsp; verzekert niet dat de informatie op deze website correct, compleet of actueel is. Alle informatie, producten en diensten op deze website kunnen fouten bevatten. De gebruiker wordt verzocht hiermee rekening te houden.</span></p>\n<div><span><br /></span></div>'),
(5,101,'nl',10,'N','T',0,'Content1','<p>Ik ben echte inhoud ...</p>'),
(6,101,'en',10,'N','T',0,'Content1','<p>I\'m real content ....</p>'),

(7,1,'nl',10,'Y','S',0,'phone','050-705336'),(8,1,'en',10,'Y','S',0,'phone','050-705336'),
(9,1,'nl',20,'Y','S',0,'address','mijn straat 007 - 54321 C City'),
(10,1,'en',20,'Y','S',0,'address','myStreet 007 - 54321 Bond City'),
(12,1,'nl',30,'N','S',0,'footer.first','links'),
(13,1,'nl',40,'N','S',0,'footer.second','rechts'),
(14,1,'nl',50,'N','S',0,'footer.third','midden'),
(15,1,'en',30,'N','S',0,'footer.first','left'),
(16,1,'en',40,'N','S',0,'footer.second','right'),
(17,1,'en',50,'N','S',0,'footer.third','middle'),

(18,104,'nl',10,'N','T',0,'Text','<p>Ik weet iets, niet veel, maar toch...</p>\r\n<p>iedereen weet iets</p>'),
(19,104,'en',10,'N','T',0,'Text','<p>I know nothing, not much, but still...</p>\r\n<p>everybody knows something</p>'),
(21,-4,'*',10,'N','S',0,'next','Next'),
(22,-4,'*',20,'N','S',0,'prev','Previous'),
(23,-4,'*',30,'N','S',0,'more','Add more here and click \'Adjust\' in the translation page in each language'),
(24,4,'nl',10,'N','S',0,'next','Next'),(25,4,'nl',20,'N','S',0,'prev','Previous'),
(26,4,'nl',30,'N','S',0,'more','Add more to the template \'Strings\' and click \'Adjust\''),
(27,4,'en',10,'N','S',0,'next','Next'),(28,4,'en',20,'N','S',0,'prev','Previous'),
(29,4,'en',30,'N','S',0,'more','Add more to the template \'Strings\' and click \'Adjust\'');
/*!40000 ALTER TABLE `content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data`
--

DROP TABLE IF EXISTS `data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `atom` int(11) NOT NULL DEFAULT '0',
  `data` text,
  `status` char(1) NOT NULL DEFAULT 'S',
  `created` datetime NOT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data`
--

LOCK TABLES `data` WRITE;
/*!40000 ALTER TABLE `data` DISABLE KEYS */;
/*!40000 ALTER TABLE `data` ENABLE KEYS */;
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
INSERT INTO `domains` VALUES ('admin','Admin'),('cms','CMS Users'),('user','Users'),('user','Users');
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
) ENGINE=MyISAM AUTO_INCREMENT=106 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES
(1,'Website',-1,1,3,'A',100,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','S',NULL,'list',''),
(3,'Pages',-1,1,3,'M',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),
(2,'Login',3,1,2,'A',99,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),
(4,'Strings',3,1,4,'M',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),
(9,'Dashboard',-1,1,9,'M',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),
(10,'CMS',9,1,3,'M',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','S','Y','',''),
(11,'CMS - Page',10,1,11,'A',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),
(12,'CMS - Images',10,1,12,'A',20,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),
(13,'CMS - Files',10,1,13,'A',30,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),
(14,'CMS - Forms',10,1,14,'A',40,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),
(15,'CMS - Users',10,1,15,'A',50,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','list',''),
(16,'CMS - Templates',10,1,16,'A',60,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','list',''),
(17,'CMS - System',10,1,17,'A',70,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),
(20,'Admin',9,1,3,'M',20,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),
(21,'Admin - Forms',20,1,21,'A',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),
(22,'Admin - Comments',20,1,22,'A',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),
(97,'Privacy Verklaring',3,1,100,'A',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),
(98,'Disclaimer',3,1,100,'A',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),
(99,'Global',3,1,100,'A',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),
(101,'Info',1,1,100,'M',70,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y',NULL,'list',''),
(102,'Content',1,1,100,'A',5,'2013-07-11','2013-07-11 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),
(103,'About',1,1,100,'A',5,'2013-07-11','2013-07-11 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),
(104,'Page 1',102,1,100,'A',5,'2013-07-11','2013-07-11 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),
(105,'Page 2',102,1,100,'A',5,'2013-07-11','2013-07-11 00:00:00','2101-01-31 00:00:00','Y',NULL,'list','');
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
INSERT INTO `pages` VALUES (1,'nl','Website','welcome','Y','','','2010-01-01 00:00:00','2013-07-11 17:35:06'),
(2,'nl','Login','login','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(3,'nl','Pages','','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(4,'nl','Vertalingen','strings','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(9,'nl','Dashboard','dashboard','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(10,'nl','Website CMS','cms','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(11,'nl','Structuur','pages','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(12,'nl','Beelden','images','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(13,'nl','Bestanden','files','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(14,'nl','Formulieren','forms','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(15,'nl','Gebruikers','users','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(16,'nl','Sjablonen','templates','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(17,'nl','Systeem','system','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(20,'nl','Administration','admin','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(21,'nl','Forms','data','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(22,'nl','Commentaar','comments','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(97,'nl','Privacy Verklaring','privacy','Y','','','2010-01-01 00:00:00','2013-03-19 09:30:30'),
(98,'nl','Disclaimer','disclaimer','Y','','','2010-01-01 00:00:00','2012-08-20 17:09:50'),
(99,'nl','Global','global','Y','','','2010-01-01 00:00:00','2012-08-15 22:02:59'),

(1,'en','Website','welcome','Y','','','2010-01-01 00:00:00','2013-07-11 17:35:20'),
(3,'en','Pages','','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(2,'en','Login','login','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(4,'en','Translations','strings','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(9,'en','Dashboard','dashboard','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(10,'en','Website CMS','cms','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(11,'en','Structure','pages','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(12,'en','Images','images','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(13,'en','Files','files','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(14,'en','Forms','forms','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(15,'en','Users','users','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(16,'en','Templates','templates','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(17,'en','System','system','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(20,'en','Administration','admin','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(21,'en','Forms','data','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(22,'en','Comments','comments','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(99,'en','Global','global','Y','','','2010-01-01 00:00:00','2012-08-15 22:02:59'),
(97,'en','Privacy','privacy','Y','','','2010-01-01 00:00:00','2013-03-19 09:30:30'),
(98,'en','Disclaimer','disclaimer','Y','','','2010-01-01 00:00:00','2012-08-20 17:09:50'),

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
  `description` varchar(127) DEFAULT '',
  `controller` varchar(64) DEFAULT '',
  `fn` varchar(128) DEFAULT '',
  `allowedtemplates` varchar(255) DEFAULT '',
  `maxnumber` int(11) DEFAULT '99999',
  `system` char(1) DEFAULT 'N',
  `defaultchild` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=104 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `templates`
--

LOCK TABLES `templates` WRITE;
/*!40000 ALTER TABLE `templates` DISABLE KEYS */;
INSERT INTO `templates` VALUES
(2,'Login','','LoginController','-/login.ejs','',0,'Y',0),
(3,'Directory','','Controller','index.ejs','',0,'Y',0),
(4,'Strings','','Controller','index.ejs','',0,'Y',0),
(9,'Dashboard','','DashboardController','-/cms/dashboard.ejs','',0,'Y',0),
(11,'CMS-Page','','PageController','-/cms/pages.ejs','',0,'Y',0),
(12,'CMS-Images','','ImageController','-/cms/images.ejs','',0,'Y',0),
(13,'CMS-Files','','FileController','-/cms/files.ejs','',0,'Y',0),
(14,'CMS-Forms','','FormController','-/cms/forms.ejs','',0,'Y',0),
(15,'CMS-Users','','UserController','-/cms/users.ejs','',0,'Y',0),
(16,'CMS-Templates','','TemplateController','-/cms/templates.ejs','',0,'Y',0),
(17,'CMS-System','','SystemController','','',0,'Y',0),
(18,'CMS-Styles','','StylesController','-/cms/styles.ejs','',0,'Y',0),
(21,'Admin-Forms','Incoming data from forms','FormDataController','-/cms/forms-list.ejs','',0,'Y',0),
(22,'Admin-Comments','View approve, edit or trash comments','CommentController','-/cms/comments.ejs','',0,'Y',0),
(100,'Home','Homepage if any','Controller','index.ejs','',999,'N',100),
(101,'Content','Displays content of a page','Controller','page.ejs','',0,'N',0),
(102,'Content no intro','Displays content of a page without its intro','Controller','content.ejs','',0,'N',0),
(103,'With sub intros','Displays also all intro content of the pages below','Controller','intros.ejs','',0,'N',0);
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
  `password` char(64) DEFAULT NULL,
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
INSERT INTO `users` VALUES
(1,'rsuper','Cody Super','*517B0C619679E3DE44D94CC7AD0A39918C3CD6FB','rWorks',99,0,99,'Y','info@empty.com','','N',0),
(2,'radmin','Cody Admin','*517B0C619679E3DE44D94CC7AD0A39918C3CD6FB','rWorks',50,0,99,'Y','info@empty.com','','N',0),
(3,'rtest','Cody Test','*517B0C619679E3DE44D94CC7AD0A39918C3CD6FB','rWorks',2,0,99,'Y','info@empty.com','','N',0),
(9,'codyweb','Cody User','*517B0C619679E3DE44D94CC7AD0A39918C3CD6FB','user',50,0,99,'Y','info@empty.com','','N',0);
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

