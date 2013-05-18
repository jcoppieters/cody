
/*!40101 SET NAMES utf8 */;
/*!40101 SET character_set_client = utf8 */;


DROP TABLE IF EXISTS `atoms`;
CREATE TABLE `atoms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent` int(11) NOT NULL DEFAULT '0',
  `sortorder` int(11) DEFAULT '0',
  `name` varchar(64) NOT NULL DEFAULT '',
  `note` varchar(255) DEFAULT NULL,
  `extention` varchar(3) DEFAULT '',
  `created` datetime DEFAULT '0000-00-00',
  `updated` datetime DEFAULT '0000-00-00',
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;


INSERT INTO `atoms` VALUES 
(1,0,10,'Images','','','2012-07-09 14:18:36','2012-07-09 14:18:36'),

(2,0,20,'Files','','','2012-07-09 14:18:36','2012-07-09 14:18:36'),

(3,0,20,'Forms','','','2012-07-09 14:18:36','2012-07-09 14:18:36');

--
-- Table structure for table `contacts`
--



--
-- Table structure for table `domains`
--

DROP TABLE IF EXISTS `domains`;
CREATE TABLE `domains` (
  `id` varchar(32) NOT NULL DEFAULT '',
  `name` varchar(32) DEFAULT '?'
) DEFAULT CHARSET=utf8;

INSERT INTO `domains` VALUES ('admin','Admin'),('cms','CMS Users'),('user','Users');




--
-- Table structure for table `templates`
--

