SET sql_mode = 'STRICT_TRANS_TABLES';

DROP TABLE IF EXISTS `atoms`;

CREATE TABLE `atoms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent` int(11) NOT NULL DEFAULT '0',
  `sortorder` int(11) DEFAULT '0',
  `name` varchar(64) NOT NULL DEFAULT '',
  `note` varchar(4096) DEFAULT NULL,
  `extention` varchar(4) DEFAULT '',
  `created` datetime DEFAULT '0000-00-00 00:00:00',
  `updated` datetime DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=200 DEFAULT CHARSET=utf8;

LOCK TABLES `atoms` WRITE;
INSERT INTO `atoms` VALUES 
(1,0,10,'Images','','','2012-01-01 00:00:00','2013-11-02 18:28:10'),
(2,0,20,'Files','','','2012-07-09 14:18:36','2012-07-09 14:18:36'),
(3,0,20,'Forms','','','2012-07-09 14:18:36','2012-07-09 14:18:36'),
(4,0,10,'Layout','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),

(11,4,10,'Logo','ourlogo','png','2010-01-01 00:00:00','2013-11-02 18:15:35'),
(12,4,10,'Header','','---','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(13,4,10,'Footer','','---','2010-01-01 00:00:00','2010-01-01 00:00:00'),

(21,1,10,'General','','','2012-08-15 18:55:51','2014-09-03 10:24:30'),

(32,3,5,'Contact Formulier','{\"name\":\"Contact Formulier\",\"labels\":{\"en\":\"Send\",\"it\":\"Send\"},\"alert\":\"nobody@mysite.com\"}','','2013-09-07 22:03:12','2014-09-03 10:26:15'),
(33,32,10,'name','{\"name\":\"name\",\"labels\":{\"en\":\"Name\",\"it\":\"Name\"},\"generator\":1,\"options\":{\"required\":true},\"reader\":1}','---','2013-09-07 22:32:45','2014-09-03 10:27:20'),
(35,32,30,'question','{\"name\":\"question\",\"labels\":{\"en\":\"Question\",\"it\":\"Question\"},\"generator\":2,\"options\":{\"required\":true,\"cols\":\"60\",\"rows\":\"6\"},\"reader\":1}','---','2013-09-08 11:24:14','2014-09-03 10:27:10'),
(36,32,20,'e-mail address','{\"name\":\"e-mail address\",\"labels\":{\"en\":\"Email Address\",\"it\":\"Email Address\"},\"generator\":1,\"options\":{\"required\":true,\"email\":true},\"reader\":2}','---','2013-09-08 15:59:32','2014-09-03 10:26:57'),
(37,2,20,'A File','My PDF - 23 mei 2013','pdf','2013-09-08 16:04:49','2014-09-03 10:28:39'),

(40,1,5,'Photos','','xxx','2013-09-09 15:41:08','2014-09-03 10:24:24'),
(41,40,5,'Photo1','Screen Shot 2013-09-09 at 15.40.35','jpg','2013-09-09 15:41:18','2014-09-03 10:24:39'),
(42,40,5,'Photo2','Screen Shot 2013-09-09 at 15.42.56','JPG','2013-09-09 15:43:48','2014-09-03 10:24:48'),
(43,21,10,'Image1','image','jpg','2013-09-09 16:01:56','2014-09-03 10:25:04'),
(44,2,10,'Official Documents','','xxx','2013-09-09 16:03:05','2014-09-03 10:25:29'),
(45,44,5,'Founded','Founded on april 1rst 1984','pdf','2013-09-09 16:03:16','2014-09-03 10:29:45'),
(49,21,20,'Image2','ourimage','jpg','2013-09-30 20:23:34','2014-09-03 10:25:08'),
(50,21,30,'Image3','diversity','jpg','2013-09-30 20:26:34','2014-09-03 10:25:12');
UNLOCK TABLES;

DROP TABLE IF EXISTS `content`;
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
) AUTO_INCREMENT=200 DEFAULT CHARSET=utf8;


LOCK TABLES `content` WRITE;
INSERT INTO `content` VALUES 
(1,97,'nl',10,'N','T',0,'','<p><span>Cody draagt zorg voor uw privacy. Lees deze Privacyverklaring om meer te weten te komen over de manier waarop persoonsgegevens worden ingezameld en verwerkt op deze website. In dit geval handelt Cody Howest daarbij steeds in overeenstemming met de bepalingen van de Belgische privacywet (Wet van 8 december 1992 tot bescherming van de persoonlijke levenssfeer ten opzichte van de verwerking van persoonsgegevens). De persoonlijke gegevens beperken zich enkel tot uw e-mailadres.</span></p>\n<p><span><strong>Verantwoordelijke</strong></span></p>\n<p><span>De verantwoordelijke voor de verwerking is Cody Howest; Rijselstraat 5, 8000 Brugge.</span></p>\n<p><span><strong>Kennisname</strong></span></p>\n<p><span>U kan van deze persoonsgegevens kennis nemen door een aanvraag te richten aan Cody Howest</span><span>(brief, fax of e-mail) en ze, indien nodig, doen verbeteren of verwijderen. Indien u niet gecontacteerd wenst te worden in het kader van email marketing, zullen uw gegevens op uw verzoek kosteloos uit de betrokken lijsten worden</span></p>\n<p><span><strong>Cookies</strong></span></p>\n<p><span>Wij gebruiken cookies om uw toekomstig bezoek aan onze site vlotter te laten verlopen. Een cookie is een klein stukje tekst dat op uw harde schijf wordt geplaatst. Cookies worden veel gebruikt om een hoger functionaliteit, en dus betere dienst, aan de bezoekers te kunnen aanbieden. [U kan het gebruik van cookies uitschakelen, al leidt dit er wel toe dat effecten opsommen die ten gevolge van het uitschakelen van cookies worden veroorzaakt.]</span></p>\n<p><span><strong>Veiligheid</strong></span></p>\n<p><span>Cody Howest verbindt zich ertoe om al de gepaste technische en organisatorische maatregelen te treffen om uw persoonsgegevens te beschermen tegen vernietiging, verlies, onbedoelde wijziging, beschadiging of openbaarmaking.</span></p>\n<p><span><strong>Toestemming</strong></span></p>\n<p><span>Door u akkoord te verklaren met deze voorwaarden en condities geeft u ook uw toestemming voor de verwerking van uw persoonsgegevens voor de doeleinden zoals hierboven beschreven.</span></p>'),
(2,98,'nl',10,'N','T',0,'','<p><span>Door gebruik te maken van deze website verklaart u zich akkoord met onderstaande voorwaarden en condities.</span></p>\n<p><span><strong>1. Website</strong></span></p>\n<p>De eigenaar van deze website is&nbsp;<br /> Cody Howest,<br /> Rijselstraat 5<br /> 8000, Brugge,&nbsp;<br /> Belgi&euml;<br /> Tel: 32(0)50 xx,&nbsp;<br /> E-mail: info@howest.be&nbsp;<br />ON: xx</p>\n<p><span>Als u niet akkoord gaat met onderstaande voorwaarden wordt u verzocht de website te verlaten. Cody behoudt zich het recht voor deze voorwaarden periodisch aan te passen waarna de leden op de hoogte zullen worden gebracht van deze wijzigingen. Wanneer u na deze kennisgeving de website blijft gebruiken verklaart u zich akkoord met de doorgevoerde wijzigingen. Cody Howest&nbsp; kan eventueel andere diensten aanbieden aan de gebruikers van deze site. In dat geval zullen de geldende voorwaarden apart worden medegedeeld.</span></p>\n<p><span><strong>2. Toegankelijkheid</strong></span></p>\n<p><span>Cody Howest&nbsp; probeert zo goed als mogelijk de website 24 uur per dag toegankelijk te houden, nochtans kan het gebeuren dat de website ontoegankelijk is voor een korte periode omwille van onderhoudswerken, aanpassingen of technische redenen.</span></p>\n<p><span><strong>3. Verantwoordelijkheid</strong></span></p>\n<p><span>Cody Howest weerlegt elke verantwoordelijkheid met betrekking tot deze website en de aangeboden informatie. Cody Howest&nbsp; verzekert niet dat de informatie op deze website correct, compleet of actueel is. Alle informatie, producten en diensten op deze website kunnen fouten bevatten. De gebruiker wordt verzocht hiermee rekening te houden.</span></p>\n<div><span><br /></span></div>'),
(7,1,'nl',10,'Y','S',0,'phone','0491-797204'),
(9,1,'nl',20,'Y','S',0,'address','Rijselstraat 1'),

(12,1,'nl',30,'N','S',0,'footer.first','<a href=\"mailto:info@mysite.com\">info@mysite.com</a>'),
(13,1,'nl',40,'N','S',0,'footer.second','<a href=\"/nl/voorwaarden\">Algemene voorwaarden</a>'),
(14,1,'nl',50,'N','S',0,'footer.third',''),
(15,1,'nl',60,'N','S',0,'Google Analytics code','UA-xxxxxxx-4'),

(19,105,'nl',10,'N','T',0,'Text','<h3>Lorem Ipsum - 105</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(20,105,'nl',30,'N','T',0,'Text','<h3>Lorem Ipsum - 105</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(23,106,'nl',30,'N','M',32,'Form',''),
(24,106,'nl',20,'N','T',0,'Text','<h3>Lorem Ipsum - 106</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(29,147,'nl',20,'N','I',0,'Image',''),
(30,150,'nl',10,'N','T',0,'Text','<h3>Lorem Ipsum - 150</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(32,151,'nl',10,'N','T',0,'Text','<h3>Lorem Ipsum - 151</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(35,148,'nl',10,'Y','T',0,'Text','<h3>Lorem Ipsum - 148</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(36,148,'nl',30,'N','S',0,'String','<embed type=\"application/x-shockwave-flash\" src=\"https://static.googleusercontent.com/external_content/picasaweb.googleusercontent.com/slideshow.swf\" width=\"550\" height=\"370\" flashvars=\"host=picasaweb.google.com&hl=en_US&feat=flashalbum&RGB=0x000000&feed=https%3A%2F%2Fpicasaweb.google.com%2Fdata%2Ffeed%2Fapi%2Fuser%2F102890025833311035792%2Falbumid%2F5504535003666704193%3Falt%3Drss%26kind%3Dphoto%26hl%3Den_US\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\"></embed>'),
(37,148,'nl',20,'Y','I',41,'Image',''),
(38,105,'nl',20,'N','F',45,'File',''),
(40,149,'nl',20,'Y','I',42,'Image',''),
(41,149,'nl',10,'Y','T',0,'Text','<h3>Lorem Ipsum - 149</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(42,150,'nl',20,'N','F',37,'File',''),
(43,150,'nl',30,'N','I',43,'Image',''),
(45,147,'nl',10,'N','B',0,'Block','www.mysite.com/[page]'),
(46,152,'nl',10,'N','B',0,'Block','www.mysite.com/[page]'),
(48,153,'nl',10,'N','T',0,'Text','<h3>Lorem Ipsum - 153</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(49,106,'nl',10,'Y','T',0,'Text','<h3>Lorem Ipsum - 106</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(51,155,'nl',10,'N','T',0,'Text','<h3>Lorem Ipsum - 155</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(52,149,'nl',30,'N','S',0,'String','<embed type=\"application/x-shockwave-flash\" src=\"https://static.googleusercontent.com/external_content/picasaweb.googleusercontent.com/slideshow.swf\" width=\"550\" height=\"370\" flashvars=\"host=picasaweb.google.com&hl=en_US&feat=flashalbum&RGB=0x000000&feed=https%3A%2F%2Fpicasaweb.google.com%2Fdata%2Ffeed%2Fapi%2Fuser%2F102890025833311035792%2Falbumid%2F5929480423932141185%3Falt%3Drss%26kind%3Dphoto%26hl%3Den_US\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\"></embed>'),
(53,148,'nl',40,'N','B',0,'Block','www.mysite.com/[page]'),
(54,149,'nl',40,'N','B',0,'Block','www.mysite.com/[page]'),
(55,103,'nl',20,'N','B',0,'Block','www.mysite.com/[page]'),
(56,155,'nl',20,'N','B',0,'Block','https://www.facebook.com/mysite'),
(57,103,'nl',10,'N','T',0,'Text','<h3>Lorem Ipsum - 103</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(58,156,'nl',10,'N','T',0,'Text','<h3>Lorem Ipsum - 156</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(59,157,'nl',10,'N','T',0,'Text','<h3>Lorem Ipsum - 157</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(60,97,'en',10,'N','T',0,'','<p><span>Cody draagt zorg voor uw privacy. Lees deze Privacyverklaring om meer te weten te komen over de manier waarop persoonsgegevens worden ingezameld en verwerkt op deze website. In dit geval handelt Cody Howest daarbij steeds in overeenstemming met de bepalingen van de Belgische privacywet (Wet van 8 december 1992 tot bescherming van de persoonlijke levenssfeer ten opzichte van de verwerking van persoonsgegevens). De persoonlijke gegevens beperken zich enkel tot uw e-mailadres.</span></p>\n<p><span><strong>Verantwoordelijke</strong></span></p>\n<p><span>De verantwoordelijke voor de verwerking is Cody Howest; Rijselstraat 5, 8000 Brugge.</span></p>\n<p><span><strong>Kennisname</strong></span></p>\n<p><span>U kan van deze persoonsgegevens kennis nemen door een aanvraag te richten aan Cody Howest</span><span>(brief, fax of e-mail) en ze, indien nodig, doen verbeteren of verwijderen. Indien u niet gecontacteerd wenst te worden in het kader van email marketing, zullen uw gegevens op uw verzoek kosteloos uit de betrokken lijsten worden</span></p>\n<p><span><strong>Cookies</strong></span></p>\n<p><span>Wij gebruiken cookies om uw toekomstig bezoek aan onze site vlotter te laten verlopen. Een cookie is een klein stukje tekst dat op uw harde schijf wordt geplaatst. Cookies worden veel gebruikt om een hoger functionaliteit, en dus betere dienst, aan de bezoekers te kunnen aanbieden. [U kan het gebruik van cookies uitschakelen, al leidt dit er wel toe dat effecten opsommen die ten gevolge van het uitschakelen van cookies worden veroorzaakt.]</span></p>\n<p><span><strong>Veiligheid</strong></span></p>\n<p><span>Cody Howest verbindt zich ertoe om al de gepaste technische en organisatorische maatregelen te treffen om uw persoonsgegevens te beschermen tegen vernietiging, verlies, onbedoelde wijziging, beschadiging of openbaarmaking.</span></p>\n<p><span><strong>Toestemming</strong></span></p>\n<p><span>Door u akkoord te verklaren met deze voorwaarden en condities geeft u ook uw toestemming voor de verwerking van uw persoonsgegevens voor de doeleinden zoals hierboven beschreven.</span></p>'),
(61,98,'en',10,'N','T',0,'','<p><span>Door gebruik te maken van deze website verklaart u zich akkoord met onderstaande voorwaarden en condities.</span></p>\n<p><span><strong>1. Website</strong></span></p>\n<p>De eigenaar van deze website is&nbsp;<br /> Cody Howest,<br /> Rijselstraat 5<br /> 8000, Brugge,&nbsp;<br /> Belgi&euml;<br /> Tel: 32(0)50 xx,&nbsp;<br /> E-mail: info@howest.be&nbsp;<br />ON: xx</p>\n<p><span>Als u niet akkoord gaat met onderstaande voorwaarden wordt u verzocht de website te verlaten. Cody behoudt zich het recht voor deze voorwaarden periodisch aan te passen waarna de leden op de hoogte zullen worden gebracht van deze wijzigingen. Wanneer u na deze kennisgeving de website blijft gebruiken verklaart u zich akkoord met de doorgevoerde wijzigingen. Cody Howest&nbsp; kan eventueel andere diensten aanbieden aan de gebruikers van deze site. In dat geval zullen de geldende voorwaarden apart worden medegedeeld.</span></p>\n<p><span><strong>2. Toegankelijkheid</strong></span></p>\n<p><span>Cody Howest&nbsp; probeert zo goed als mogelijk de website 24 uur per dag toegankelijk te houden, nochtans kan het gebeuren dat de website ontoegankelijk is voor een korte periode omwille van onderhoudswerken, aanpassingen of technische redenen.</span></p>\n<p><span><strong>3. Verantwoordelijkheid</strong></span></p>\n<p><span>Cody Howest weerlegt elke verantwoordelijkheid met betrekking tot deze website en de aangeboden informatie. Cody Howest&nbsp; verzekert niet dat de informatie op deze website correct, compleet of actueel is. Alle informatie, producten en diensten op deze website kunnen fouten bevatten. De gebruiker wordt verzocht hiermee rekening te houden.</span></p>\n<div><span><br /></span></div>'),
(83,106,'en',20,'N','T',0,'Text','<h3>Lorem Ipsum - 106</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(88,147,'en',20,'N','I',0,'Image',''),
(89,150,'en',10,'N','T',0,'Text','<h3>Lorem Ipsum - 150</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(108,106,'en',10,'Y','T',0,'Text','<h3>Lorem Ipsum - 106</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(74,1,'en',60,'N','S',0,'Google Analytics code','UA-xxxxxxx-4'),
(79,105,'en',30,'N','T',0,'Text','<h3>Lorem Ipsum - 105</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(66,1,'en',10,'Y','S',0,'phone','0491-797204'),
(68,1,'en',20,'Y','S',0,'address','Rijselstraat 1'),
(71,1,'en',30,'N','S',0,'footer.first','<a href=\"mailto:info@mysite.com\">info@mysite.com</a>'),
(72,1,'en',40,'N','S',0,'footer.second','<a href=\"/nl/voorwaarden\">Algemene voorwaarden</a>'),
(73,1,'en',50,'N','S',0,'footer.third',''),
(78,105,'en',10,'N','T',0,'Text','<h3>Lorem Ipsum - 105</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(82,106,'en',30,'N','M',32,'Form',''),
(91,151,'en',10,'N','T',0,'Text','<h3>Lorem Ipsum - 151</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(94,148,'en',10,'Y','T',0,'Text','<h3>Lorem Ipsum - 148</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(95,148,'en',30,'N','S',0,'String','<embed type=\"application/x-shockwave-flash\" src=\"https://static.googleusercontent.com/external_content/picasaweb.googleusercontent.com/slideshow.swf\" width=\"550\" height=\"370\" flashvars=\"host=picasaweb.google.com&hl=en_US&feat=flashalbum&RGB=0x000000&feed=https%3A%2F%2Fpicasaweb.google.com%2Fdata%2Ffeed%2Fapi%2Fuser%2F102890025833311035792%2Falbumid%2F5504535003666704193%3Falt%3Drss%26kind%3Dphoto%26hl%3Den_US\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\"></embed>'),
(96,148,'en',20,'Y','I',41,'Image',''),
(97,105,'en',20,'N','F',45,'File',''),
(99,149,'en',20,'Y','I',42,'Image',''),
(100,149,'en',10,'Y','T',0,'Text','<h3>Lorem Ipsum - 149</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(101,150,'en',20,'N','F',37,'File',''),
(102,150,'en',30,'N','I',43,'Image',''),
(104,147,'en',10,'N','B',0,'Block','www.mysite.com/[page]'),
(105,152,'en',10,'N','B',0,'Block','www.mysite.com/[page]'),
(107,153,'en',10,'N','T',0,'Text','<h3>Lorem Ipsum - 153</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(110,155,'en',10,'N','T',0,'Text','<h3>Lorem Ipsum - 155</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(111,149,'en',30,'N','S',0,'String','<embed type=\"application/x-shockwave-flash\" src=\"https://static.googleusercontent.com/external_content/picasaweb.googleusercontent.com/slideshow.swf\" width=\"550\" height=\"370\" flashvars=\"host=picasaweb.google.com&hl=en_US&feat=flashalbum&RGB=0x000000&feed=https%3A%2F%2Fpicasaweb.google.com%2Fdata%2Ffeed%2Fapi%2Fuser%2F102890025833311035792%2Falbumid%2F5929480423932141185%3Falt%3Drss%26kind%3Dphoto%26hl%3Den_US\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\"></embed>'),
(112,148,'en',40,'N','B',0,'Block','www.mysite.com/[page]'),
(113,149,'en',40,'N','B',0,'Block','www.mysite.com/[page]'),
(114,103,'en',20,'N','B',0,'Block','www.mysite.com/[page]'),
(115,155,'en',20,'N','B',0,'Block','https://www.facebook.com/mysite'),
(116,103,'en',10,'N','T',0,'Text','<h3>Lorem Ipsum - 103</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(118,157,'en',10,'N','T',0,'Text','<h3>Lorem Ipsum - 157</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.'),
(117,156,'en',10,'N','T',0,'Text','<h3>Lorem Ipsum - 156</h3>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.');
UNLOCK TABLES;

DROP TABLE IF EXISTS `data`;

CREATE TABLE `data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `atom` int(11) NOT NULL DEFAULT '0',
  `data` text,
  `status` char(1) NOT NULL DEFAULT 'S',
  `created` datetime NOT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) AUTO_INCREMENT=200 DEFAULT CHARSET=utf8;



LOCK TABLES `data` WRITE;
INSERT INTO `data` VALUES 
 (1,32,'{\"Titel\":\"\",\"Naam\":\"ikke\",\"e-mail adres\":\"steve.jobs@apple.com\",\"vraag\":\"Ik heb geen vragen!\"}','S','2013-09-10 19:09:39',NULL);
UNLOCK TABLES;


DROP TABLE IF EXISTS `domains`;

CREATE TABLE `domains` (
  `id` varchar(32) NOT NULL DEFAULT '',
  `name` varchar(32) DEFAULT '?'
) DEFAULT CHARSET=utf8;


LOCK TABLES `domains` WRITE;
INSERT INTO `domains` VALUES 
 ('admin','Admin'),
 ('cms','CMS Users'),
 ('user','Users');
UNLOCK TABLES;


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
  `validfrom` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `validto` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `showcontent` char(1) DEFAULT 'Y',
  `needslogin` char(1) DEFAULT 'N',
  `defaultrequest` varchar(32) DEFAULT '',
  `alloweddomains` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `parent_idx` (`parent`)
) AUTO_INCREMENT=200 DEFAULT CHARSET=utf8;


LOCK TABLES `items` WRITE;
INSERT INTO `items` VALUES 
(1,'Website',-1,1,100,'M',100,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','S',NULL,'list',''),
(2,'Login',3,1,2,'A',99,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),
(3,'Pages',-1,1,100,'M',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),
(4,'Footer',-1,1,100,'M',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),
(9,'Dashboard',-1,1,9,'M',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),
(10,'CMS',9,1,2,'M',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','S','Y','',''),
(11,'Structure',10,1,11,'A',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),
(12,'Images',10,1,12,'A',20,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),
(13,'Files',10,1,13,'A',30,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),
(14,'Forms',10,1,14,'A',40,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),
(15,'Users',10,1,15,'A',50,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','list',''),
(16,'Templates',10,1,16,'A',60,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','list',''),
(20,'Management',9,1,2,'M',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','S','Y','',''),
(21,'Forms',20,1,18,'A',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),
(22,'Comments',20,1,19,'A',10,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','Y','',''),

(97,'Privacy Verklaring',4,1,100,'A',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),
(98,'Disclaimer',4,1,100,'A',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),
(99,'Global',3,1,100,'A',0,'2010-01-01','2010-01-01 00:00:00','2100-01-01 00:00:00','Y','N','',''),

(102,'Map1',1,1,100,'M',40,'2013-07-11','2013-07-11 00:00:00','2101-01-31 00:00:00','S',NULL,'list',''),
(103,'Page1',1,1,100,'A',20,'2013-07-11','2013-07-11 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),
(153,'page3 in map',102,1,100,'M',30,'2013-09-09','2013-09-09 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),
(105,'page2 in map',102,1,100,'A',20,'2013-07-11','2013-07-11 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),
(106,'Contact Us',1,1,100,'A',70,'2013-09-07','2013-09-07 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),
(147,'Intros',1,1,103,'M',60,'2013-09-08','2013-09-08 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),
(148,'subpage 1',147,1,100,'M',10,'2013-09-08','2013-09-08 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),
(149,'subpage 2',147,1,100,'M',20,'2013-09-08','2013-09-08 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),
(150,'page1 in map',102,1,100,'A',10,'2013-09-08','2013-09-08 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),
(151,'Page2',1,1,100,'M',30,'2013-09-08','2013-09-08 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),
(152,'News',1,1,100,'D',10,'2013-09-08','2013-09-08 00:00:00','2101-01-31 00:00:00','S',NULL,'list',''),
(154,'11 sept 13',152,1,100,'M',5,'2013-09-11','2013-09-11 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),
(155,'28 sept 13',152,1,100,'M',5,'2013-09-28','2013-09-30 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),
(156,'02 nov 13',152,1,100,'D',5,'2013-11-02','2013-11-02 00:00:00','2101-01-31 00:00:00','Y',NULL,'list',''),
(157,'New item',152,1,100,'D',5,'2013-12-06','2013-12-06 00:00:00','2101-01-31 00:00:00','Y',NULL,'list','');
UNLOCK TABLES;


DROP TABLE IF EXISTS `languages`;
CREATE TABLE `languages` (
  `id` varchar(4) NOT NULL DEFAULT '',
  `name` varchar(32) DEFAULT '',
  `sortorder` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8;

LOCK TABLES `languages` WRITE;
INSERT INTO `languages` VALUES 
 ('en','English',1),
 ('nl','Nederlands',2);
UNLOCK TABLES;

DROP TABLE IF EXISTS `levels`;
CREATE TABLE `levels` (
  `id` int(11) DEFAULT NULL,
  `name` varchar(32) DEFAULT NULL
) DEFAULT CHARSET=utf8;


LOCK TABLES `levels` WRITE;
INSERT INTO `levels` VALUES 
 (2,'user'),
 (50,'admin'),
 (99,'super');
UNLOCK TABLES;


DROP TABLE IF EXISTS `pages`;
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
) DEFAULT CHARSET=utf8;

LOCK TABLES `pages` WRITE;
INSERT INTO `pages` VALUES 
(1,'nl','Your site','welcome','Y','','','2010-01-01 00:00:00','2014-09-03 11:08:24'),
(2,'nl','Login','login','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(3,'nl','Pages','','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(4,'nl','Footer','','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(9,'nl','Dashboard','dashboard','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(10,'nl','Website CMS','cms','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(11,'nl','Structure','pages','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(12,'nl','Images','images','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(13,'nl','Files','files','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(14,'nl','Forms','forms','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(15,'nl','Users','users','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(16,'nl','Templates','templates','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(20,'nl','Management','admin','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(21,'nl','Forms','data','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(22,'nl','Comments','comments','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),

(97,'nl','Privacy Verklaring','privacy','Y','','','2010-01-01 00:00:00','2013-03-19 09:30:30'),
(98,'nl','Disclaimer','disclaimer','Y','','','2010-01-01 00:00:00','2012-08-20 17:09:50'),
(99,'nl','Global','global','Y','','','2010-01-01 00:00:00','2012-08-15 22:02:59'),

(152,'nl','News','nieuws','Y','','','2013-09-08 16:41:58','2013-09-30 19:52:12'),
(151,'nl','Page2','pagina2','Y','','','2013-09-08 16:40:07','2013-12-08 17:16:01'),
(150,'nl','page1 in map','','Y','','','2013-09-08 16:31:22','2013-09-09 16:04:31'),
(149,'nl','subpage 2','','Y','','','2013-09-08 16:25:44','2013-10-21 17:01:56'),
(148,'nl','subpage 1','','Y','','','2013-09-08 16:25:28','2013-10-21 17:01:46'),
(147,'nl','Intros','','Y','','','2013-09-08 16:23:37','2013-09-09 16:15:59'),
(102,'nl','Map1','officiele_documenten','Y','','','2013-07-11 16:00:40','2013-09-09 15:15:14'),
(103,'nl','Page1','thepage','Y','','','2013-07-11 16:00:47','2013-11-02 18:21:46'),
(153,'nl','page3 in map','voorwaarden','Y','','','2013-09-09 15:14:51','2013-09-30 20:18:53'),
(105,'nl','page2 in map','Statuten','Y','','','2013-07-11 16:40:43','2013-09-09 16:03:57'),
(106,'nl','Contact Us','contact','Y','','','2013-09-07 21:19:10','2013-09-10 19:10:21'),
(154,'nl','11 sept 13','11sep2013','Y','','','2013-09-30 19:41:31','2013-10-01 22:43:01'),
(155,'nl','28 sept 13','28sep2013','Y','','','2013-09-30 19:43:20','2013-10-20 23:30:55'),
(156,'nl','02 nov 13','02nov2013','Y','','','2013-11-02 17:59:36','2013-11-02 18:34:12'),
(157,'nl','11 dec 13','','Y','','','2013-12-06 22:04:00','2013-12-06 22:11:13'),

(1,'en','Empty Site','welcome','Y','','','2010-01-01 00:00:00','2014-09-03 11:08:14'),
(2,'en','Login','login','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(3,'en','Pages','','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(4,'en','Footer','','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(9,'en','Dashboard','dashboard','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(10,'en','Website CMS','cms','Y','','','2010-01-01 00:00:00','2010-01-01 00:00:00'),
(11,'en','Structure','pages','Y','','','2010-01-01 00:00:00','2014-09-03 10:21:49'),
(12,'en','Images','images','Y','','','2010-01-01 00:00:00','2014-09-03 10:21:53'),
(13,'en','Files','files','Y','','','2010-01-01 00:00:00','2014-09-03 10:21:57'),
(14,'en','Forms','forms','Y','','','2010-01-01 00:00:00','2014-09-03 10:22:01'),
(15,'en','Users','users','Y','','','2010-01-01 00:00:00','2014-09-03 10:22:05'),
(16,'en','Templates','templates','Y','','','2010-01-01 00:00:00','2014-09-03 10:22:10'),
/* (17,'en','System','system','Y','','','2010-01-01 00:00:00','2014-09-03 10:22:16'), */
(20,'en','Management','admin','Y','','','2010-01-01 00:00:00','2014-09-03 10:22:35'),
(21,'en','Forms','data','Y','','','2010-01-01 00:00:00','2014-09-03 10:22:39'),
(22,'en','Comments','comments','Y','','','2010-01-01 00:00:00','2014-09-03 10:22:45'),

(97,'en','Privacy Declaration','privacy','Y','','','2010-01-01 00:00:00','2013-03-19 09:30:30'),
(98,'en','Disclaimer','disclaimer','Y','','','2010-01-01 00:00:00','2012-08-20 17:09:50'),
(99,'en','Global','global','Y','','','2010-01-01 00:00:00','2012-08-15 22:02:59'),

(152,'en','News','news','Y','','','2013-09-08 16:41:58','2014-09-03 10:22:50'),
(151,'en','Page2','page2','Y','','','2013-09-08 16:40:07','2014-09-03 10:23:07'),
(150,'en','page1 in map','','Y','','','2013-09-08 16:31:22','2014-09-03 10:24:07'),
(149,'en','subpage 2','','Y','','','2013-09-08 16:25:44','2014-09-03 10:23:37'),
(148,'en','subpage 1','','Y','','','2013-09-08 16:25:28','2014-09-03 10:23:33'),
(147,'en','Intros','','Y','','','2013-09-08 16:23:37','2014-09-03 10:23:18'),
(102,'en','Map1','officiele_documenten','Y','','','2013-07-11 16:00:40','2014-09-03 10:23:12'),
(103,'en','Page1','page1','Y','','','2013-07-11 16:00:47','2014-09-03 10:23:01'),
(153,'en','page3 in map','conditions','Y','','','2013-09-09 15:14:51','2014-09-03 10:24:01'),
(105,'en','page2 in map','stats','Y','','','2013-07-11 16:40:43','2014-09-03 10:23:54'),
(106,'en','Contact Us','contact','Y','','','2013-09-07 21:19:10','2014-09-03 10:23:22'),
(154,'en','11 sept 13','11sep2013','Y','','','2013-09-30 19:41:31','2013-10-01 22:43:01'),
(155,'en','28 sept 13','28sep2013','Y','','','2013-09-30 19:43:20','2013-10-20 23:30:55'),
(156,'en','02 nov 13','02nov2013','Y','','','2013-11-02 17:59:36','2013-11-02 18:34:12'),
(157,'en','11 dec 13','','Y','','','2013-12-06 22:04:00','2013-12-06 22:11:13');
UNLOCK TABLES;

DROP TABLE IF EXISTS `templates`;

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
) AUTO_INCREMENT=200 DEFAULT CHARSET=utf8;


LOCK TABLES `templates` WRITE;
INSERT INTO `templates` VALUES 
(2,'Login','','LoginController','-/login.ejs','',0,'Y',0),
(9,'Dashboard','','DashboardController','-/cms/dashboard.ejs','',0,'Y',0),
(11,'CMS-Page','','PageController','-/cms/pages.ejs','',0,'Y',0),
(12,'CMS-Images','','ImageController','-/cms/images.ejs','',0,'Y',0),
(13,'CMS-Files','','FileController','-/cms/files.ejs','',0,'Y',0),
(14,'CMS-Forms','','FormController','-/cms/forms.ejs','',0,'Y',0),
(15,'CMS-Users','','UserController','-/cms/users.ejs','',0,'Y',0),
(16,'CMS-Templates','','TemplateController','-/cms/templates.ejs','',0,'Y',0),
(18,'Admin-Forms','Incoming data from forms','FormDataController','-/cms/forms-list.ejs','',0,'Y',0),
(19,'Admin-Comments','View approve, edit or trash comments','Controller','-/cms/comments.ejs','',0,'Y',0),

(100,'Content','','Controller','index.ejs','',999,'N',100),
(103,'With intros','Displays also all intro content of the pages below','Controller','intros.ejs','',0,'N',0),

(106,'CMS-Styles','','StylesController','-/cms/styles.ejs','',0,'Y',0);
UNLOCK TABLES;


DROP TABLE IF EXISTS `users`;
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
) AUTO_INCREMENT=200 DEFAULT CHARSET=utf8;


LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES 
(1,'super','rWorks Super',password("empty"),'rWorks',99,0,99,'Y','info@mysite.com','','N',0),
(2,'admin','rWorks Admin',password("empty"),'rWorks',50,0,99,'Y','info@mysite.com','','N',0),
(3,'test','rWorks Test',password("empty"),'rWorks',2,0,99,'Y','info@mysite.com','','N',0),
(11,'user','Mr. Owner User',password("empty"),'users', 50,0,99,'Y','info@mysite.com','','N',10);
UNLOCK TABLES;
