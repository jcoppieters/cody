-- MySQL dump 10.13  Distrib 5.5.31, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: stoerhuus
-- ------------------------------------------------------
-- Server version	5.5.31-0+wheezy1

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
) ENGINE=MyISAM AUTO_INCREMENT=51 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atoms`
--

LOCK TABLES `atoms` WRITE;
/*!40000 ALTER TABLE `atoms` DISABLE KEYS */;
INSERT INTO `atoms` VALUES (1,0,10,'Images','','','2012-07-09 14:18:36','2012-07-09 14:18:36'),(2,0,20,'Files','','','2012-07-09 14:18:36','2012-07-09 14:18:36'),(3,0,20,'Forms','','','2012-07-09 14:18:36','2012-07-09 14:18:36'),(21,1,10,'Algemeen','','','2012-08-15 18:55:51','2013-09-09 16:01:53'),(43,21,10,'Charter ondertekening','image','jpg','2013-09-09 16:01:56','2013-09-30 20:26:37'),(37,2,20,'Charter','Charter Stoer Huus - 23 mei 2013','pdf','2013-09-08 16:04:49','2013-09-09 16:03:14'),(32,3,5,'Contact Formulier','{\"name\":\"Contact Formulier\",\"labels\":{\"nl\":\"Verstuur\"},\"alert\":\"\"}','','2013-09-07 22:03:12','2013-09-13 01:21:11'),(33,32,10,'Naam','{\"name\":\"Naam\",\"labels\":{\"nl\":\"Naam\"},\"generator\":1,\"options\":{\"required\":true},\"reader\":1}','---','2013-09-07 22:32:45','2013-09-10 19:02:50'),(40,1,5,'Fotoalbums','','xxx','2013-09-09 15:41:08','2013-09-30 19:56:01'),(41,40,5,'Kennismakingsweekend','Screen Shot 2013-09-09 at 15.40.35','jpg','2013-09-09 15:41:18','2013-09-30 20:00:51'),(35,32,30,'vraag','{\"name\":\"vraag\",\"labels\":{\"nl\":\"Uw vraag\"},\"generator\":2,\"options\":{\"required\":true,\"cols\":\"60\",\"rows\":\"6\"},\"reader\":1}','---','2013-09-08 11:24:14','2013-09-10 19:02:55'),(36,32,20,'e-mail adres','{\"name\":\"e-mail adres\",\"labels\":{\"nl\":\"e-mail adres\"},\"generator\":1,\"options\":{\"required\":true,\"email\":true},\"reader\":2}','---','2013-09-08 15:59:32','2013-09-10 19:02:53'),(44,2,10,'Officiele documenten','','xxx','2013-09-09 16:03:05','2013-09-09 16:03:14'),(4,0,10,'Layout','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(11,4,10,'Logo','','---','2010-01-01 00:00:00','2010-01-01 00:00:00'),(12,4,10,'Header','','---','2010-01-01 00:00:00','2010-01-01 00:00:00'),(13,4,10,'Footer','','---','2010-01-01 00:00:00','2010-01-01 00:00:00'),(42,40,5,'Charter','Screen Shot 2013-09-09 at 15.42.56','JPG','2013-09-09 15:43:48','2013-09-09 15:43:59'),(45,44,5,'Statuten','Statuten Stoer Huus - 23 mei 2013','pdf','2013-09-09 16:03:16','2013-09-09 16:03:44'),(49,21,20,'StoreHus','storehus','jpg','2013-09-30 20:23:34','2013-09-30 20:26:37'),(50,21,30,'New item','diversiteit','jpg','2013-09-30 20:26:34','2013-09-30 20:26:53');
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
) ENGINE=MyISAM AUTO_INCREMENT=55 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content`
--