DROP TABLE IF EXISTS `templates`;
CREATE TABLE `templates` (
  `id` int(11) NOT NULL DEFAULT '0',
  `name` varchar(64) DEFAULT '',
  `controller` varchar(64) DEFAULT '',
  `fn` varchar(128) DEFAULT '',
  `allowedtemplates` varchar(255) DEFAULT '',
  `maxnumber` int(11) DEFAULT '99999',
  `system` char(1) DEFAULT 'N',
  `defaultchild` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8;

INSERT INTO `templates` VALUES 
(2,'Login',       'LoginController',         'front/login.ejs','',0,'Y',0),
(9,'Dashboard',   'DashBoardController',     'cms/dashboard.ejs','',0,'Y',0),

(11,'CMS-System',     'SystemController',    '','',0,'Y',0),
(12,'CMS-Users',      'UserController',      'cms/users.ejs','',0,'Y',0),
(13,'CMS-Sitemap',    'SitemapController',   'cms/sitemap.ejs','',0,'Y',0),
(14,'CMS-Images',     'ImageController',     'cms/images.ejs','',0,'Y',0),
(15,'CMS-Files',      'FileController',      'cms/files.ejs','',0,'Y',0),
(16,'CMS-Forms',      'FormController',      'cms/forms.ejs','',0,'Y',0),

(100,'Content',       'ContentController',   'front/index.ejs','',999,'N',100);


--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
CREATE TABLE `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL DEFAULT '',
  `parent` int(11) NOT NULL DEFAULT '0',
  `user` int(11) DEFAULT '0',
  `template` int(11) NOT NULL DEFAULT '1',
  `orderby` char(1) DEFAULT 'A',
  `sortorder` int(11) DEFAULT '0',
  `dated` date DEFAULT '0000-00-00',
  `validfrom` datetime NOT NULL DEFAULT '0000-00-00',
  `validto` datetime NOT NULL DEFAULT '0000-00-00',
  `active` char(1) NOT NULL DEFAULT 'Y',
  `showcontent` char(1) DEFAULT 'Y',
  `needslogin` char(1) DEFAULT 'N',
  `defaultrequest` varchar(32) DEFAULT '',
  `allowedgroups` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `parent_idx` (`parent`,`active`)
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO `items` VALUES 
(1,'Website',  -1, 1,100,'A',100,'2010-01-01','2010-01-01','2100-01-01','Y','S','N','',''),


(3,'Pages',    -1, 1,100,'M',0,'2010-01-01','2010-01-01','2100-01-01','Y','Y','Y','',''),
  (2, 'Login',  3, 1,2,'A',99,'2010-01-01','2010-01-01','2100-01-01','Y','Y','N','',''),
  (99,'Global', 3, 1,100,'A',0,'2010-01-01','2010-01-01','2100-01-01','Y','Y','N','',''),

(4,'Footer',   -1, 1,100,'M',0,'2010-01-01','2010-01-01','2100-01-01','Y','Y','Y','',''),
  (97,'Privacy Verklaring',4, 1,100,'A',0,'2010-01-01','2010-01-01','2100-01-01','Y','Y','N','',''),
  (98,'Disclaimer',        4, 1,100,'A',0,'2010-01-01','2010-01-01','2100-01-01','Y','Y','N','',''),

(9,'Dashboard',-1, 1,9,'M',0,'2010-01-01','2010-01-01','2100-01-01','Y','Y','Y','',''),
  (10,'CMS', 9, 1,2,'M',10,'2010-01-01','2010-01-01','2100-01-01','Y','S','Y','',''),
    (11,'CMS - Sitemap',10, 1,13,'A',10,'2010-01-01','2010-01-01','2100-01-01','Y','Y','Y','',''),
    (12,'CMS - Images', 10, 1,14,'A',20,'2010-01-01','2010-01-01','2100-01-01','Y','Y','Y','',''),
    (13,'CMS - Files',  10, 1,15,'A',30,'2010-01-01','2010-01-01','2100-01-01','Y','Y','Y','',''),
    (14,'CMS - Forms',  10, 1,16,'A',40,'2010-01-01','2010-01-01','2100-01-01','Y','Y','Y','',''),
    (15,'CMS - Users',  10, 1,12,'A',50,'2010-01-01','2010-01-01','2100-01-01','Y','Y','Y','list',''),
    (16,'CMS - System', 10, 1,11,'A',60,'2010-01-01','2010-01-01','2100-01-01','Y','Y','Y','','');


		



-- INSERT INTO `items` VALUES 
--  (101,'First Page',1,1,100,'A',10,'2010-01-01','2010-01-01','2100-01-01','Y','Y','Y','',0,'');


--
-- Table structure for table `languages`
--

DROP TABLE IF EXISTS `languages`;
CREATE TABLE `languages` (
  `id` varchar(4) NOT NULL DEFAULT '',
  `name` varchar(32) DEFAULT '',
  `sortorder` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8;

INSERT INTO `languages` VALUES ('nl','Nederlands',1);



--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
CREATE TABLE `pages` (
  `item` int(11) NOT NULL DEFAULT '0',
  `language` varchar(2) NOT NULL DEFAULT '',
  `title` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `active` char(1) DEFAULT 'Y',
  `keywords` varchar(255) DEFAULT '',
  `description` varchar(255) DEFAULT '',
  `created` datetime DEFAULT '0000-00-00',
  `updated` datetime DEFAULT '0000-00-00',
  PRIMARY KEY (`item`,`language`)
) DEFAULT CHARSET=utf8;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` VALUES 
(1,'nl','Website','','Y','','','2010-01-01','2013-01-23 10:40:29'),
(3,'nl','Pages','','Y','','','2010-01-01','2010-01-01'),
  (2,'nl','Login','login','Y','','','2010-01-01','2010-01-01'),
  (99,'nl','Global','global','Y','','','2010-01-01','2012-08-15 22:02:59'),

(4,'nl','Footer','','Y','','','2010-01-01','2010-01-01'),
  (97,'nl','Privacy Verklaring','privacy','Y','','','2010-01-01','2013-03-19 09:30:30'),
  (98,'nl','Disclaimer','disclaimer','Y','','','2010-01-01','2012-08-20 17:09:50'),

(9,'nl','Dashboard','dashboard','Y','','','2010-01-01','2010-01-01'),
  (10,'nl','Website CMS','cms','Y','','','2010-01-01','2010-01-01'),
	  (11,'nl','Structuur','sitemap','Y','','','2010-01-01','2010-01-01'),
	  (12,'nl','Beelden','images','Y','','','2010-01-01','2010-01-01'),
	  (13,'nl','Bestanden','files','Y','','','2010-01-01','2010-01-01'),
	  (14,'nl','Formulieren','forms','Y','','','2010-01-01','2010-01-01'),
    (15,'nl','Gebruikers','users','Y','','','2010-01-01','2010-01-01'),
    (16,'nl','Systeem','system','Y','','','2010-01-01','2010-01-01');


-- INSERT INTO `pages` VALUES 
--  (101,'nl','Eerste Pagina','welcome','Y','','','2010-01-01','2013-01-23 10:40:29');

--
-- Table structure for table `content`
--

DROP TABLE IF EXISTS `content`;
CREATE TABLE `content` (
  `id` int(11) NOT NULL auto_increment,
  `item` int(11) NOT NULL DEFAULT '0',
  `language` varchar(2) NOT NULL DEFAULT 'nl',
  `sortorder` int(11) DEFAULT '0',
  `intro` char(1) NOT NULL DEFAULT 'N',  /* Yes, No */
  `kind` char(1) NOT NULL DEFAULT 'T',   /* Text, forM, File, Image */
  `atom` int(11) DEFAULT '0',
  `name` varchar(32) NOT NULL DEFAULT '',
  `data` text NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY (`item`,`language`)
) DEFAULT CHARSET=utf8;

INSERT INTO `content` values
(0,97,'nl',10,'N','T',0,'','<p><span>Huisartsenpraktijk De Essen draagt zorg voor uw privacy. Lees deze Privacyverklaring om meer te weten te komen over de manier waarop persoonsgegevens worden ingezameld en verwerkt op deze website. In dit geval handelt Huisartsenpraktijk De Essen daarbij steeds in overeenstemming met de bepalingen van de Belgische privacywet (Wet van 8 december 1992 tot bescherming van de persoonlijke levenssfeer ten opzichte van de verwerking van persoonsgegevens). De persoonlijke gegevens beperken zich enkel tot uw e-mailadres.</span></p>\n<p><span><strong>Verantwoordelijke</strong></span></p>\n<p><span>De verantwoordelijke voor de verwerking is Huisartsenpraktijk De Essen; Lage Bekeweg 1, 8200 Brugge - St. Andries.</span></p>\n<p><span><strong>Kennisname</strong></span></p>\n<p><span>U kan van deze persoonsgegevens kennis nemen door een aanvraag te richten aan Huisartsenpraktijk De Essen</span><span>(brief, fax of e-mail) en ze, indien nodig, doen verbeteren of verwijderen. Indien u niet gecontacteerd wenst te worden in het kader van email marketing, zullen uw gegevens op uw verzoek kosteloos uit de betrokken lijsten worden</span></p>\n<p><span><strong>Cookies</strong></span></p>\n<p><span>Wij gebruiken cookies om uw toekomstig bezoek aan onze site vlotter te laten verlopen. Een cookie is een klein stukje tekst dat op uw harde schijf wordt geplaatst. Cookies worden veel gebruikt om een hoger functionaliteit, en dus betere dienst, aan de bezoekers te kunnen aanbieden. [U kan het gebruik van cookies uitschakelen, al leidt dit er wel toe dat effecten opsommen die ten gevolge van het uitschakelen van cookies worden veroorzaakt.]</span></p>\n<p><span><strong>Veiligheid</strong></span></p>\n<p><span>Huisartsenpraktijk De Essen verbindt zich ertoe om al de gepaste technische en organisatorische maatregelen te treffen om uw persoonsgegevens te beschermen tegen vernietiging, verlies, onbedoelde wijziging, beschadiging of openbaarmaking.</span></p>\n<p><span><strong>Toestemming</strong></span></p>\n<p><span>Door u akkoord te verklaren met deze voorwaarden en condities geeft u ook uw toestemming voor de verwerking van uw persoonsgegevens voor de doeleinden zoals hierboven beschreven.</span></p>'),
(0,98,'nl',10,'N','T',0,'','<p><span>Door gebruik te maken van deze website verklaart u zich akkoord met onderstaande voorwaarden en condities.</span></p>\n<p><span><strong>1. Website</strong></span></p>\n<p>De eigenaar van deze website is&nbsp;<br /> Huisartsenpraktijk De Essen,<br /> Lagebekeweg 1<br /> 8200, Brugge,&nbsp;<br /> Belgi&euml;<br /> Tel: 32(0)50 395066,&nbsp;<br /> E-mail: secretariaat@de-essen.be&nbsp;<br />ON: 0811.314.136</p>\n<p><span>Als u niet akkoord gaat met onderstaande voorwaarden wordt u verzocht de website te verlaten. Huisartsenpraktijk De Essen behoudt zich het recht voor deze voorwaarden periodisch aan te passen waarna de leden op de hoogte zullen worden gebracht van deze wijzigingen. Wanneer u na deze kennisgeving de website blijft gebruiken verklaart u zich akkoord met de doorgevoerde wijzigingen. Huisartsenpraktijk De Essen&nbsp; kan eventueel andere diensten aanbieden aan de gebruikers van deze site. In dat geval zullen de geldende voorwaarden apart worden medegedeeld.</span></p>\n<p><span><strong>2. Toegankelijkheid</strong></span></p>\n<p><span>Huisartsenpraktijk De Essen&nbsp; probeert zo goed als mogelijk de website 24 uur per dag toegankelijk te houden, nochtans kan het gebeuren dat de website ontoegankelijk is voor een korte periode omwille van onderhoudswerken, aanpassingen of technische redenen.</span></p>\n<p><span><strong>3. Verantwoordelijkheid</strong></span></p>\n<p><span>Huisartsenpraktijk De Essen weerlegt elke verantwoordelijkheid met betrekking tot deze website en de aangeboden informatie. Huisartsenpraktijk De Essen&nbsp; verzekert niet dat de informatie op deze website correct, compleet of actueel is. Alle informatie, producten en diensten op deze website kunnen fouten bevatten. De gebruiker wordt verzocht hiermee rekening te houden.</span></p>\n<div><span><br /></span></div>');



--
-- Table structure for table `levels`
--

DROP TABLE IF EXISTS `levels`;
CREATE TABLE `levels` (
  `id` int(11) DEFAULT NULL,
  `name` varchar(32) DEFAULT NULL
) DEFAULT CHARSET=utf8;

INSERT INTO `levels` VALUES (2,'user'),(50,'admin'),(99,'super');

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(128) NOT NULL DEFAULT '-',
  `name` varchar(128) NOT NULL DEFAULT '-',
  `password` varchar(32) NOT NULL DEFAULT '-',
  `domain` varchar(32) NOT NULL DEFAULT '',
  `level` int(11) NOT NULL DEFAULT 0,
  `badlogins` int(11) NOT NULL DEFAULT '0',
  `maxbadlogins` int(11) NOT NULL DEFAULT '999',
  `active` char(1) NOT NULL DEFAULT 'Y',
  `email` varchar(128) NOT NULL DEFAULT '',
  `note` varchar(255) NOT NULL DEFAULT '',
  `nomail` char(1) NOT NULL DEFAULT 'N',
  `nr` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_idx` (`username`,`active`)
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


INSERT INTO `users` VALUES 
(1,'rsuper','rWorks Super','akitest','rWorks',99,0,99,'Y','johan577@mac.com','','N',0),
(2,'radmin','rWorks Admin','akitest','rWorks',50,0,99,'Y','johan577@mac.com','','N',0),
(3,'rtest','rWorks Test','akitest','rWorks',2,0,99,'Y','johan577@mac.com','','N',0),

(11,'user','Mr. User Vaneigens','user','users',50,0,99,'Y','user@cody-cms.be','','N',10);

