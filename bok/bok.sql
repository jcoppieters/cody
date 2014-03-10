-- MySQL dump 10.13  Distrib 5.5.31, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: bok
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
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `appointment` (
  `idappointment` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `description` text,
  `date` datetime NOT NULL,
  `start` time NOT NULL,
  `end` time NOT NULL,
  `location` varchar(45) NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`idappointment`),
  UNIQUE KEY `idappointment_UNIQUE` (`idappointment`),
  KEY `fkuser_appointment_idx` (`userId`),
  CONSTRAINT `fkuser_appointment` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES (56,'Ik ben een titel','waar is de Description?','2013-07-30 00:00:00','08:00:00','12:00:00','Bruges',1),(57,'Iets','Wat kan ik hier over vertellen? niet veel...','2013-08-30 00:00:00','08:00:00','12:00:00','daar',1),(58,'Nog maar eens','Grote wedstrijd','2013-09-12 02:00:00','08:00:00','12:00:00','nergens',1),(59,'Eerste rit 2014','','2014-04-23 00:00:00','19:15:00','23:50:00','',1),(60,'MTB Weekend?','','2013-11-10 00:00:00','08:00:00','20:00:00','',1),(61,'Laatste rit','','2014-09-10 00:00:00','19:15:00','23:00:00','',1);
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointmentcomment`
--

DROP TABLE IF EXISTS `appointmentcomment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `appointmentcomment` (
  `idappointmentComment` int(11) NOT NULL AUTO_INCREMENT,
  `appointmentId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `time` datetime NOT NULL,
  `comment` text NOT NULL,
  PRIMARY KEY (`idappointmentComment`),
  KEY `fk_comment_user_idx` (`userId`),
  KEY `fk_comment_appointment_idx` (`appointmentId`),
  CONSTRAINT `fk_comment_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_comment_appointment` FOREIGN KEY (`appointmentId`) REFERENCES `appointment` (`idappointment`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointmentcomment`
--

LOCK TABLES `appointmentcomment` WRITE;
/*!40000 ALTER TABLE `appointmentcomment` DISABLE KEYS */;
INSERT INTO `appointmentcomment` VALUES (8,56,1,'2013-08-21 15:57:16','ik wil dit testen'),(9,56,1,'2013-08-21 15:57:23','nog eentje'),(10,56,1,'2013-08-22 16:22:12','nog maar eentje, maar deze is veel langer, ik vraag me zelfs af, kan dit er wel bij...'),(11,56,1,'2013-08-22 16:24:38','nog maar eentje, maar deze is veel langer, ik vraag me zelfs af, kan dit er wel bij...'),(12,56,1,'2013-08-22 16:27:21','nog maar eentje, maar deze is veel langer, ik vraag me zelfs af, kan dit er wel bij...');
/*!40000 ALTER TABLE `appointmentcomment` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atoms`
--

LOCK TABLES `atoms` WRITE;
/*!40000 ALTER TABLE `atoms` DISABLE KEYS */;
INSERT INTO `atoms` VALUES (1,0,10,'Images','','','2012-07-09 14:18:36','2012-07-09 14:18:36'),(2,0,20,'Files','','','2012-07-09 14:18:36','2012-07-09 14:18:36'),(3,0,20,'Forms','','','2012-07-09 14:18:36','2012-07-09 14:18:36'),(4,0,10,'Layout','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(11,4,10,'Logo','','---','2010-01-01 00:00:00','2010-01-01 00:00:00'),(12,4,10,'Header','','---','2010-01-01 00:00:00','2010-01-01 00:00:00'),(13,4,10,'Footer','','---','2010-01-01 00:00:00','2010-01-01 00:00:00'),(21,1,10,'Global','','','2012-08-15 18:55:51','2012-08-15 18:55:54'),(31,2,10,'a file','','pdf','2012-08-15 18:55:51','2012-08-15 18:55:54'),(34,1,5,'Events','','xxx','2013-09-13 18:51:02','2013-09-13 18:51:04'),(35,34,5,'2002','','xxx','2013-09-13 18:51:14','2013-09-13 18:51:18'),(36,35,5,'Training US','fietsenUS1','jpg','2013-09-13 18:51:22','2013-09-13 18:51:40'),(37,34,5,'1991','','xxx','2013-09-13 19:01:15','2013-09-13 19:01:19'),(38,37,5,'Peter en Filip','FilipPeter','jpg','2013-09-13 19:01:22','2013-09-13 19:01:31'),(39,21,5,'Groepsfoto1','Screen Shot 2013-09-13 at 19.09.48','JPG','2013-09-13 19:10:03','2013-09-13 19:10:12'),(40,21,5,'Groepsfoto2','Juli 2012','jpg','2013-09-22 18:48:23','2013-09-22 18:49:33'),(41,21,5,'Eten bij Jacques','Juli 2012','jpg','2013-09-22 18:50:15','2013-09-22 18:50:40'),(42,21,5,'Kleine groep','Juni 2013 - Voor de americain met frietjes','jpg','2013-09-22 18:51:06','2013-09-22 18:51:35'),(43,21,5,'Groepsfoto3','Juni 2011','JPG','2013-09-22 18:56:49','2013-09-22 18:57:16');
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
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content`
--

LOCK TABLES `content` WRITE;
/*!40000 ALTER TABLE `content` DISABLE KEYS */;
INSERT INTO `content` VALUES (1,97,'nl',10,'N','T',0,'','<p><span>Cody draagt zorg voor uw privacy. Lees deze Privacyverklaring om meer te weten te komen over de manier waarop persoonsgegevens worden ingezameld en verwerkt op deze website. In dit geval handelt Cody Howest daarbij steeds in overeenstemming met de bepalingen van de Belgische privacywet (Wet van 8 december 1992 tot bescherming van de persoonlijke levenssfeer ten opzichte van de verwerking van persoonsgegevens). De persoonlijke gegevens beperken zich enkel tot uw e-mailadres.</span></p>\n<p><span><strong>Verantwoordelijke</strong></span></p>\n<p><span>De verantwoordelijke voor de verwerking is Cody Howest; Rijselstraat 5, 8000 Brugge.</span></p>\n<p><span><strong>Kennisname</strong></span></p>\n<p><span>U kan van deze persoonsgegevens kennis nemen door een aanvraag te richten aan Cody Howest</span><span>(brief, fax of e-mail) en ze, indien nodig, doen verbeteren of verwijderen. Indien u niet gecontacteerd wenst te worden in het kader van email marketing, zullen uw gegevens op uw verzoek kosteloos uit de betrokken lijsten worden</span></p>\n<p><span><strong>Cookies</strong></span></p>\n<p><span>Wij gebruiken cookies om uw toekomstig bezoek aan onze site vlotter te laten verlopen. Een cookie is een klein stukje tekst dat op uw harde schijf wordt geplaatst. Cookies worden veel gebruikt om een hoger functionaliteit, en dus betere dienst, aan de bezoekers te kunnen aanbieden. [U kan het gebruik van cookies uitschakelen, al leidt dit er wel toe dat effecten opsommen die ten gevolge van het uitschakelen van cookies worden veroorzaakt.]</span></p>\n<p><span><strong>Veiligheid</strong></span></p>\n<p><span>Cody Howest verbindt zich ertoe om al de gepaste technische en organisatorische maatregelen te treffen om uw persoonsgegevens te beschermen tegen vernietiging, verlies, onbedoelde wijziging, beschadiging of openbaarmaking.</span></p>\n<p><span><strong>Toestemming</strong></span></p>\n<p><span>Door u akkoord te verklaren met deze voorwaarden en condities geeft u ook uw toestemming voor de verwerking van uw persoonsgegevens voor de doeleinden zoals hierboven beschreven.</span></p>'),(2,98,'nl',10,'N','T',0,'','<p><span>Door gebruik te maken van deze website verklaart u zich akkoord met onderstaande voorwaarden en condities.</span></p>\n<p><span><strong>1. Website</strong></span></p>\n<p>De eigenaar van deze website is&nbsp;<br /> Cody Howest,<br /> Rijselstraat 5<br /> 8000, Brugge,&nbsp;<br /> Belgi&euml;<br /> Tel: 32(0)50 xx,&nbsp;<br /> E-mail: info@howest.be&nbsp;<br />ON: xx</p>\n<p><span>Als u niet akkoord gaat met onderstaande voorwaarden wordt u verzocht de website te verlaten. Cody behoudt zich het recht voor deze voorwaarden periodisch aan te passen waarna de leden op de hoogte zullen worden gebracht van deze wijzigingen. Wanneer u na deze kennisgeving de website blijft gebruiken verklaart u zich akkoord met de doorgevoerde wijzigingen. Cody Howest&nbsp; kan eventueel andere diensten aanbieden aan de gebruikers van deze site. In dat geval zullen de geldende voorwaarden apart worden medegedeeld.</span></p>\n<p><span><strong>2. Toegankelijkheid</strong></span></p>\n<p><span>Cody Howest&nbsp; probeert zo goed als mogelijk de website 24 uur per dag toegankelijk te houden, nochtans kan het gebeuren dat de website ontoegankelijk is voor een korte periode omwille van onderhoudswerken, aanpassingen of technische redenen.</span></p>\n<p><span><strong>3. Verantwoordelijkheid</strong></span></p>\n<p><span>Cody Howest weerlegt elke verantwoordelijkheid met betrekking tot deze website en de aangeboden informatie. Cody Howest&nbsp; verzekert niet dat de informatie op deze website correct, compleet of actueel is. Alle informatie, producten en diensten op deze website kunnen fouten bevatten. De gebruiker wordt verzocht hiermee rekening te houden.</span></p>\n<div><span><br /></span></div>'),(3,97,'en',10,'N','T',0,'','<p><span>Cody draagt zorg voor uw privacy. Lees deze Privacyverklaring om meer te weten te komen over de manier waarop persoonsgegevens worden ingezameld en verwerkt op deze website. In dit geval handelt Cody Howest daarbij steeds in overeenstemming met de bepalingen van de Belgische privacywet (Wet van 8 december 1992 tot bescherming van de persoonlijke levenssfeer ten opzichte van de verwerking van persoonsgegevens). De persoonlijke gegevens beperken zich enkel tot uw e-mailadres.</span></p>\n<p><span><strong>Verantwoordelijke</strong></span></p>\n<p><span>De verantwoordelijke voor de verwerking is Cody Howest; Rijselstraat 5, 8000 Brugge.</span></p>\n<p><span><strong>Kennisname</strong></span></p>\n<p><span>U kan van deze persoonsgegevens kennis nemen door een aanvraag te richten aan Cody Howest</span><span>(brief, fax of e-mail) en ze, indien nodig, doen verbeteren of verwijderen. Indien u niet gecontacteerd wenst te worden in het kader van email marketing, zullen uw gegevens op uw verzoek kosteloos uit de betrokken lijsten worden</span></p>\n<p><span><strong>Cookies</strong></span></p>\n<p><span>Wij gebruiken cookies om uw toekomstig bezoek aan onze site vlotter te laten verlopen. Een cookie is een klein stukje tekst dat op uw harde schijf wordt geplaatst. Cookies worden veel gebruikt om een hoger functionaliteit, en dus betere dienst, aan de bezoekers te kunnen aanbieden. [U kan het gebruik van cookies uitschakelen, al leidt dit er wel toe dat effecten opsommen die ten gevolge van het uitschakelen van cookies worden veroorzaakt.]</span></p>\n<p><span><strong>Veiligheid</strong></span></p>\n<p><span>Cody Howest verbindt zich ertoe om al de gepaste technische en organisatorische maatregelen te treffen om uw persoonsgegevens te beschermen tegen vernietiging, verlies, onbedoelde wijziging, beschadiging of openbaarmaking.</span></p>\n<p><span><strong>Toestemming</strong></span></p>\n<p><span>Door u akkoord te verklaren met deze voorwaarden en condities geeft u ook uw toestemming voor de verwerking van uw persoonsgegevens voor de doeleinden zoals hierboven beschreven.</span></p>'),(4,98,'en',10,'N','T',0,'','<p><span>Door gebruik te maken van deze website verklaart u zich akkoord met onderstaande voorwaarden en condities.</span></p>\n<p><span><strong>1. Website</strong></span></p>\n<p>De eigenaar van deze website is&nbsp;<br /> Cody Howest,<br /> Rijselstraat 5<br /> 8000, Brugge,&nbsp;<br /> Belgi&euml;<br /> Tel: 32(0)50 xx,&nbsp;<br /> E-mail: info@howest.be&nbsp;<br />ON: xx</p>\n<p><span>Als u niet akkoord gaat met onderstaande voorwaarden wordt u verzocht de website te verlaten. Cody behoudt zich het recht voor deze voorwaarden periodisch aan te passen waarna de leden op de hoogte zullen worden gebracht van deze wijzigingen. Wanneer u na deze kennisgeving de website blijft gebruiken verklaart u zich akkoord met de doorgevoerde wijzigingen. Cody Howest&nbsp; kan eventueel andere diensten aanbieden aan de gebruikers van deze site. In dat geval zullen de geldende voorwaarden apart worden medegedeeld.</span></p>\n<p><span><strong>2. Toegankelijkheid</strong></span></p>\n<p><span>Cody Howest&nbsp; probeert zo goed als mogelijk de website 24 uur per dag toegankelijk te houden, nochtans kan het gebeuren dat de website ontoegankelijk is voor een korte periode omwille van onderhoudswerken, aanpassingen of technische redenen.</span></p>\n<p><span><strong>3. Verantwoordelijkheid</strong></span></p>\n<p><span>Cody Howest weerlegt elke verantwoordelijkheid met betrekking tot deze website en de aangeboden informatie. Cody Howest&nbsp; verzekert niet dat de informatie op deze website correct, compleet of actueel is. Alle informatie, producten en diensten op deze website kunnen fouten bevatten. De gebruiker wordt verzocht hiermee rekening te houden.</span></p>\n<div><span><br /></span></div>'),(5,101,'nl',10,'Y','T',0,'Content1','<p style=\"text-align: center;\">Dit is de vaste stek van BOK - De wielervereniging Bidden om Kracht.</p>\r\n<p style=\"text-align: center;\">Om verder te gaan moet je lid zijn - Gebruikersnaam bij de secretaris te verkrijgen.</p>\r\n<p style=\"text-align: center;\"><img title=\"- Groepsfoto1\" src=\"../data/images/39.JPG\" alt=\"- Groepsfoto1\" width=\"699\" height=\"510\" /></p>'),(6,101,'en',10,'N','T',0,'','<p>....</p>'),(7,1,'nl',10,'Y','S',0,'phone','050-705336'),(8,1,'en',10,'Y','S',0,'phone','050-705336'),(9,1,'nl',20,'Y','S',0,'address','myStreet 007 - 54321 Bond City'),(10,1,'en',20,'Y','S',0,'address','myStreet 007 - 54321 Bond City'),(11,151,'nl',10,'Y','T',0,'Text','<h2>1991</h2>\r\n<p>Filip Surmont<br />Peter Janssens<br />Johan Coppieters</p>\r\n<h2>1992</h2>\r\n<p>Dominiek Lecoutere</p>\r\n<h2>1993</h2>\r\n<p>Peter Ballière<br />Johan De Rycke<br />Marc Cabooter<br />Gelbert Deleyn<br />Jacques Dombret<br />Lionel Fevery<br />Mark Vanfleteren</p>\r\n<h2>1994</h2>\r\n<p>Paul-Philippe Schumacher</p>\r\n<h2>1996</h2>\r\n<p>Jan Van Dooren<br />Geert Decadt</p>\r\n<h2>1998</h2>\r\n<p>Herman Carrette</p>\r\n<h2>2004</h2>\r\n<p>Hans Vandeweghe</p>'),(23,1,'nl',30,'N','S',0,'footer.first',''),(24,1,'nl',50,'N','S',0,'footer.second','© Dieter Beelaert - made with'),(25,1,'nl',40,'N','S',0,'footer.third','<a href=\"http://www.cody-cms.org\"><img src=\"../static/images/footer.png\"></a>'),(26,1,'en',30,'N','S',0,'footer.first',''),(27,1,'en',50,'N','S',0,'footer.second','© Dieter Beelaert - made with'),(28,1,'en',40,'N','S',0,'footer.third','<a href=\"http://www.cody-cms.org\"><img src=\"<%=static%>/images/footer.png\"></a>'),(29,-100,'*',10,'N','C',0,'Upcoming',''),(32,101,'nl',20,'N','C',0,'Nr Upcoming','10'),(33,-106,'*',10,'N','C',0,'Upcoming',''),(36,1,'nl',60,'N','S',0,'Google Analytics code','UA-9438915-5'),(37,1,'en',60,'N','S',0,'Google Analytics code','UA-9438915-5'),(38,158,'en',10,'N','C',0,'Upcoming',''),(40,158,'nl',10,'N','T',0,'Text','<h2>De Vereniging.</h2>\r\n<ul>\r\n<li>De Vereniging werd opgericht in 1991 en is een feitelijke vereniging.</li>\r\n<li>Ontbinding van de vereniging kan pas na samenroeping van alle leden. Pas indien geen leden meer de vereniging willen voortzetten, zal deze als ontbonden beschouwd worden.</li>\r\n<li>Deze statuten werden voorgelegd op de eerste statutaire vergadering van woensdag 27 september 2003 en zijn retroactief tot 1 mei 1991 goedgekeurd en in voege gebracht.</li>\r\n</ul>\r\n<hr align=\"left\" width=\"30%\" />\r\n<ul>\r\n<li>De vereniging heeft als doel de fysische en psychologische gezondheid van zijn leden te verbeteren. Alle middelen en activiteiten zijn, na beraad in de groep, hiervoor toegestaan, gesteld dat hiermee het doel beter bereikt wordt.</li>\r\n<li>De naam van de vereniging is voluit \"Bidden om Kracht\", wat dan weer de verkorte vorm van het motto: \"Niet klagen maar dragen en bidden om kracht\" is. Voor officiele publicaties is het toegelaten deze naam nog in te korten tot \"BOK\", maar moet steeds ook \"Bidden om Kracht\" te lezen zijn.</li>\r\n</ul>\r\n<h2>De Leden, Het Bestuur.</h2>\r\n<ul>\r\n<li>Leden zijn per definitie voor het leven.<br />Langdurig verblijf in het buitenland (ook al noemt dit \"Gent\") brengt het lidmaatschap op geen enkele manier in gevaar.</li>\r\n<li>Een volledige opsomming van de leden samen met hun chronologisch toetreden is te vinden op de website onder \"Ledenlijst\".</li>\r\n<li>Leden kunnen uiteraard uit eigen beweging ontslag nemen. Vooraleer er ontslag aanvaard zal worden, zal de penningmeester eerst verslag uitbrengen over eventuele financiele schulden. Deze dienen eerst vereffend te worden, pas dan is het ontslag geldig. In geen geval kan er aanspraak gemaakt worden op een deel van de clubkas.</li>\r\n</ul>\r\n<hr align=\"left\" width=\"30%\" />\r\n<ul>\r\n<li>Het bestuur is per definitie voor het leven.</li>\r\n<li>Voorzitter (voor het leven) is Filip Surmont. Bij afwezigheid wordt hij vervangen door ondervoorzitter Peter Janssens, die dan optreedt als waarnemend voorzitter bijgestaan door zijn secretaris.</li>\r\n<li>Penningmeester en secretaris is Johan Coppieters.</li>\r\n<li>Materiaalmeester is Jacques Dombret.</li>\r\n<li>Samen vormen zij het bestuur.</li>\r\n<li>De vereniging beschikt ook over een ouderdomsdeken, Lionel Fevery, zijn vaste taak is niet gekend.</li>\r\n</ul>\r\n<h2>De vergaderingen.</h2>\r\n<ul>\r\n<li>Iedere woensdagavond vanaf de eerste woensdag van mei, tot de laatste woensdag van september is er vergadering. Elke vergadering heeft een organisator, die op de agenda van de website zal vermeld worden. De organisator kiest de plaats van de vergadering.</li>\r\n<li>De eerste en laatste vergadering van het jaar zijn statutaire vergaderingen waarop -naast andere officiele zaken tevens- aanvragen tot aanpassing van de statuten kunnen worden voorgelegd.</li>\r\n<li>Elk lid is per definitie aanwezig voor het tweede gedeelte van de vergadering. Indien een lid weerhouden is -en een geldig excuus heeft- moet hij dit ten laatste op de dinsdag voor de vergadering melden aan de organisator. Uiteraard is er een zware boete voorzien voor het niet volgen van deze richtlijn.</li>\r\n<li>Ter herinnering voor organisators: In principe zijn er vanaf 2000 steeds 15 en vanaf 2004 steeds 16 leden op de vergadering aanwezig. Leden die in het buitenland verblijven, kunnen per uitzondering zich in het begin van het seizoen excuseren tot een bepaalde datum. Er wordt aan deze leden gevraagd -in tegenstelling tot de andere leden- om toch de organisator te verwittigen van zijn aanwezigheid.</li>\r\n<li>Elke vergadering begint stipt om 20u00, ook voor apothekers, tenzij door de organisator anders medegedeeld minstens 1 week op voorhand. <br />Er zal niet gewacht worden om de vergadering te starten en aan de te laatkomers zal prompt een boete worden toegekend.</li>\r\n<li>Een vergadering begint met een fysische inspanning -ook wel \"rit\" genoemd-, gevolgd door een culinair intermezzo, tijdens en na dit intermezzo volgt dan een psychische activiteit en mentale bijscholing.</li>\r\n<li>Het culinair gedeelte bestaat uit een pastagerecht, gevolgd door vanille ijs met chocolade. afwijkingen op deze regel kunnen aangevraagd worden. <br />Uitzonderingen bestaan in éénmalige toelatingen of uit licenties voor het leven. Elke licentie voor het leven, wordt in het reglement bijgeplaatst.</li>\r\n<li>Per definitie zorgt de gastheer zelf voor deze maaltijd. Indien nodig zal hij hiervoor verlof nemen. Externe hulp -zeker de avond zelf- is uit den boze en zal uiteraard streng bestraft worden met een gepaste boete. Deze regel geldt ook voor radiologen.</li>\r\n<li>Over de onderwerpen van de bijscholing bestaan er geen regels, behalve dan deze regel zelf en uiteraard het feit dat het denken niet mag onderworpen zijn een enige vorm van dogma... (citaat uit \"dogma\" van Pointcaré)</li>\r\n<li>De \"rit\" wordt volledig door de organisator vastgelegd en gedefinieerd. Het niet volgen van de organisator tijdens de rit zal bestraft worden met een -aan het humeur van de voorzitter aangepaste- boete.</li>\r\n</ul>\r\n<hr align=\"left\" width=\"30%\" />\r\n<ul>\r\n<li>Licenties voor het leven:<br />- Dominiek: Loempia\'s en mosselen, alsook Tiramisu<br />- Peter B: Tiramisu<br />- Mark VF: Witlook met hesp in kaassaus</li>\r\n</ul>\r\n<hr align=\"left\" width=\"30%\" />\r\n<ul>\r\n<li>Teneinde een mooie assiduïteit te waarborgen<br />- Moet elk lid tenminste 1 rit organiseren.<br />- Zal elk lid minstens 5 keer meerijden.<br />- Kan elk lid voor het begin van het seizoen een schriftelijke en open aanvraag doen om gedurende 1 jaar van één of beiden bovenstaande regels ontslagen te worden. Dergelijke aanvraag zal in dit schrijven ten gronde gemotiveerd moeten worden. De volledige groep beslist over de ontvankelijkheid van de aanvraag. Bij verdeeldheid zal het bestuur de knoop doorhakken. Elke aanvraag, alsook het bijhorende antwoord, zal op de website onder \"Geschiedenis\" van het desbetreffende jaar publiek en officieel gemaakt worden.<br />- Bij het niet voldoen aan bovenstaande regels brengt men zijn lidmaatschap in gevaar en zulks handelen wordt gelijk gesteld met het aanvragen tot ontslag.</li>\r\n</ul>\r\n<h2>De Kledij.</h2>\r\n<ul>\r\n<li>Bij elke rit wordt er van de leden geeist dat zij zich in het clubuniform kleden. Bij het hieraan niet voldoen zal een boete toegekend worden, de voorzitter is verplicht van dit op te merken.</li>\r\n<li>Voor het vervolg van de vergadering is er geen verplichte kledij.</li>\r\n<li>Het is ten strengste verboden om clubkledij te laten dragen door niet-leden.</li>\r\n<li>Het wordt sterk aangemoedigd om de clubkledij te dragen bij (zelfs indien dit puur hypothetisch is) trainingen in niet clubverband.</li>\r\n</ul>\r\n<h2>De boetes.</h2>\r\n<ul>\r\n<li>Boetes worden toegekend door de voorzitter. Voorstellen tot boete mogen steeds voorgelegd worden aan de voorzitter.</li>\r\n<li>Boetes zijn rechtsgeldig van zodra zij in het verslag op de website onder \"Agenda\" vermeld worden.</li>\r\n<li>Wanneer boetes financieel van aard zijn, moeten deze gestort worden voor de laatste woensdag van september op de rekening van de vereniging.</li>\r\n<li>Niet exhaustieve voorbeelden:<br />- Te laat komen op de vergadering - Het niet volgen van de organisator - Verkeerde kledij op de rit - Afwijking van opgelegde culinaire voorschriften - Ongeoorloofd gedrag tijdens de rit - Niet gemelde af- en aanwezigheid op een vergadering</li>\r\n<li>Op een speciale bijeenkomst te Utah in 2005 werd, dictatoriaal door de voorzitter en met instemming van de aanwezige leden, vastgelegd dat: Het ten zeerste verboden is om met de partner van een ander lid een relatie aan te knopen zonder deze zijn toestemming. Het negeren van deze regel leidt tot onvermijdelijke uitsluiting uit de vereniging.</li>\r\n</ul>\r\n<h2>Nieuwe leden/Gasten.</h2>\r\n<ul>\r\n<li>Bij de aanvang van ieder nieuw seizoen (ttz na de eerste rit) stemmen we over de vraag of er iemand bijkan / of er plaats is in de groep.</li>\r\n<li>Is de meerderheid voor, dan gelden de afgesproken regels: ieder mag een gastrenner uitnodigen op zijn eigen rit (Zie lager)</li>\r\n<li>Is de meerderheid tegen uitbreiding, dan worden ook geen gastrenners toegelaten gedurende het betreffende seizoen.</li>\r\n<li>Ieder lid kan zijn gastrenner na de laatste rit (eind september) en de hesperolletjes voorstellen als kandidaat nieuw lid.</li>\r\n<li>Elk oud lid moet zich bij elk nieuw lid confortabel voelen, om dit te waarborgen bestaat er een individueel en ongemotiveerd vetorecht. Namen zullen niet bekend gemaakt worden, zodanig dat de ongemotiveerdheid gewaarborgd blijft.</li>\r\n<li>Indien geen enkel veto de voorzitter bereikt, na uitdrukkelijke rondvraag voor de aanvang van het nieuwe seizoen en ten laatste voor 1ste woensdag van mei, kan het nieuwe lid bij de start van de volgende jaargang de groep vervoegen.</li>\r\n</ul>\r\n<h2>Gasten.</h2>\r\n<ul>\r\n<li>Ieder lid heeft het recht om op zijn eigen rit één gastvedette uit te nodigen. Inzover er een meerderheid bereikt werd wat betreft plaats in de groep (bovenstaande paragraaf) Men neemt geen gastrenners mee op verplaatsing, dit wordt voor sommigen culinair te belastend.</li>\r\n<li>Bovenstaande regel maakt geen onderscheid van geslacht. Het is het uitnodigend lid toch ten zeerste aangeraden om bij twijfel eerst bij het bestuur advies in te winnen.</li>\r\n<li>Gastrenners kunnen, na overleg met de voorzitter, ook deelnemen aan de overgangsritten die niet plaatsvinden bij één van de leden thuis (men denke aan de strandrit van augustus \'03, de Paramountrit, de verkennende rit 1ste woensdag van september, ...).</li>\r\n<li>Echter: blijft dit best een uitzondering. De aanwezigheid van een niet ingewijde in het peleton is niet zonder gevaar indien hij niet gewoon is in groep te rijden (wat reeds bleek). De ambiance nadien kan in aanwezigheid van telkens een andere gastrrijder toch ook wat geremd worden.</li>\r\n<li>De uitnodiging van een gastrijder wordt tov de persoon in kwestie inderdaad best voorgesteld als een éénmalig event en zeker niet als een selectie voor een lidmaatschap. Gesprekken over uitbreiding van de groep worden best gemeden in aanwezigheid van een gastrijder.</li>\r\n</ul>'),(41,159,'en',10,'N','C',0,'Upcoming',''),(43,159,'nl',10,'N','T',0,'Text','<h2>Werking</h2>\r\n<p><strong>Voorzitter</strong>: Grote leider, Filip Surmont</p>\r\n<p><strong>Oprichtend Triumviraat</strong>: Filip, Peter Janssens, Johan Coppieters</p>\r\n<p><strong>Waarnemend voorzitter</strong>: Mark Vanfleteren</p>\r\n<p><strong>Penningmeester, Secretaris & Webmaster</strong>: Johan Coppieters</p>\r\n<p><strong>Materiaalmeester</strong>: Jacques Dombret</p>\r\n<p>Beursanalyses: Lionel Fevery & Mark Vanfleteren</p>\r\n<p><strong>Bank</strong>: 844-0000844-95, IBAN: BE76 8440 0008 4495, BIC: RABOBE22XXX</p>'),(44,160,'en',10,'N','C',0,'Upcoming',''),(46,160,'nl',10,'N','T',0,'Text','<p>Toch wel een aantal gebeurtenissen dit jaar !</p>\r\n<ul>\r\n<li>Het jaar waarin onze&nbsp;<strong>Marokaanse</strong>&nbsp;afvaardiging besloot&nbsp;<br />om ook in&nbsp;<strong>China/Changhai</strong>&nbsp;een nederzetting te vestigen<br />en dit allemaal onder de noemer&nbsp;<strong>Jan Van Dooren&nbsp;</strong><br /><br /></li>\r\n<li>En alsof dat niet genoeg was,&nbsp;<br />besliste onze voorzitter voor 2.5 jaar zijn echtgenote te volgen naar NY,&nbsp;<br />allen daarheen om de man bij te staan zou ik zeggen.<br /><br /></li>\r\n<li>Neen, we blijven niet stuurloos, de 3 stichtende leden zorgen voor een oplossing:&nbsp;<br />\r\n<ul>\r\n<li><strong>Peter Janssens</strong>&nbsp;wordt als ondervoorzitter, waarnemend voorzitter.</li>\r\n<li><strong>Filip Surmont</strong>&nbsp;blijft voorzitter, maar voegt zijn functie enkel uit als raadgever.</li>\r\n<li><strong>Johan Coppieters</strong>&nbsp;staat als penningmeester en secretaris Peter in raad en daad bij.</li>\r\n</ul>\r\n<br />Of zoals onze kersverse voorzitter het uitdrukt in een mailtje:<br />\r\n<ul>\r\n<li>Een triumviraat der oprichters klinkt goed.</li>\r\n<li>Vooral het idee van een ondervoorzitter die waarnemend voorzitter wordt<br />bij afwezigheid van de enige echte Leider vind ik perfekt.&nbsp;<br />Zo blijft Filip toch uiteindelijk de echte baas, ere wie ere toekomt.&nbsp;</li>\r\n<li>Ik voel mij dan ook wat zekerder als ik op tijd en stond wat uit de wind kan rijden achter jullie schouders.</li>\r\n</ul>\r\n<br />En zo was&nbsp;<strong>het triumviraat</strong>&nbsp;geboren....<br /><br /></li>\r\n<li>Ondertussen liet de voorzitter weten, dat hij zijn weg gevonden heeft in NY en daar naarstig meetraint voor een of andere lokale RvV... We houden ons hart vast !</li>\r\n</ul>\r\n<p><img title=\"-- Training US\" src=\"../data/images/36.jpg\" alt=\"-- Training US\" width=\"500\" height=\"334\" /></p>\r\n<p>&nbsp;</p>'),(47,161,'en',10,'N','C',0,'Upcoming',''),(49,161,'nl',10,'N','T',0,'Text','<ul>\r\n<li>The first signs of \"Bidden om Kracht\" were seen during weekends when <strong>Filip Surmont</strong> and <strong>Peter Janssens</strong> went biking thru the Flemish polders.</li>\r\n<li>After a few weekends Filip invited <strong>Johan Coppieters</strong> to come along \"To bike to Damme and back\". Which afterwards just seemed to be a lie to trick him in a far adventure, as the route went to Ostend and back, following the now so popular \"Oostendse vaart\". On that Sunday afternoon we did almost 30 km and were very excited about the fact we could conquer such an incredible distance....</li>\r\n<li>Until then we estimated the distance we traveled by looking at road signs and carefuly measuring the distance on maps when we returned home. We calculated our speed by looking at our watches.</li>\r\n<li>We almost never drove one behind the other, as most of the trip was spend to talking. Filip who definetely had looked at some magazines, watched television and did some reading, suggested to try the real thing and drive one behind another. With this technique our average (calculated) speed went up.</li>\r\n</ul>\r\n<p><img style=\"display: block; margin-left: auto; margin-right: auto;\" title=\"-- Peter en Filip\" src=\"../data/images/38.jpg\" alt=\"-- Peter en Filip\" width=\"380\" height=\"274\" /></p>');
/*!40000 ALTER TABLE `content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `data`
--

DROP TABLE IF EXISTS `data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data` (
  `id` int(11) NOT NULL DEFAULT '0',
  `atom` int(11) NOT NULL DEFAULT '0',
  `data` text,
  `status` char(1) NOT NULL DEFAULT 'S',
  `created` datetime NOT NULL,
  `modified` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data`
--

LOCK TABLES `data` WRITE;
/*!40000 ALTER TABLE `data` DISABLE KEYS */;
INSERT INTO `data` VALUES (1,32,'{\"Titel\":\"\",\"Naam\":\"ikke\",\"e-mail adres\":\"johan577@mac.com\",\"vraag\":\"Ik heb geen vragen!\"}','S','2013-09-10 19:09:39',NULL);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB AUTO_INCREMENT=163 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (1,'Website',-1,1,100,'M',100,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','S',NULL,'list',''),(2,'Login',3,1,2,'A',99,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),(3,'Pages',-1,1,100,'M',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(4,'Footer',-1,1,100,'M',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(9,'Dashboard',-1,1,9,'M',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(10,'CMS',9,1,2,'M',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','S','Y','',''),(11,'CMS - Page',10,1,11,'A',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(12,'CMS - Images',10,1,12,'A',20,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(13,'CMS - Files',10,1,13,'A',30,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(14,'CMS - Forms',10,1,14,'A',40,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(15,'CMS - Users',10,1,15,'A',50,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','list',''),(16,'CMS - Templates',10,1,16,'A',60,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','list',''),(17,'CMS - System',10,1,17,'A',70,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(20,'Administration',9,1,2,'M',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','S','Y','',''),(21,'Admin - Forms',20,1,18,'A',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(22,'Admin - Comments',20,1,19,'A',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),(97,'Privacy Verklaring',4,1,100,'A',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),(98,'Disclaimer',4,1,100,'A',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),(99,'Global',3,1,100,'A',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),(101,'First page',1,1,106,'M',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y',NULL,'list',''),(150,'events',3,1,104,'A',99,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),(151,'New item',1,1,101,'A',50,'2013-07-23','2013-07-23 00:00:00','2101-01-31 00:00:00','Y','Y','list',''),(152,'New item',1,1,106,'A',40,'2013-07-23','2013-07-23 00:00:00','2101-01-31 00:00:00','S','Y','list',''),(153,'New item',1,1,105,'A',20,'2013-07-23','2013-07-23 00:00:00','2101-01-31 00:00:00','Y','Y','list',''),(154,'New item',1,1,101,'A',30,'2013-07-23','2013-07-23 00:00:00','2101-01-31 00:00:00','S','Y','list',''),(158,'Statuten',152,1,101,'A',5,'2013-09-13','2013-09-13 00:00:00','2101-01-31 00:00:00','Y','Y','list',''),(159,'Werking',152,1,101,'A',5,'2013-09-13','2013-09-13 00:00:00','2101-01-31 00:00:00','Y','Y','list',''),(160,'2004',154,1,101,'A',5,'2013-09-13','2013-09-13 00:00:00','2101-01-31 00:00:00','Y','Y','list',''),(161,'1991',154,1,101,'A',5,'2013-09-13','2013-09-13 00:00:00','2101-01-31 00:00:00','Y','Y','list','');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pages`
--

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT INTO `pages` VALUES (1,'en','Website','welcome','Y','','','2010-01-01 00:00:00','2013-08-21 12:14:43'),(1,'nl','Website','welcome','Y','','','2010-01-01 00:00:00','2013-08-21 12:14:34'),(2,'en','Login','login','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(2,'nl','Login','login','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(3,'en','Pages','','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(3,'nl','Pages','','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(4,'en','Footer','','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(4,'nl','Footer','','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(9,'en','Dashboard','dashboard','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(9,'nl','Dashboard','dashboard','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(10,'en','Website CMS','cms','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(10,'nl','Website CMS','cms','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(11,'en','Structure','pages','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(11,'nl','Structuur','pages','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(12,'en','Images','images','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(12,'nl','Beelden','images','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(13,'en','Files','files','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(13,'nl','Bestanden','files','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(14,'en','Forms','forms','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(14,'nl','Formulieren','forms','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(15,'en','Users','users','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(15,'nl','Gebruikers','users','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(16,'en','Templates','templates','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(16,'nl','Sjablonen','templates','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(17,'en','System','system','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(17,'nl','Systeem','system','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(20,'en','Administration','admin','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(20,'nl','Beheer','admin','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(21,'en','Forms','data','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(21,'nl','Formulieren','data','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(22,'en','Comments','comments','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(22,'nl','Commentaar','comments','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),(97,'en','Privacy','privacy','Y','','','2010-01-01 00:00:00','2013-03-19 09:30:30'),(97,'nl','Privacy Verklaring','privacy','Y','','','2010-01-01 00:00:00','2013-03-19 09:30:30'),(98,'en','Disclaimer','disclaimer','Y','','','2010-01-01 00:00:00','2012-08-20 17:09:50'),(98,'nl','Disclaimer','disclaimer','Y','','','2010-01-01 00:00:00','2012-08-20 17:09:50'),(99,'en','Global','global','Y','','','2010-01-01 00:00:00','2012-08-15 22:02:59'),(99,'nl','Global','global','Y','','','2010-01-01 00:00:00','2012-08-15 22:02:59'),(101,'en','First page','first','Y','','','2010-01-01 00:00:00','2012-08-28 09:39:37'),(101,'nl','Home','home','Y','','','2010-01-01 00:00:00','2013-09-13 19:31:33'),(151,'en','New item','','Y','','','2013-07-23 15:03:42','2013-07-23 15:03:42'),(151,'nl','Ledenlijst','leden','Y','','','2013-07-23 15:03:42','2013-09-13 19:36:49'),(152,'en','New item','','Y','','','2013-07-23 15:04:03','2013-07-23 15:04:03'),(152,'nl','Info','','Y','','','2013-07-23 15:04:03','2013-09-13 17:54:51'),(153,'en','New item','','Y','','','2013-07-23 15:04:09','2013-07-23 15:04:09'),(153,'nl','Agenda','agenda','Y','','','2013-07-23 15:04:09','2013-09-13 19:56:12'),(154,'en','New item','','Y','','','2013-07-23 15:04:16','2013-07-23 15:04:16'),(154,'nl','Events','','Y','','','2013-07-23 15:04:17','2013-09-13 19:43:34'),(158,'en','Statuten','','Y','','','2013-09-13 15:58:23','2013-09-13 15:58:28'),(158,'nl','Statuten','statuten','Y','','','2013-09-13 15:58:23','2013-09-13 19:45:29'),(159,'en','Werking','','Y','','','2013-09-13 16:55:51','2013-09-13 16:56:03'),(159,'nl','Werking','','Y','','','2013-09-13 16:55:51','2013-09-13 19:45:37'),(160,'en','2004','','Y','','','2013-09-13 18:32:04','2013-09-13 18:32:16'),(160,'nl','2004','','Y','','','2013-09-13 18:32:04','2013-09-13 19:50:26'),(161,'en','1991','','Y','','','2013-09-13 18:58:40','2013-09-13 18:58:45'),(161,'nl','1991','','Y','','','2013-09-13 18:58:40','2013-09-13 19:43:42');
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
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `templates`
--

LOCK TABLES `templates` WRITE;
/*!40000 ALTER TABLE `templates` DISABLE KEYS */;
INSERT INTO `templates` VALUES (2,'Login','','LoginController','-/login.ejs','',0,'Y',0),(9,'Dashboard','','DashboardController','-/cms/dashboard.ejs','',0,'Y',0),(11,'CMS-Page','','PageController','-/cms/pages.ejs','',0,'Y',0),(12,'CMS-Images','','ImageController','-/cms/images.ejs','',0,'Y',0),(13,'CMS-Files','','FileController','-/cms/files.ejs','',0,'Y',0),(14,'CMS-Forms','','FormController','-/cms/forms.ejs','',0,'Y',0),(15,'CMS-Users','','UserController','-/cms/users.ejs','',0,'Y',0),(16,'CMS-Templates','','TemplateController','-/cms/templates.ejs','',0,'Y',0),(17,'CMS-System','','SystemController','','',0,'Y',0),(18,'Admin-Forms','Incoming data from forms','FormDataController','-/cms/forms-list.ejs','',0,'Y',0),(19,'Admin-Comments','View approve, edit or trash comments','CommentController','-/cms/comments.ejs','',0,'Y',0),(100,'Content without intro','Shows all content of a page excluding the intro\'s','ContentController','index.ejs','',999,'N',100),(101,'Full Content','Shows all content of a page','ContentController','page.ejs','',0,'N',0),(103,'Included sub-page intros','Displays also all intro content of the pages below','ContentController','intros.ejs','',0,'N',0),(105,'Calendar','','CalendarController','calendar-month.ejs','105',10,'N',0),(106,'Content+Upcoming','Displays content + calendar','CalendarController','index.ejs','100',999,'N',100);
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'rsuper','rWorks Super','*7F056D2A1A5A65790F919D1BBA8895699CE62890','rWorks',99,0,99,'Y','johan577@mac.com','','N',0),(2,'radmin','rWorks Admin','*7F056D2A1A5A65790F919D1BBA8895699CE62890','rWorks',50,0,99,'Y','johan577@mac.com','','N',0),(3,'rtest','rWorks Test','*7F056D2A1A5A65790F919D1BBA8895699CE62890','rWorks',2,0,99,'Y','johan577@mac.com','','N',0),(9,'codyweb','Cody User','*7F056D2A1A5A65790F919D1BBA8895699CE62890','user',50,0,99,'Y','cody@cody.com','','N',0),(11,'user','Mr. User Vaneigens','*7F056D2A1A5A65790F919D1BBA8895699CE62890','users',50,0,99,'Y','user@cody-cms.be','','N',10);

insert into users values
(10, 'Surmont', 'Filip Surmont', password("Filip"),'bok',00,0,00,'Y','','','N', 0),
(11, 'Janssens', 'Peter Janssens', password("Peter"),'bok',00,0,00,'Y','','','N', 0),
(12, 'Coppieters', 'Johan Coppieters', password("Johan"),'bok',00,0,00,'Y','','','N', 0),
(13, 'Lecoutere', 'Dominiek Lecoutere', password("Dominiek"),'bok',00,0,00,'Y','','','N', 0),
(14, 'Balliere', 'Peter Balliere', password("Peter"),'bok',00,0,00,'Y','','','N', 0),
(15, 'De Rycke', 'Johan De Rycke', password("Johan"),'bok',00,0,00,'Y','','','N', 0),
(16, 'Cabooter', 'Marc Cabooter', password("Marc"),'bok',00,0,00,'Y','','','N', 0),
(17, 'Deleyn', 'Gilbert Deleyn', password("Gilbert"),'bok',00,0,00,'Y','','','N', 0),
(18, 'Dombret', 'Jacques Dombret', password("Jacques"),'bok',00,0,00,'Y','','','N', 0),
(19, 'Fevery', 'Lionel Fevery', password("Lionel"),'bok',00,0,00,'Y','','','N', 0),
(20, 'Vanfleteren', 'Marc Vanfleteren', password("Marc"),'bok',00,0,00,'Y','','','N', 0),
(21, 'Schumacher', 'Paul Schumacher', password("Paul"),'bok',00,0,00,'Y','','','N', 0),
(22, 'Van Dooren', 'Jan Van Dooren', password("Jan"),'bok',00,0,00,'Y','','','N', 0),
(23, 'Decadt', 'Geert Decadt', password("Geert"),'bok',00,0,00,'Y','','','N', 0),
(24, 'Carrette', 'Herman Carrette', password("Herman"),'bok',00,0,00,'Y','','','N', 0),
(25, 'Vandeweghe', 'Hans Vandeweghe', password("Hans"),'bok',00,0,00,'Y','','','N', 0);

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

-- Dump completed on 2013-09-25 17:13:03