LOCK TABLES `content` WRITE;
/*!40000 ALTER TABLE `content` DISABLE KEYS */;
INSERT INTO `content` VALUES (1,97,'nl',10,'N','T',0,'','<p><span>Cody draagt zorg voor uw privacy. Lees deze Privacyverklaring om meer te weten te komen over de manier waarop persoonsgegevens worden ingezameld en verwerkt op deze website. In dit geval handelt Cody Howest daarbij steeds in overeenstemming met de bepalingen van de Belgische privacywet (Wet van 8 december 1992 tot bescherming van de persoonlijke levenssfeer ten opzichte van de verwerking van persoonsgegevens). De persoonlijke gegevens beperken zich enkel tot uw e-mailadres.</span></p>\n<p><span><strong>Verantwoordelijke</strong></span></p>\n<p><span>De verantwoordelijke voor de verwerking is Cody Howest; Rijselstraat 5, 8000 Brugge.</span></p>\n<p><span><strong>Kennisname</strong></span></p>\n<p><span>U kan van deze persoonsgegevens kennis nemen door een aanvraag te richten aan Cody Howest</span><span>(brief, fax of e-mail) en ze, indien nodig, doen verbeteren of verwijderen. Indien u niet gecontacteerd wenst te worden in het kader van email marketing, zullen uw gegevens op uw verzoek kosteloos uit de betrokken lijsten worden</span></p>\n<p><span><strong>Cookies</strong></span></p>\n<p><span>Wij gebruiken cookies om uw toekomstig bezoek aan onze site vlotter te laten verlopen. Een cookie is een klein stukje tekst dat op uw harde schijf wordt geplaatst. Cookies worden veel gebruikt om een hoger functionaliteit, en dus betere dienst, aan de bezoekers te kunnen aanbieden. [U kan het gebruik van cookies uitschakelen, al leidt dit er wel toe dat effecten opsommen die ten gevolge van het uitschakelen van cookies worden veroorzaakt.]</span></p>\n<p><span><strong>Veiligheid</strong></span></p>\n<p><span>Cody Howest verbindt zich ertoe om al de gepaste technische en organisatorische maatregelen te treffen om uw persoonsgegevens te beschermen tegen vernietiging, verlies, onbedoelde wijziging, beschadiging of openbaarmaking.</span></p>\n<p><span><strong>Toestemming</strong></span></p>\n<p><span>Door u akkoord te verklaren met deze voorwaarden en condities geeft u ook uw toestemming voor de verwerking van uw persoonsgegevens voor de doeleinden zoals hierboven beschreven.</span></p>'),(2,98,'nl',10,'N','T',0,'','<p><span>Door gebruik te maken van deze website verklaart u zich akkoord met onderstaande voorwaarden en condities.</span></p>\n<p><span><strong>1. Website</strong></span></p>\n<p>De eigenaar van deze website is&nbsp;<br /> Cody Howest,<br /> Rijselstraat 5<br /> 8000, Brugge,&nbsp;<br /> Belgi&euml;<br /> Tel: 32(0)50 xx,&nbsp;<br /> E-mail: info@howest.be&nbsp;<br />ON: xx</p>\n<p><span>Als u niet akkoord gaat met onderstaande voorwaarden wordt u verzocht de website te verlaten. Cody behoudt zich het recht voor deze voorwaarden periodisch aan te passen waarna de leden op de hoogte zullen worden gebracht van deze wijzigingen. Wanneer u na deze kennisgeving de website blijft gebruiken verklaart u zich akkoord met de doorgevoerde wijzigingen. Cody Howest&nbsp; kan eventueel andere diensten aanbieden aan de gebruikers van deze site. In dat geval zullen de geldende voorwaarden apart worden medegedeeld.</span></p>\n<p><span><strong>2. Toegankelijkheid</strong></span></p>\n<p><span>Cody Howest&nbsp; probeert zo goed als mogelijk de website 24 uur per dag toegankelijk te houden, nochtans kan het gebeuren dat de website ontoegankelijk is voor een korte periode omwille van onderhoudswerken, aanpassingen of technische redenen.</span></p>\n<p><span><strong>3. Verantwoordelijkheid</strong></span></p>\n<p><span>Cody Howest weerlegt elke verantwoordelijkheid met betrekking tot deze website en de aangeboden informatie. Cody Howest&nbsp; verzekert niet dat de informatie op deze website correct, compleet of actueel is. Alle informatie, producten en diensten op deze website kunnen fouten bevatten. De gebruiker wordt verzocht hiermee rekening te houden.</span></p>\n<div><span><br /></span></div>'),(24,106,'nl',20,'N','T',0,'Text','<h3>Wil je erbij zijn?</h3>\r\n<p>Heb je zin om meer te vernemen? Wil je wel eens meer in detail horen waarover het gaat? <br />Contacteer ons dan via onderstaand formulier of mail ons op info@stoerhuus.be.</p>\r\n<p><strong><em>Indien je een pand of site kent voor een 15 tot 20 wooneenheden vertel het ons dan zeker! </em></strong></p>'),(29,147,'nl',20,'N','I',0,'Image',''),(30,150,'nl',10,'N','T',0,'Text','<p>Het charter van Stoer Huus is het resultaat van ettelijke bijeenkomsten, sneuvelteksten, geanimeerde gesprekken, zoeken naar consensus ...</p>\r\n<p>Het loont meer dan de moeite om te lezen. </p>'),(49,106,'nl',10,'Y','T',0,'Text','<p>Met dank voor uw vraag / opmerking.</p>\r\n<p>We proberen zo spoedig mogelijk te antwoorden.</p>\r\n<p>&nbsp;</p>\r\n<p>Stoerhuus.</p>'),(15,1,'nl',60,'N','S',0,'Google Analytics code','UA-9438915-4'),(20,105,'nl',30,'N','T',0,'Text','<p>De ondertekening van de statuten op 23 mei 2013, ging gepaard met de verkiezing van de Raad van Bestuur.  </p>\r\n<ul>\r\n<ul>\r\n<li>Eric Muylaert - Voorzitter</li>\r\n<li>Niek Knockaert - Penningmeester</li>\r\n<li>Roos Taillieu - Secretaris</li>\r\n</ul>\r\n</ul>\r\n<p>De bestuurders zijn gekozen voor een periode van 2 jaar.</p>'),(22,103,'nl',10,'N','T',0,'Text','<p><em><strong>Wat betekent de naam?</strong></em><img style=\"float: right;\" title=\"- StoreHus\" src=\"../data/images/49.jpg\" alt=\"- StoreHus\" width=\"350\" height=\"240\" /></p>\r\n<p><span style=\"font-size: medium;\">Stoer Huus is een vrije vertaling van \"Store huus\" wat letterlijk \"groot huis\" betekent.</span><br /><span style=\"font-size: medium;\">Het leek ons wel toepasselijk voor onze groep die op zoek is naar een \"groot huis\".</span></p>\r\n<p>  </p>\r\n<p><em><strong>Onze ideeën.</strong></em></p>\r\n<p><span style=\"font-size: medium;\">In een zeer verkorte versie zijn dit de basis-ideeën waar we voor staan: </span></p>\r\n<ul>\r\n<li>Het gebruik van duurzame materialen en respect voor ecologie en natuur zijn  hierbij belangrijke waarden.</li>\r\n</ul>\r\n<ul>\r\n<li><span style=\"font-size: medium;\">Voor wat de bewoners betreft  opteert Stoer Huus  in het bijzonder voor intergenerationele diversiteit.</span></li>\r\n</ul>\r\n<p><span style=\"font-size: medium;\"><img style=\"float: left; margin: 10px;\" title=\"- New item\" src=\"../data/images/50.jpg\" alt=\"- New item\" width=\"190\" height=\"160\" /></span></p>\r\n<p> </p>\r\n<p> </p>\r\n<p> </p>\r\n<p> </p>\r\n<p> </p>\r\n<ul>\r\n<li><span style=\"font-size: medium;\">De bewoners staan samen in voor alle belangrijke beslissing en en nemen ook actief deel aan het beleid en aan de operationele werkzaamheden van de gemeenschappelijke voorzieningen.</span></li>\r\n</ul>\r\n<ul>\r\n<li><span style=\"font-size: medium;\">De bewoners wensen op harmonieuze wijze samen te wonen met elkaar, met de buurt en de samenleving en hechten eveneens veel belang aan hun persoonlijke privacy binnen het project.</span></li>\r\n</ul>\r\n<p> </p>\r\n<p> </p>\r\n<p> </p>'),(7,1,'nl',10,'Y','S',0,'phone','Co-housing project Brugge'),(19,105,'nl',10,'N','T',0,'Text','<p>Voor velen van de groep was dit best een harde dobber.... geen alledaagse terminologie, praten over zaken die je niet echt goed kent. Gelukkig hebben we een paar mensen met ervaring in de groep.</p>\r\n<p>Een controle door een notaris was ook een goede zet; zo zijn we zeker dat alles rechtsgeldig is. Uiteindelijk gaat het over eigendomsrechten en manier van beslissen. Dus alles waar we straks écht mee te maken hebben.</p>\r\n<p> </p>'),(9,1,'nl',20,'Y','S',0,'address',''),(35,148,'nl',10,'Y','T',0,'Text','<p>De oudste en de jongste?...</p>'),(36,148,'nl',30,'N','S',0,'String','<embed type=\"application/x-shockwave-flash\" src=\"https://static.googleusercontent.com/external_content/picasaweb.googleusercontent.com/slideshow.swf\" width=\"288\" height=\"192\" flashvars=\"host=picasaweb.google.com&hl=en_US&feat=flashalbum&RGB=0x000000&feed=https%3A%2F%2Fpicasaweb.google.com%2Fdata%2Ffeed%2Fapi%2Fuser%2F102890025833311035792%2Falbumid%2F5504535003666704193%3Falt%3Drss%26kind%3Dphoto%26hl%3Den_US\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\"></embed>'),(12,1,'nl',30,'N','S',0,'footer.first','<a href=\"mailto:info@stoerhuus.be\">info@stoerhuus.be</a>'),(13,1,'nl',40,'N','S',0,'footer.second','<a href=\"/nl/voorwaarden\">Algemene voorwaarden</a>'),(14,1,'nl',50,'N','S',0,'footer.third',''),(23,106,'nl',30,'N','M',32,'Form',''),(32,151,'nl',10,'N','T',0,'Text','<h3>De grote zoektocht!</h3>\r\n<p>Vanaf de start (6 oktober 2012), tussen alle vergaderingen door, zijn we altijd blijven zoeken naar panden en/of een site om onze project te realiseren.</p>\r\n<p>We staan niet alleen in deze zoektocht, heel wat mensen ondersteunen het gedachtengoed.</p>\r\n<p>Er is de koepelorganisatie Cohousing Brugge - een lokale afdeling van <a href=\"http://www.samenhuizen.be/\" target=\"_blank\">Samenhuizen vzw</a> - die ons ondersteunt en het blijde woord breed  verspreid.</p>\r\n<p>De  (lokale) politiek begint het begrip te kennen en staat zeker niet afkeurig. Maar we staan nog wel ver van een actieve hulp in het zoeken naar een plaatsje... <br />In het Algemeen Beleidsprogramma van de stad Brugge staat: \"238. Via het toekennen van het recht van erfpacht en opstal kunnen de gronden en panden in stadseigendom onder specifieke voorwaarden, conform de prioriteiten van het Brugs woonbeleid, door het OCMW, de sociale huisvestingsmaatschappijen, de sociale verhuurkantoren, projectontwikkelaars of particuliere erfpachters een wooninvulling krijgen. <span><em>Ook andere formules worden onderzocht.</em></span>\" </p>\r\n<div title=\"Page 32\">\r\n<p>Die andere formule... dat zal toch wel co-housing zijn ? </p>\r\n</div>'),(52,149,'nl',30,'N','S',0,'String','<embed type=\"application/x-shockwave-flash\" src=\"https://static.googleusercontent.com/external_content/picasaweb.googleusercontent.com/slideshow.swf\" width=\"288\" height=\"192\" flashvars=\"host=picasaweb.google.com&hl=en_US&feat=flashalbum&RGB=0x000000&feed=https%3A%2F%2Fpicasaweb.google.com%2Fdata%2Ffeed%2Fapi%2Fuser%2F102890025833311035792%2Falbumid%2F5929480423932141185%3Falt%3Drss%26kind%3Dphoto%26hl%3Den_US\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\"></embed>'),(37,148,'nl',20,'Y','I',41,'Image',''),(38,105,'nl',20,'N','F',45,'File',''),(40,149,'nl',20,'Y','I',42,'Image',''),(41,149,'nl',10,'Y','T',0,'Text','<p>Niet meteen de mooiste foto\'s maar wel een leuke avond...</p>'),(42,150,'nl',20,'N','F',37,'File',''),(43,150,'nl',30,'N','I',43,'Image',''),(53,148,'nl',40,'N','B',0,'Block','www.stoerhuus.be/[page]'),(45,147,'nl',10,'N','B',0,'Block','www.stoerhuus.be/[page]'),(46,152,'nl',10,'N','B',0,'Block','www.stoerhuus.be/[page]'),(48,153,'nl',10,'N','T',0,'Text','<p>Deze gebruiksvoorwaarden zijn van toepassing op de website stoerhuus.be. </p>\r\n<h3>Links naar andere websites</h3>\r\n<p>Deze website kan hyperlinks naar websites of webpagina\'s bevatten of daar op een andere manier naar verwijzen. stoerhuus.be is in<strong> geen geval aansprakelijk</strong> voor de <strong>inhoud </strong>en de <strong>kenmerken</strong> ervan. Het plaatsen van links op stoerhuus.be, houdt op geen enkele wijze een impliciete goedkeuring van deze website of webpagina\'s in.</p>\r\n<h3>Jouw gegevens als buurtsitebouwer</h3>\r\n<p>Indien we op onze websites naar jouw persoonlijke gegevens vragen worden deze onder <strong>geen enkele voorwaarde aan derden doorgegeven</strong>, niet gratis en niet tegen betaling. Jouw gegevens worden enkel gebruikt om te antwoorden op jullei vragen. </p>\r\n<h3>Het gebruik van cookies.</h3>\r\n<p>Tijdens een bezoek aan de site kunnen cookies op de harde schijf van uw computer geplaatst worden en dit enkel en alleen om de site beter af te stemmen op de behoeften van de terugkerende bezoeker. Deze mini bestandjes of cookies worden niet gebruikt om het surfgedrag van de bezoeker op andere websites na te gaan. Uw internetbrowser laat u toe dat u het gebruik van cookies verhindert, dat u een waarschuwing ontvangt wanneer een cookie geïnstalleerd wordt of dat u de cookies nadien van uw harde schijf verwijdert. Raadpleeg hiervoor de help-functie van uw internetbrowser.</p>\r\n<p> </p>\r\n<h3>Jouw gegevens als bezoeker</h3>\r\n<p>De gegevens die worden gevraagd bij het <strong>contactformulier</strong>, worden rechtstreeks doorgestuurd naar de beheerder van de stoerhuus.be. Door je naam en e-mailadres in te vullen kan deze <strong>reageren op je bericht</strong>.</p>\r\n<p>Heb je nog vragen hierover? <strong>Contacteer</strong> dan gerust de verantwoordelijke op het volgend emailadres: info@stoerhuus.be</p>'),(51,155,'nl',10,'N','T',0,'Text','<p>Algemene Vergadering op onze normale stek - De hollandse vismijn.</p>\r\n<p>De sfeer zat er goed in, de spanning stijgt... we zijn op het spoor van een goede site.<br />Fingers crossed en ervoor gaan.</p>\r\n<p>Het financiële luik wordt dringender nu de site dichtbij komt. En straks kunnen we op zoek naar extra bewoners. </p>\r\n<p> </p>'),(54,149,'nl',40,'N','B',0,'Block','www.stoerhuus.be/[page]');
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data`
--

LOCK TABLES `data` WRITE;
/*!40000 ALTER TABLE `data` DISABLE KEYS */;
INSERT INTO `data` VALUES (1,32,'{\"Titel\":\"\",\"Naam\":\"ikke\",\"e-mail adres\":\"johan577@mac.com\",\"vraag\":\"Ik heb geen vragen!\"}','S','2013-09-10 19:09:39',NULL),(4,32,'{\"Titel\":\"M\",\"Naam\":\"Jefke\",\"e-mail adres\":\"johan@coppieters.be\",\"vraag\":\"ik heb geen vraag !!\"}','N','2013-09-13 00:54:51','2013-09-13 01:05:12'),(6,32,'{\"Titel\":\"F\",\"Naam\":\"Test\",\"e-mail adres\":\"Ikkel@niks.be\",\"vraag\":\"Wie heeft er wel een vraag misschien ??\"}','N','2013-09-13 01:05:40',NULL);
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
) ENGINE=MyISAM AUTO_INCREMENT=156 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,'Website',-1,1,100,'M',100,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','S',NULL,'list',''),(3,'Pages',-1,1,100,'M',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(2,'Login',3,1,2,'A',99,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),(99,'Global',3,1,100,'A',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),(4,'Footer',-1,1,100,'M',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(97,'Privacy Verklaring',4,1,100,'A',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),(98,'Disclaimer',4,1,100,'A',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),(9,'Dashboard',-1,1,9,'M',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(10,'CMS',9,1,2,'M',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','S','Y','',''),(11,'CMS - Page',10,1,11,'A',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(12,'CMS - Images',10,1,12,'A',20,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(13,'CMS - Files',10,1,13,'A',30,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(14,'CMS - Forms',10,1,14,'A',40,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(15,'CMS - Users',10,1,15,'A',50,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','list',''),(16,'CMS - Templates',10,1,16,'A',60,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','list',''),(17,'CMS - System',10,1,17,'A',70,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(102,'Content',1,1,100,'M',40,'2013-07-11','2013-07-11 00:00:00','2101-01-31 00:00:00','S',NULL,'list',''),(103,'About',1,1,100,'A',20,'2013-07-11','2013-07-11 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),(153,'Algemene Voorwaarden',102,1,100,'M',30,'2013-09-09','2013-09-09 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),(105,'Page 2',102,1,100,'A',20,'2013-07-11','2013-07-11 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),(106,'Contacteer ons',1,1,100,'A',70,'2013-09-07','2013-09-07 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),(146,'Styles',10,1,106,'M',80,'2013-08-31','2013-08-31 16:52:21','2020-10-10 00:00:00','Y','Y','list',''),(147,'Foto-albums',1,1,103,'M',60,'2013-09-08','2013-09-08 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),(148,'Kennismakingsweekend',147,1,100,'M',10,'2013-09-08','2013-09-08 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),(149,'Ondertekenen charter',147,1,100,'M',20,'2013-09-08','2013-09-08 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),(150,'Charter',102,1,100,'A',10,'2013-09-08','2013-09-08 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),(151,'Panden/Site',1,1,100,'M',30,'2013-09-08','2013-09-08 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),(152,'Nieuws',1,1,100,'D',10,'2013-09-08','2013-09-08 00:00:00','2101-01-31 00:00:00','S',NULL,'list',''),(20,'Administration',9,1,2,'M',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','S','Y','',''),(21,'Admin - Forms',20,1,18,'A',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(22,'Admin - Comments',20,1,19,'A',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(154,'11 sept 13',152,1,11,'M',5,'2013-09-11','2013-09-11 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),(155,'28 sept 13',152,1,11,'M',5,'2013-09-28','2013-09-30 00:00:00','2101-01-31 00:00:00','Y',NULL,'list','');
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
INSERT INTO `languages` VALUES ('nl','Nederlands',2);
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
INSERT INTO `pages` VALUES (1,'nl','Website','welcome','Y','','','2010-01-01 00:00:00','2013-09-09 17:03:16'),(3,'nl','Pages','','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(2,'nl','Login','login','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(99,'nl','Global','global','Y','','','2010-01-01 00:00:00','2012-08-15 22:02:59'),(4,'nl','Footer','','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(97,'nl','Privacy Verklaring','privacy','Y','','','2010-01-01 00:00:00','2013-03-19 09:30:30'),(98,'nl','Disclaimer','disclaimer','Y','','','2010-01-01 00:00:00','2012-08-20 17:09:50'),(9,'nl','Dashboard','dashboard','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(10,'nl','Website CMS','cms','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(11,'nl','Structuur','pages','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(12,'nl','Beelden','images','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(13,'nl','Bestanden','files','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(14,'nl','Formulieren','forms','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(15,'nl','Gebruikers','users','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(16,'nl','Sjablonen','templates','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(17,'nl','Systeem','system','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(152,'nl','Nieuws','nieuws','Y','','','2013-09-08 16:41:58','2013-09-30 19:52:12'),(151,'nl','Panden/Site','panden','Y','','','2013-09-08 16:40:07','2013-09-30 20:47:12'),(150,'nl','Charter','','Y','','','2013-09-08 16:31:22','2013-09-09 16:04:31'),(149,'nl','Ondertekenen charter','','Y','','','2013-09-08 16:25:44','2013-09-30 20:48:09'),(148,'nl','Kennismakingsweekend','','Y','','','2013-09-08 16:25:28','2013-09-30 20:48:00'),(147,'nl','Foto-albums','','Y','','','2013-09-08 16:23:37','2013-09-09 16:15:59'),(102,'nl','Officiële documenten','officiele_documenten','Y','','','2013-07-11 16:00:40','2013-09-09 15:15:14'),(103,'nl','Stoer Huus','stoerhuus','Y','','','2013-07-11 16:00:47','2013-09-30 20:47:05'),(153,'nl','Gebruiksvoorwaarden','voorwaarden','Y','','','2013-09-09 15:14:51','2013-09-30 20:18:53'),(146,'nl','Stijlen','stijlen','Y','','','2013-08-31 16:51:15','2013-08-31 16:51:31'),(105,'nl','Statuten','Statuten','Y','','','2013-07-11 16:40:43','2013-09-09 16:03:57'),(146,'en','Styles','styles','Y','','','2013-08-31 16:51:15','2013-08-31 16:51:53'),(106,'nl','Contacteer ons','contact','Y','','','2013-09-07 21:19:10','2013-09-10 19:10:21'),(20,'nl','Beheer','admin','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(21,'nl','Formulieren','data','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(22,'nl','Commentaar','comments','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(20,'en','Administration','admin','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(21,'en','Forms','data','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(22,'en','Comments','comments','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(154,'nl','11 sept 13','11september2013','Y','','','2013-09-30 19:41:31','2013-09-30 20:43:28'),(155,'nl','28 sept 13','28september2013','Y','','','2013-09-30 19:43:20','2013-09-30 19:48:50');
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
) ENGINE=MyISAM AUTO_INCREMENT=107 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `templates`
--

LOCK TABLES `templates` WRITE;
/*!40000 ALTER TABLE `templates` DISABLE KEYS */;
INSERT INTO `templates` VALUES (2,'Login','','LoginController','-/login.ejs','',0,'Y',0),(9,'Dashboard','','DashboardController','-/cms/dashboard.ejs','',0,'Y',0),(11,'CMS-Page','','PageController','-/cms/pages.ejs','',0,'Y',0),(12,'CMS-Images','','ImageController','-/cms/images.ejs','',0,'Y',0),(13,'CMS-Files','','FileController','-/cms/files.ejs','',0,'Y',0),(14,'CMS-Forms','','FormController','-/cms/forms.ejs','',0,'Y',0),(15,'CMS-Users','','UserController','-/cms/users.ejs','',0,'Y',0),(16,'CMS-Templates','','TemplateController','-/cms/templates.ejs','',0,'Y',0),(17,'CMS-System','','SystemController','','',0,'Y',0),(100,'Content','','ContentController','index.ejs','',999,'N',100),(106,'CMS-Styles','','StylesController','-/cms/styles.ejs','',0,'Y',0),(103,'With intros','Displays also all intro content of the pages below','ContentController','intros.ejs','',0,'N',0),(18,'Admin-Forms','Incoming data from forms','FormDataController','-/cms/forms-list.ejs','',0,'Y',0),(19,'Admin-Comments','View approve, edit or trash comments','CommentController','-/cms/comments.ejs','',0,'Y',0);
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
INSERT INTO `users` VALUES (1,'rsuper','rWorks Super','*7F056D2A1A5A65790F919D1BBA8895699CE62890','rWorks',99,0,99,'Y','johan577@mac.com','','N',0),(2,'radmin','rWorks Admin','*7F056D2A1A5A65790F919D1BBA8895699CE62890','rWorks',50,0,99,'Y','johan577@mac.com','','N',0),(3,'rtest','rWorks Test','*7F056D2A1A5A65790F919D1BBA8895699CE62890','rWorks',2,0,99,'Y','johan577@mac.com','','N',0),(11,'user','Mr. User Vaneigens','*D5D9F81F5542DE067FFF5FF7A4CA4BDD322C578F','users',50,0,99,'Y','user@cody-cms.be','','N',10),(9,'rtaillieu@mac.com','Cody User','*3EAFDFA45BFF27E252AF30DDA436DD3A4CDEB94E','user',50,0,99,'Y','rtaillieu@mac.com','','N',0);
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

-- Dump completed on 2013-10-01 22:22:30
