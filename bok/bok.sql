-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Machine: localhost
-- Genereertijd: 22 aug 2013 om 14:55
-- Serverversie: 5.5.24-log
-- PHP-versie: 5.3.13

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Databank: `bok`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `appointment`
--


INSERT INTO `content` VALUES
 (0,1,'nl',60,'N','S',0,'Google Analytics code','UA-9438915-5'),
 (0,1,'en',60,'N','S',0,'Google Analytics code','UA-9438915-5');

CREATE TABLE IF NOT EXISTS `appointment` (
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
  KEY `fkuser_appointment_idx` (`userId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=75 ;

--
-- Gegevens worden uitgevoerd voor tabel `appointment`
--

INSERT INTO `appointment` (`idappointment`, `title`, `description`, `date`, `start`, `end`, `location`, `userId`) VALUES
(59, 'Meli', 'daguitstap naar de meli', '2013-08-15 00:00:00', '07:30:00', '20:00:00', 'Melii', 1),
(60, 'test', '', '2013-08-03 02:00:00', '08:00:00', '12:00:00', 'sfqdsf', 1),
(61, 'test', 'something', '2013-08-22 02:00:00', '08:00:00', '12:00:00', 'everywhere', 1),
(62, 'Lunch', 'lunch with CEO', '2013-08-22 02:00:00', '12:00:00', '13:00:00', 'Brussels', 1),
(64, 'Car needs maintenance', 'to the garage', '2013-08-22 00:00:00', '16:00:00', '17:00:00', 'Toyota Lievens Maldegem', 1),
(65, 'test ding', 'nergens', '2013-12-18 00:00:00', '08:00:00', '12:00:00', 'efsqfs', 1),
(68, 'abc', '', '2013-08-23 02:00:00', '08:00:00', '12:00:00', 'sfqsd', 1),
(69, '9/11 ceremony', '', '2013-09-11 02:00:00', '08:00:00', '12:00:00', 'NYC', 1),
(72, 'testr', 'sfsqdf', '2014-04-09 02:00:00', '08:00:00', '12:00:00', 'qdsfsd', 1),
(73, 'sfdqsfsdqf', '', '2014-01-17 01:00:00', '08:00:00', '12:00:00', 'sfsdqfqsdf', 1),
(74, 'delivery Avon', '', '2013-08-24 02:00:00', '08:00:00', '12:00:00', 'Home', 1);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `appointmentcomment`
--

CREATE TABLE IF NOT EXISTS `appointmentcomment` (
  `idappointmentComment` int(11) NOT NULL AUTO_INCREMENT,
  `appointmentId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `time` datetime NOT NULL,
  `comment` text NOT NULL,
  PRIMARY KEY (`idappointmentComment`),
  KEY `fk_comment_user_idx` (`userId`),
  KEY `fk_comment_appointment_idx` (`appointmentId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=16 ;

--
-- Gegevens worden uitgevoerd voor tabel `appointmentcomment`
--

INSERT INTO `appointmentcomment` (`idappointmentComment`, `appointmentId`, `userId`, `time`, `comment`) VALUES
(6, 59, 1, '2013-08-08 16:05:57', 'tof ! \r\nIk ga mee !'),
(8, 59, 11, '2013-08-08 18:59:51', 'Jammer, ik kan niet mee :('),
(10, 59, 1, '2013-08-08 19:17:45', 'Dat is jammer Mr. Vaneigens, hopelijk een volgende keer weer'),
(12, 59, 1, '2013-08-22 10:34:46', 'Test Comment'),
(13, 72, 1, '2013-08-22 10:43:52', 'sfdqsfqsdf'),
(14, 72, 1, '2013-08-22 10:44:36', 'sfsfqdf'),
(15, 74, 1, '2013-08-22 10:45:56', 'allright');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `atoms`
--

CREATE TABLE IF NOT EXISTS `atoms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent` int(11) NOT NULL DEFAULT '0',
  `sortorder` int(11) DEFAULT '0',
  `name` varchar(64) NOT NULL DEFAULT '',
  `note` varchar(255) DEFAULT NULL,
  `extention` varchar(3) DEFAULT '',
  `created` datetime DEFAULT '0000-00-00 00:00:00',
  `updated` datetime DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=50 ;

--
-- Gegevens worden uitgevoerd voor tabel `atoms`
--

INSERT INTO `atoms` (`id`, `parent`, `sortorder`, `name`, `note`, `extention`, `created`, `updated`) VALUES
(1, 0, 10, 'Images', '', '', '2012-07-09 14:18:36', '2012-07-09 14:18:36'),
(2, 0, 20, 'Files', '', '', '2012-07-09 14:18:36', '2012-07-09 14:18:36'),
(3, 0, 20, 'Forms', '', '', '2012-07-09 14:18:36', '2012-07-09 14:18:36'),
(21, 1, 10, 'Global', '', '', '2012-08-15 18:55:51', '2012-08-15 18:55:54'),
(22, 21, 10, 'Map', '', 'JPG', '2012-08-15 20:57:34', '2012-08-15 22:57:44'),
(31, 2, 10, 'a file', '', 'pdf', '2012-08-15 18:55:51', '2012-08-15 18:55:54'),
(33, 1, 5, 'groep', 'groep-S', 'jpg', '2013-07-23 14:39:15', '2013-07-23 14:39:23'),
(34, 1, 5, 'History', '', 'xxx', '2013-08-17 15:46:32', '2013-08-17 15:46:35'),
(35, 34, 5, 'FilipPeter', 'FilipPeter', 'jpg', '2013-08-17 15:46:39', '2013-08-17 15:47:52'),
(36, 34, 5, 'fietsenUS1', 'fietsenUS1', 'jpg', '2013-08-17 16:32:25', '2013-08-17 16:32:47'),
(38, 34, 5, 'Bodypainting', 'Bodypainting', 'jpg', '2013-08-17 16:43:41', '2013-08-17 16:44:00'),
(39, 34, 5, 'vissen-ny', 'vissen-ny', 'jpg', '2013-08-17 16:44:03', '2013-08-17 16:44:17'),
(40, 34, 5, 'FS_App', 'FS_app', 'jpg', '2013-08-17 19:06:29', '2013-08-17 19:07:40'),
(41, 34, 5, 'FS_en_JC', 'FS_en_JC', 'jpg', '2013-08-17 19:09:18', '2013-08-17 19:09:38'),
(42, 34, 5, 'FS_en_MV', 'FS_en_MV', 'jpg', '2013-08-17 19:10:40', '2013-08-17 19:11:03'),
(43, 34, 5, 'NR2004-1', 'NR2004-1', 'jpg', '2013-08-17 19:13:22', '2013-08-17 19:13:44'),
(44, 34, 5, 'NR2004-2', 'NR2004-2', 'jpg', '2013-08-17 19:13:46', '2013-08-17 19:14:02'),
(45, 34, 5, 'Benn-jerry', 'Ben-Jerry', 'jpg', '2013-08-17 19:14:30', '2013-08-17 19:14:44'),
(46, 34, 5, 'bok-gates1', 'bok-gates1', 'jpg', '2013-08-17 19:20:00', '2013-08-17 19:20:22'),
(47, 34, 5, 'bok-gates2', 'bok-gates2', 'jpg', '2013-08-17 19:20:25', '2013-08-17 19:20:38'),
(48, 34, 5, 'bok-in-bxl', 'bok_in_bxl', 'jpg', '2013-08-17 19:22:12', '2013-08-17 19:22:27'),
(49, 34, 5, 'speech', 'NYFS-2004', 'gif', '2013-08-17 19:25:13', '2013-08-17 19:25:22');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `content`
--

CREATE TABLE IF NOT EXISTS `content` (
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=37 ;

--
-- Gegevens worden uitgevoerd voor tabel `content`
--

INSERT INTO `content` (`id`, `item`, `language`, `sortorder`, `intro`, `kind`, `atom`, `name`, `data`) VALUES
(1, 97, 'nl', 10, 'N', 'T', 0, '', '<p><span>Cody draagt zorg voor uw privacy. Lees deze Privacyverklaring om meer te weten te komen over de manier waarop persoonsgegevens worden ingezameld en verwerkt op deze website. In dit geval handelt Cody Howest daarbij steeds in overeenstemming met de bepalingen van de Belgische privacywet (Wet van 8 december 1992 tot bescherming van de persoonlijke levenssfeer ten opzichte van de verwerking van persoonsgegevens). De persoonlijke gegevens beperken zich enkel tot uw e-mailadres.</span></p>\n<p><span><strong>Verantwoordelijke</strong></span></p>\n<p><span>De verantwoordelijke voor de verwerking is Cody Howest; Rijselstraat 5, 8000 Brugge.</span></p>\n<p><span><strong>Kennisname</strong></span></p>\n<p><span>U kan van deze persoonsgegevens kennis nemen door een aanvraag te richten aan Cody Howest</span><span>(brief, fax of e-mail) en ze, indien nodig, doen verbeteren of verwijderen. Indien u niet gecontacteerd wenst te worden in het kader van email marketing, zullen uw gegevens op uw verzoek kosteloos uit de betrokken lijsten worden</span></p>\n<p><span><strong>Cookies</strong></span></p>\n<p><span>Wij gebruiken cookies om uw toekomstig bezoek aan onze site vlotter te laten verlopen. Een cookie is een klein stukje tekst dat op uw harde schijf wordt geplaatst. Cookies worden veel gebruikt om een hoger functionaliteit, en dus betere dienst, aan de bezoekers te kunnen aanbieden. [U kan het gebruik van cookies uitschakelen, al leidt dit er wel toe dat effecten opsommen die ten gevolge van het uitschakelen van cookies worden veroorzaakt.]</span></p>\n<p><span><strong>Veiligheid</strong></span></p>\n<p><span>Cody Howest verbindt zich ertoe om al de gepaste technische en organisatorische maatregelen te treffen om uw persoonsgegevens te beschermen tegen vernietiging, verlies, onbedoelde wijziging, beschadiging of openbaarmaking.</span></p>\n<p><span><strong>Toestemming</strong></span></p>\n<p><span>Door u akkoord te verklaren met deze voorwaarden en condities geeft u ook uw toestemming voor de verwerking van uw persoonsgegevens voor de doeleinden zoals hierboven beschreven.</span></p>'),
(2, 98, 'nl', 10, 'N', 'T', 0, '', '<p><span>Door gebruik te maken van deze website verklaart u zich akkoord met onderstaande voorwaarden en condities.</span></p>\n<p><span><strong>1. Website</strong></span></p>\n<p>De eigenaar van deze website is&nbsp;<br /> Cody Howest,<br /> Rijselstraat 5<br /> 8000, Brugge,&nbsp;<br /> Belgi&euml;<br /> Tel: 32(0)50 xx,&nbsp;<br /> E-mail: info@howest.be&nbsp;<br />ON: xx</p>\n<p><span>Als u niet akkoord gaat met onderstaande voorwaarden wordt u verzocht de website te verlaten. Cody behoudt zich het recht voor deze voorwaarden periodisch aan te passen waarna de leden op de hoogte zullen worden gebracht van deze wijzigingen. Wanneer u na deze kennisgeving de website blijft gebruiken verklaart u zich akkoord met de doorgevoerde wijzigingen. Cody Howest&nbsp; kan eventueel andere diensten aanbieden aan de gebruikers van deze site. In dat geval zullen de geldende voorwaarden apart worden medegedeeld.</span></p>\n<p><span><strong>2. Toegankelijkheid</strong></span></p>\n<p><span>Cody Howest&nbsp; probeert zo goed als mogelijk de website 24 uur per dag toegankelijk te houden, nochtans kan het gebeuren dat de website ontoegankelijk is voor een korte periode omwille van onderhoudswerken, aanpassingen of technische redenen.</span></p>\n<p><span><strong>3. Verantwoordelijkheid</strong></span></p>\n<p><span>Cody Howest weerlegt elke verantwoordelijkheid met betrekking tot deze website en de aangeboden informatie. Cody Howest&nbsp; verzekert niet dat de informatie op deze website correct, compleet of actueel is. Alle informatie, producten en diensten op deze website kunnen fouten bevatten. De gebruiker wordt verzocht hiermee rekening te houden.</span></p>\n<div><span><br /></span></div>'),
(3, 97, 'en', 10, 'N', 'T', 0, '', '<p><span>Cody draagt zorg voor uw privacy. Lees deze Privacyverklaring om meer te weten te komen over de manier waarop persoonsgegevens worden ingezameld en verwerkt op deze website. In dit geval handelt Cody Howest daarbij steeds in overeenstemming met de bepalingen van de Belgische privacywet (Wet van 8 december 1992 tot bescherming van de persoonlijke levenssfeer ten opzichte van de verwerking van persoonsgegevens). De persoonlijke gegevens beperken zich enkel tot uw e-mailadres.</span></p>\n<p><span><strong>Verantwoordelijke</strong></span></p>\n<p><span>De verantwoordelijke voor de verwerking is Cody Howest; Rijselstraat 5, 8000 Brugge.</span></p>\n<p><span><strong>Kennisname</strong></span></p>\n<p><span>U kan van deze persoonsgegevens kennis nemen door een aanvraag te richten aan Cody Howest</span><span>(brief, fax of e-mail) en ze, indien nodig, doen verbeteren of verwijderen. Indien u niet gecontacteerd wenst te worden in het kader van email marketing, zullen uw gegevens op uw verzoek kosteloos uit de betrokken lijsten worden</span></p>\n<p><span><strong>Cookies</strong></span></p>\n<p><span>Wij gebruiken cookies om uw toekomstig bezoek aan onze site vlotter te laten verlopen. Een cookie is een klein stukje tekst dat op uw harde schijf wordt geplaatst. Cookies worden veel gebruikt om een hoger functionaliteit, en dus betere dienst, aan de bezoekers te kunnen aanbieden. [U kan het gebruik van cookies uitschakelen, al leidt dit er wel toe dat effecten opsommen die ten gevolge van het uitschakelen van cookies worden veroorzaakt.]</span></p>\n<p><span><strong>Veiligheid</strong></span></p>\n<p><span>Cody Howest verbindt zich ertoe om al de gepaste technische en organisatorische maatregelen te treffen om uw persoonsgegevens te beschermen tegen vernietiging, verlies, onbedoelde wijziging, beschadiging of openbaarmaking.</span></p>\n<p><span><strong>Toestemming</strong></span></p>\n<p><span>Door u akkoord te verklaren met deze voorwaarden en condities geeft u ook uw toestemming voor de verwerking van uw persoonsgegevens voor de doeleinden zoals hierboven beschreven.</span></p>'),
(4, 98, 'en', 10, 'N', 'T', 0, '', '<p><span>Door gebruik te maken van deze website verklaart u zich akkoord met onderstaande voorwaarden en condities.</span></p>\n<p><span><strong>1. Website</strong></span></p>\n<p>De eigenaar van deze website is&nbsp;<br /> Cody Howest,<br /> Rijselstraat 5<br /> 8000, Brugge,&nbsp;<br /> Belgi&euml;<br /> Tel: 32(0)50 xx,&nbsp;<br /> E-mail: info@howest.be&nbsp;<br />ON: xx</p>\n<p><span>Als u niet akkoord gaat met onderstaande voorwaarden wordt u verzocht de website te verlaten. Cody behoudt zich het recht voor deze voorwaarden periodisch aan te passen waarna de leden op de hoogte zullen worden gebracht van deze wijzigingen. Wanneer u na deze kennisgeving de website blijft gebruiken verklaart u zich akkoord met de doorgevoerde wijzigingen. Cody Howest&nbsp; kan eventueel andere diensten aanbieden aan de gebruikers van deze site. In dat geval zullen de geldende voorwaarden apart worden medegedeeld.</span></p>\n<p><span><strong>2. Toegankelijkheid</strong></span></p>\n<p><span>Cody Howest&nbsp; probeert zo goed als mogelijk de website 24 uur per dag toegankelijk te houden, nochtans kan het gebeuren dat de website ontoegankelijk is voor een korte periode omwille van onderhoudswerken, aanpassingen of technische redenen.</span></p>\n<p><span><strong>3. Verantwoordelijkheid</strong></span></p>\n<p><span>Cody Howest weerlegt elke verantwoordelijkheid met betrekking tot deze website en de aangeboden informatie. Cody Howest&nbsp; verzekert niet dat de informatie op deze website correct, compleet of actueel is. Alle informatie, producten en diensten op deze website kunnen fouten bevatten. De gebruiker wordt verzocht hiermee rekening te houden.</span></p>\n<div><span><br /></span></div>'),
(5, 101, 'nl', 20, 'Y', 'T', 0, 'Content1', '<p style="text-align: center;">Ooit al eens één van deze gekken gezien?</p>\r\n<p style="text-align: center;">Je wil er wat meer over weten, kijk dan gerust even rond.</p>\r\n<p style="text-align: center;"><img title="groep" src="../data/images/33.jpg" alt="groep" width="660" height="440" /></p>'),
(6, 101, 'en', 10, 'N', 'T', 0, '', '<p>....</p>'),
(7, 1, 'nl', 10, 'Y', 'S', 0, 'phone', '050-705336'),
(8, 1, 'en', 10, 'Y', 'S', 0, 'phone', '050-705336'),
(9, 1, 'nl', 20, 'Y', 'S', 0, 'address', 'myStreet 007 - 54321 Bond City'),
(10, 1, 'en', 10, 'Y', 'S', 0, 'address', 'myStreet 007 - 54321 Bond City'),
(12, 157, 'nl', 10, 'Y', 'T', 0, 'Text', '<p>The first signs of "Bidden om Kracht" were seen during weekends when Filip Surmont and Peter Janssens went biking thru the Flemish polders (Picture below).</p>\r\n<p><br />After a few weekends Filip invited Johan Coppieters to come along "To bike to Damme and back". Which afterwards just seemed to be a lie to trick him in a far adventure, as the route went to Ostend and back, following the now so popular "Oostendse vaart". On that Sunday afternoon we did almost 30 km and were very excited about the fact we could conquer such a distance.</p>\r\n<p><br />Until then we estimated the distance we traveled by looking at road signs and carefuly measuring the distance on maps when we returned home. We calculated our speed by looking at our watches.</p>\r\n<p><br />We almost never drove one behind the other, as most of the trip was spend to talking. Filip who definetely had read some magazines, watched television and did some reading, suggested to try the real thing and drive one behind another. With this technique our average (calculated) speed went up.</p>\r\n<p style="text-align: center;"><img title="- FilipPeter" src="../data/images/35.jpg" alt="- FilipPeter" width="380" height="274" /></p>'),
(13, 158, 'nl', 10, 'Y', 'T', 0, 'Text', '<p>It was somewhere at this stage that Filip bought the first digital speedometer. Peter and Johan drove often alongside Filips bike to see at what an incredible speed we were driving. It was then that we discovered we sometimes could go as fast as 30 km/h (but not too long)</p>\r\n<p>In the beginning of this season we found a new companion Dominiek Lecoutere. After one trip we discovered that this was a major mistake: This guy could sustain speeds of 31, yes even, 32 km/h for more than a minute. From now on we always had to drive one behind another.</p>\r\n<p>By the end of this season everybody was equipped with a speedometer.</p>\r\n<p>Let''s not forget the incredible evenings in Dominiek''s bothers house. When we returned too early for his brother and had to wait to get in until all funny/erotic sounds stopped. Or when we waited for the next loempia to be ready in his 2 loempia-fritex.is technique our average (calculated) speed went up.</p>\r\n<p>We watched television while eating after a trip. Most popular where the comments on the Tour the France on television about Musseeuw. "Is het hem, ja hij is het, neen toch niet, ja daar komt hij dan toch, nee, nee....". Later in the season there were also the Olympics at Barcelona.</p>'),
(14, 160, 'nl', 10, 'Y', 'T', 0, 'Text', '<p>This year was our "Expansion year". First of all we welcomed Peter Balli&egrave;re, this guy still had a lot of training to do, but we were all to happy to wait for him, cause we needed the rest too, but couldn''t afford to show it. We also remember the coming of Johan Derycke, the first thing he said to us was: "What is your average speed" and "How often a week do you train". I''m sure some of us probably still wonder what the exact answer is.</p>\r\n<p>It was also the year when for the first time "mosselen" where served on an occasion at Johan''s place. Of course this was still possible in those times, not only due to the limited number of bikers, but mainly because our wives (for those who still had one) happy and willingly cooked for us.</p>\r\n<p>At this time we also remember the last meal ever at Peter''s apartment. With his famous crocque monsieurs served by Mich&egrave;le. Domi ate too much of them and of course, we were never invited afterwards.</p>\r\n<p>Later in the year we welcomed Mark Cabooter, our biggest mistake for sure, because this guy could at least go 5 km/h faster than anyone in the group, but moreover he could sustain these high speeds 5 times longer that we dreamed was possible those days.</p>\r\n<p>From this year on, we also had our own supplier of drugs (some say he is getting rich from selling to "Bidden om Kracht" members, who without his drugs wouldn''t be able to go as fast as they now do on Wednesday evenings): Gilbert Deleyn.</p>\r\n<p><br />We also had two extra bikers, actually dropouts of the football team: Peter-Jan Buytaert and Jacques Dombret. PeterJan would definetely get our level of conversations up during the years to come. An transition from football and biking to cut shaving and Knokke politics.</p>\r\n<p><br />At one of the trips we made this year, Lionel Fevery, father of Sabine Fevery, Johan''s wife, came to see what we all did on those Wednesday evenings. He brought along his own bike, a ordinary one with ordinary steering wheel, large thick tires and protective plates which covered the wheels (against rain and mud). The bike made an incredible noise, Lionel never changed gear, although he had 3 of them, but ... he followed Mark Cabooter during his maiden trip without loosing him once (which we all know is almost impossible). Later by fatigue he fell over a kind of bird and took half of the group down with him.</p>'),
(15, 161, 'nl', 10, 'Y', 'T', 0, 'Text', '<p>New this year was an entry from Gent: Paul-Philippe Schumacher. This guy specially drove every Wednesday to Brugge to bike with us. We were now know far beyond the boundaries of Brugges.</p>\r\n<p>Of course it was in this year that the classic "Marva" sprint was introduced when biking in "De Haan" at Paul Filip''s place.</p>\r\n<p>Any comments on this year will be very welcome, cause my mind is blank here.</p>\r\n<p>It was the year in which we first discovered the fine wine cellar of PeterJan on his first Lustrum party.</p>'),
(16, 162, 'nl', 10, 'Y', 'T', 0, 'Text', '<p>Weekend at the beginning of the season. Who did forget the psychological breakdown of Mark van Fleteren after 2 kilometers and his leaving the next morning wearing a tie ?</p>\r\n<p>Let''s remember this year as the year women were forbidden on the regular meetings of "Bidden om Kracht" and the team having their own outfit: HOT and WILD.</p>\r\n<p>There was a mountain bike weekend in Bouillon at the end of the season organized by Filip and Johan, including a mountain bike guide and strong guests such as Mario Huys.</p>'),
(17, 163, 'nl', 10, 'Y', 'T', 0, 'Text', '<p><br />Lustrum Party in "Het Choufke" in Knokke-Heist. Most important of this: We got sponsored and now all have a complete "Bidden voor Kracht" outfit including wind jacket and long pants. We''ll be thoughtful and mention our sponsors here: De Pr&egrave;tre Orthopeadics and Deloof Sport.</p>\r\n<p>New comers this year: Geert Decadt and Jan (Van An) Van Dooren.</p>\r\n<p>Weekend in Achouffe. Great stuff organized by Peter-Jan and Jacques.</p>\r\n<p>Quotation of the year: "Het zal vanavond niets meer zijn, want ik ben thuis".</p>'),
(18, 164, 'nl', 10, 'Y', 'T', 0, 'Text', '<ul>\r\n<li>The year we lost Peter B. to the Lotto team.</li>\r\n</ul>'),
(19, 165, 'nl', 10, 'Y', 'T', 0, 'Text', '<p><br />It''s official now, except for Alpe d''Huez, Peter B. will not be bicking this year and will make the Lotto team win the Tour de France. We all regret his departure, some will never recover, nobody can wait for Peter anymore, those concerned, understand !</p>\r\n<p>On the other hand, and even worse for the same people, we applaud the arrival of Herman Carette.. Even with his old bike, he can still keep up a decent conversation, while riding next the Marc C and not behind him as most of us...</p>\r\n<p>Quotation of the year: "Na deze 10 vette jaren, komen er 10 goede jaren" (PJB)</p>\r\n<p>New term: "Nog niet getraind hebben": Reeds meer dan 1000 km gefietst hebben in alle rust en anonimiteit, en het dan niet toegeven.</p>\r\n<p>Speed: This year seems to be the year of speed. In the beginning of the season we did an incredible average of 35 km/h, during a pretty long trip. This record was pulverised by the end of july with a new record 36.2 km average/h</p>\r\n<p>"De pineut": Johan De Rycke started this nice initiative, which was formerly done from time to time by Jacques, helping out leaders that can''t keep up with the sudden accelerations, staying with them, trying to bring them back into the group, reintegrating them, ...</p>\r\n<p>The year Jan VD left us for Maroc ?</p>'),
(20, 166, 'nl', 10, 'Y', 'T', 0, 'Text', '<p><br />Peter B. will be bicking again this year as a full "Bidden om kracht" member<br />As Ferdie Van den Houte told us during the RvV: "ienen van de Lotto van veur en ienen van achter"</p>\r\n<p>New BOK T-Shirts, Jackets, etc... sponsored by Glaxo-Wellcome.</p>\r\n<p>New technique of the year: "Clito Peeling" (PJB, who else ?)<br />New term of the year: "Clitometer" (Author ?)</p>\r\n<p>New term: "Niet bijtrainen": Biking 50 to 60 km during the weekends with a subgroup of "Bidden om Kracht"<br />Some even broke a few ribs, due to a fall after total exhaustion.</p>\r\n<p>New technique: "Warming up": Starting at 19h30, urging the group to start at 20h00 sharp, taking the lead at 50 km/h at 20h05 for at least 10 minutes. The exact purpose of this technique can probably be found in the need to make sure one has less opposition in the last kilometers. Luckily this technique was only used once this year (up until now!).</p>\r\n<p>New female cataloging (by, who else, PJB): <br />1) Women brought to you by your family.<br />2) Women with whom you fall in love.<br />3) Women that give pleasure.</p>\r\n<p>Special event at Geert''s ride: PJan almost lost his life (broken nose, etc, ...), <br />while Geert helped putting an extra lifeform onto Earth, could very well be the 6th bilion human being.</p>'),
(21, 167, 'nl', 10, 'Y', 'T', 0, 'Text', '<p><br />Niks speciaals gasten ?</p>\r\n<p>Of toch ?</p>\r\n<p>Ja, toch wel: "The lost son" uit Gent keerde terug, de echte vrienden waren toch zo echt niet meer, of waren ze enkel vettig....?</p>\r\n<p>En door interne en persoonlijke problemen, zullen we het gezelschap van PJB een tijdje moeten missen.</p>'),
(22, 168, 'nl', 10, 'Y', 'T', 0, 'Text', '<p>Toch wel een aantal gebeurtenissen dit jaar !</p>\r\n<p>Het jaar waarin onze Marokaanse afvaardiging besloot <br />om ook in China/Changhai een nederzetting te vestigen<br />en dit allemaal onder de noemer Jan Van Dooren</p>\r\n<p>En alsof dat niet genoeg was, <br />besliste onze voorzitter voor 2.5 jaar zijn echtgenote te volgen naar NY, <br />allen daarheen om de man bij te staan zou ik zeggen.</p>\r\n<p>Neen, we blijven niet stuurloos, de 3 stichtende leden zorgen voor een oplossing: <br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -Peter Janssens wordt als ondervoorzitter, waarnemend voorzitter.<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -Filip Surmont blijft voorzitter, maar voegt zijn functie enkel uit als raadgever.<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -Johan Coppieters staat als penningmeester en secretaris Peter in raad en daad bij.</p>\r\n<p>Of zoals onze kersverse voorzitter het uitdrukt in een mailtje:<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -Een triumviraat der oprichters klinkt goed.<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -Vooral het idee van een ondervoorzitter die waarnemend voorzitter wordt<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -bij afwezigheid van de enige echte Leider vind ik perfekt. <br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -Zo blijft Filip toch uiteindelijk de echte baas, ere wie ere toekomt. <br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -Ik voel mij dan ook wat zekerder als ik op tijd en stond wat uit de wind kan rijden achter &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; jullie schouders.</p>\r\n<p>En zo was het triumviraat geboren....</p>\r\n<p>Ondertussen liet de voorzitter weten, dat hij zijn weg gevonden heeft in NY en daar naarstig meetraint voor een of andere lokale RvV... We houden ons hart vast !</p>\r\n<p><img style="display: block; margin-left: auto; margin-right: auto;" title="- fietsenUS1" src="../data/images/36.jpg" alt="- fietsenUS1" width="500" height="334" /></p>'),
(23, 169, 'nl', 10, 'Y', 'T', 0, 'Text', '<p><br />''t Jaar is goed begonnen !</p>\r\n<p>Bij afwezigheid van onze voorzitter, hebben we direct enkele nieuwe leden aangenomen, aangezien er geen officiele sportkledij in deze maten meer beschikbaar was, hebben we dan maar wat geimproviseerd.</p>\r\n<p><img title="- Bodypainting" src="../data/images/38.jpg" alt="- Bodypainting" width="400" height="267" /></p>\r\n<p>Diezelfde voorzitter oefent zich en doet dus sport om zijn fysiek op peil te houden, per slot van rekening moet hij nog "mee" kunnen in augustus.</p>\r\n<p><img title="- vissen-ny" src="../data/images/39.jpg" alt="- vissen-ny" width="320" height="240" /></p>\r\n<p>J.D. komt terug boven "water" na alternatieve gewichtsvermindering&nbsp;</p>\r\n<pre>Verrast door de sympathieke, soms scalpelscherpe uitingen van vriendschap\r\nbewust van de nieuwsgierigheid van hen die zullen volgen,\r\nkan ik u het goede nieuws melden:\r\n\r\n- dat de piemel reeds meerdere malen zijn fierheid terug gevonden heeft\r\n- ik terug, evenwel op de stadsfiets, zit\r\n- in het WE meedoe aan een lokale wedstrijd\r\n  ''over de hoogste haag plassen''\r\n- straks de koersfiets hervat\r\n  om in augustus bij mij thuis,\r\n  niet te moeten onderdoen voor jullie geweld\r\nin velo veritas</pre>\r\n<p>Verslag van J.D. vanuit Gent.</p>\r\n<pre>een 3-tal weken terug, zit ik op de vrijdagmarkt te Gent, pinten te drinken met Patrick, onze Marokkogids\r\nHij vertelt me, dat eind vorig jaar, hij op trektocht moest met '' Te Voet'' naar Italie\r\ndaar hij last had van lage rugpijn, zoekt hij Phil op, die hem aanraadt foto''s te laten nemen bij een beroemde radioloog\r\nBijgevolg trekt hij naar Sijsele, waar volgende dialoog zich voordoet:\r\n \r\n"Dag Mevrouw, ik heb hier een afspraak met Dokter Flette\r\n \r\nWablief ? Wie da ?\r\n \r\nDokter Flette\r\n \r\nt''is hier geen dokter Flette\r\n \r\nallez, madam, ik kom speciaal van Gent voor dokter Flette, er moet hier nen dokter Flette zijn\r\nmijn huisarts heeft hem persoonlijk opgebeld, ik stond er bij, en zijn naam is Flette\r\n \r\nmaar meneer, als ik zeg dat er hier geen dokter Flette is , dan is dat zo\r\nik ken ze allemaal, en er is hier geen dokter Flette\r\n \r\nik moet hier foto''s laten nemen van mijn rugge bij dokter Flette\r\n \r\nge moet dus bij radiologie zijn , maar van de drie radiologen is er niemand die Flette noemt\r\nwel iemand die Van Fleteren heet\r\n \r\nen is da iemand die een beetje rond is, allez een beetje streus, allez gene magere ?\r\n.........."</pre>\r\n<p>&nbsp;</p>'),
(24, 170, 'nl', 10, 'Y', 'T', 0, 'Text', '<h2>Groot Nieuws</h2>\r\n<p><img style="float: right;" title="- FS_App" src="../data/images/40.jpg" alt="- FS_App" width="399" height="266" />Allicht worden vanaf nu alle pseudo schrijvers bij BOK een stukje van hun taak ontlast: Er is namelijk na 6 jaar een nieuw lid! Bij deze verwelkomen we Hans Vandeweghe.</p>\r\n<p>Een consensus werd bereikt na een zeer drukke beraadslaging in de Antwerpse Kempen over "Mag de groep groeien of niet" (zie ook aanpassing in de statuten, zeker lezen). Eens dit gestemd, was het nieuwe lidmaatschap van Hans een formaliteit.</p>\r\n<p>Ook dit jaar zijn we jaloers op de afwezigheid van de voorzitter - grote leider. Enkele leden brachten een bezoek en konden zien dat het nog erger was dan ze dachten. Om het leed te delen, hieronder het zicht&nbsp;vanop de man zijn appartement.</p>\r\n<p>In meatmarket een uitgebreide brunch met Sabine, Roos en Johan.</p>\r\n<p><img title="- FS_en_JC" src="../data/images/41.jpg" alt="- FS_en_JC" width="400" height="265" /></p>\r\n<p><strong><span>Met een pintje op hetzelfde appartment. Anna stelde perfect de belichting in, desondanks zat ze met een vreemde lichtreflectie rond Marc''s hoofd....</span></strong></p>\r\n<p><strong><img title="- FS_en_MV" src="../data/images/42.jpg" alt="- FS_en_MV" width="320" height="213" /></strong></p>\r\n<p>&nbsp;</p>\r\n<h2>Bodywarmers</h2>\r\n<p>Met de opbrengst van de tijdrit werd voor iedereen een bodywarmer gekocht met hierop het logo van BoK geborduurd En ja, er is er ook eentje voor Hans.</p>\r\n<h2>Nieuwjaarsreceptie</h2>\r\n<p><img style="float: right;" title="- NR2004-1" src="../data/images/43.jpg" alt="- NR2004-1" width="252" height="320" />De jaarlijkse receptie was fantastisch, alle leden waren aanwezig. <br />Jan VD via een opgestuurde foto, waarop hij samen met zijn echtgenote hun laatste flashy outfit showt.<br />Filip S die zijn <a href="speech04">nieuwjaarsspeech</a> gaf via iChat (videoconferencing), bijgestaan door zijn bevallige assistente, die tevens de kousen van een nieuwe ijscreme sponsor demonstreerde. We uiten nog even onze dankbaarheid: deze Newyorkezen waren bereid om om 5u30 AM al de clown uit te hangen. We hebben de skyline van NY blijven bewonderen op het scherm tot het klaar werd.<br />Toen iedereen weg was, kiekten we snel met de GSM nog de voorzitter die zijn deel van de "opruim" voor zijn rekening nam.</p>\r\n<p><img title="- NR2004-2" src="../data/images/44.jpg" alt="- NR2004-2" width="320" height="240" /></p>\r\n<p><span>We herinneren ons ook nog sommigen hun nieuwjaarswensen: Moge de beste winnen.</span></p>\r\n<h2><span>Waarschuwing uit NY</span></h2>\r\n<p><img style="float: right;" title="- Benn-jerry" src="../data/images/45.jpg" alt="- Benn-jerry" width="286" height="240" />Voor de slechte verstaanders en de weerbarstigen : onderstaande pot vanille ijs is vanaf 2004 verplichte kost in de BOK-rijder''s diepvries... Een Vlaamse of Amerikaanse controleur kan op elk moment opduiken : wees voorzienig<br />Uw Phil from Hoboken is watching you!</p>'),
(25, 171, 'nl', 10, 'Y', 'T', 0, 'Text', '<h2>Christo - The Gates - BOK</h2>\r\n<p><img style="float: right;" title="- bok-gates1" src="../data/images/46.jpg" alt="- bok-gates1" width="240" height="320" />Berichtgeving van onze vertegenwoordiger ter plaatse:<br />"In navolging van het Bidden om Kracht uniform koos Christo ook voor saffraan (regel 1: zeg nooit oranje tegen saffraan). Wij danken hem voor deze hommage."</p>\r\n<p><span data-mce-mark="1">Voor zij die alle foto''s willen zien, willen we nog deze commentaar van dezelfde BOK vertegewoordiger in New York vermelden: Spring op het vliegtuig en kom af!!&nbsp;</span></p>\r\n<p><img title="- bok-gates2" src="../data/images/47.jpg" alt="- bok-gates2" width="250" height="240" /></p>'),
(26, 172, 'nl', 10, 'Y', 'T', 0, 'Text', '<p>Voor het eerst fietsen bij de voorzitter in Brussel. Andere foto''s later op de avond genomen waren niet voor publicatie vatbaar... Enerzijds waren er radiologie foto''s -Arme Johan DR ging op een zeer onveilig wegdek onderuit- die we wegens medisch geheim niet kunnen tonen, anderzijds was er een foto....<img style="display: block; margin-left: auto; margin-right: auto;" title="- bok-in-bxl" src="../data/images/48.jpg" alt="- bok-in-bxl" width="750" height="500" /></p>'),
(28, 174, 'nl', 10, 'Y', 'T', 0, 'Text', '<p style="text-align: center;"><img title="- speech" src="../data/images/49.gif" alt="- speech" width="500" height="787" /></p>'),
(29, 1, 'nl', 30, 'N', 'S', 0, 'footer.first', ''),
(30, 1, 'nl', 50, 'N', 'S', 0, 'footer.second', '&copy; Dieter Beelaert - Made with'),
(31, 1, 'nl', 40, 'N', 'S', 0, 'footer.third', '<a href="http://www.cody-cms.org"><img src="../static/images/footer.png"></a>'),
(32, 1, 'en', 30, 'N', 'S', 0, 'footer.first', ''),
(33, 1, 'en', 50, 'N', 'S', 0, 'footer.second', '&copy; Dieter Beelaert - Made with'),
(34, 1, 'en', 40, 'N', 'S', 0, 'footer.third', '<a href="http://www.cody-cms.org"><img src="../static/images/footer.png"></a>'),
(35, 101, 'nl', 10, 'Y', 'S', 0, 'String', '<section id="introContent">'),
(36, 101, 'nl', 30, 'Y', 'S', 0, 'String', '</section>\r\n<script>\r\n$.ajax({\r\n                         type: "GET",\r\n                         url: "http://localhost:3000/bok/nl/Calendar",\r\n                         data: {request: "futureappointments", count: 20},\r\n                         dataType: "html",\r\n                         success: function(html){\r\n                             $("div#eventList").html(html);\r\n                         },\r\n                         error: function(){\r\n\r\n                          }\r\n                        });\r\n</script>\r\n<div id="eventList"></div>');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `domains`
--

CREATE TABLE IF NOT EXISTS `domains` (
  `id` varchar(32) NOT NULL DEFAULT '',
  `name` varchar(32) DEFAULT '?'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gegevens worden uitgevoerd voor tabel `domains`
--

INSERT INTO `domains` (`id`, `name`) VALUES
('admin', 'Admin'),
('cms', 'CMS Users'),
('user', 'Users'),
('user', 'Users');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `items`
--

CREATE TABLE IF NOT EXISTS `items` (
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=177 ;

--
-- Gegevens worden uitgevoerd voor tabel `items`
--

INSERT INTO `items` (`id`, `name`, `parent`, `user`, `template`, `orderby`, `sortorder`, `dated`, `validfrom`, `validto`, `showcontent`, `needslogin`, `defaultrequest`, `alloweddomains`) VALUES
(1, 'Website', -1, 1, 100, 'M', 100, '2010-01-01', '2010-01-01 00:00:00', '2100-01-01 00:00:00', 'S', NULL, 'list', ''),
(2, 'Login', 3, 1, 2, 'A', 99, '2010-01-01', '2010-01-01 00:00:00', '2100-01-01 00:00:00', 'Y', 'N', '', ''),
(3, 'Pages', -1, 1, 100, 'M', 0, '2010-01-01', '2010-01-01 00:00:00', '2100-01-01 00:00:00', 'Y', 'Y', '', ''),
(4, 'Footer', -1, 1, 100, 'M', 0, '2010-01-01', '2010-01-01 00:00:00', '2100-01-01 00:00:00', 'Y', 'Y', '', ''),
(9, 'Dashboard', -1, 1, 9, 'M', 0, '2010-01-01', '2010-01-01 00:00:00', '2100-01-01 00:00:00', 'Y', 'Y', '', ''),
(10, 'CMS', 9, 1, 2, 'M', 10, '2010-01-01', '2010-01-01 00:00:00', '2100-01-01 00:00:00', 'S', 'Y', '', ''),
(11, 'CMS - Page', 10, 1, 11, 'A', 10, '2010-01-01', '2010-01-01 00:00:00', '2100-01-01 00:00:00', 'Y', 'Y', '', ''),
(12, 'CMS - Images', 10, 1, 12, 'A', 20, '2010-01-01', '2010-01-01 00:00:00', '2100-01-01 00:00:00', 'Y', 'Y', '', ''),
(13, 'CMS - Files', 10, 1, 13, 'A', 30, '2010-01-01', '2010-01-01 00:00:00', '2100-01-01 00:00:00', 'Y', 'Y', '', ''),
(14, 'CMS - Forms', 10, 1, 14, 'A', 40, '2010-01-01', '2010-01-01 00:00:00', '2100-01-01 00:00:00', 'Y', 'Y', '', ''),
(15, 'CMS - Users', 10, 1, 15, 'A', 50, '2010-01-01', '2010-01-01 00:00:00', '2100-01-01 00:00:00', 'Y', 'Y', 'list', ''),
(16, 'CMS - Templates', 10, 1, 16, 'A', 60, '2010-01-01', '2010-01-01 00:00:00', '2100-01-01 00:00:00', 'Y', 'Y', 'list', ''),
(17, 'CMS - System', 10, 1, 17, 'A', 70, '2010-01-01', '2010-01-01 00:00:00', '2100-01-01 00:00:00', 'Y', 'Y', '', ''),
(97, 'Privacy Verklaring', 4, 1, 100, 'A', 0, '2010-01-01', '2010-01-01 00:00:00', '2100-01-01 00:00:00', 'Y', 'N', '', ''),
(98, 'Disclaimer', 4, 1, 100, 'A', 0, '2010-01-01', '2010-01-01 00:00:00', '2100-01-01 00:00:00', 'Y', 'N', '', ''),
(99, 'Global', 3, 1, 100, 'A', 0, '2010-01-01', '2010-01-01 00:00:00', '2100-01-01 00:00:00', 'Y', 'N', '', ''),
(101, 'First page', 1, 1, 100, 'M', 10, '2010-01-01', '2010-01-01 00:00:00', '2100-01-01 00:00:00', 'Y', NULL, 'list', ''),
(150, 'events', 3, 1, 104, 'A', 99, '2010-01-01', '2010-01-01 00:00:00', '2100-01-01 00:00:00', 'Y', 'N', '', ''),
(152, 'New item', 1, 1, 100, 'A', 70, '2013-07-23', '2013-07-23 00:00:00', '2101-01-31 00:00:00', 'Y', 'Y', 'list', ''),
(153, 'New item', 1, 1, 105, 'A', 40, '2013-07-23', '2013-07-23 00:00:00', '2101-01-31 00:00:00', 'Y', 'Y', 'list', ''),
(154, 'New item', 1, 1, 100, 'M', 50, '2013-07-23', '2013-07-23 00:00:00', '2101-01-31 00:00:00', 'S', 'Y', 'list', ''),
(156, 'New item', 1, 1, 106, 'M', 60, '2013-08-13', '2013-08-13 00:00:00', '2101-01-31 00:00:00', 'Y', NULL, 'list', ''),
(157, 'New item', 154, 1, 100, 'A', 100, '2013-08-17', '2013-08-17 00:00:00', '2101-01-31 00:00:00', 'Y', 'Y', 'list', ''),
(158, 'New item', 154, 1, 100, 'A', 90, '2013-08-17', '2013-08-17 00:00:00', '2101-01-31 00:00:00', 'Y', 'Y', 'list', ''),
(160, 'New item', 154, 1, 100, 'M', 80, '2013-08-17', '2013-08-17 00:00:00', '2101-01-31 00:00:00', 'Y', 'Y', 'list', ''),
(161, 'New item', 154, 1, 100, 'M', 70, '2013-08-17', '2013-08-17 00:00:00', '2101-01-31 00:00:00', 'Y', 'Y', 'list', ''),
(162, 'New item', 154, 1, 100, 'M', 60, '2013-08-17', '2013-08-17 00:00:00', '2101-01-31 00:00:00', 'Y', 'Y', 'list', ''),
(163, 'New item', 154, 1, 100, 'M', 50, '2013-08-17', '2013-08-17 00:00:00', '2101-01-31 00:00:00', 'Y', 'Y', 'list', ''),
(164, 'New item', 154, 1, 100, 'M', 40, '2013-08-17', '2013-08-17 00:00:00', '2101-01-31 00:00:00', 'Y', 'Y', 'list', ''),
(165, 'New item', 154, 1, 100, 'M', 30, '2013-08-17', '2013-08-17 00:00:00', '2101-01-31 00:00:00', 'Y', 'Y', 'list', ''),
(166, 'New item', 154, 1, 100, 'M', 20, '2013-08-17', '2013-08-17 00:00:00', '2101-01-31 00:00:00', 'Y', 'Y', 'list', ''),
(167, 'New item', 154, 1, 100, 'M', 10, '2013-08-17', '2013-08-17 00:00:00', '2101-01-31 00:00:00', 'Y', 'Y', 'list', ''),
(168, 'New item', 154, 1, 100, 'M', 5, '2013-08-17', '2013-08-17 00:00:00', '2101-01-31 00:00:00', 'Y', 'Y', 'list', ''),
(169, 'New item', 154, 1, 100, 'M', 5, '2013-08-17', '2013-08-17 00:00:00', '2101-01-31 00:00:00', 'Y', 'Y', 'list', ''),
(170, 'New item', 154, 1, 100, 'M', 5, '2013-08-17', '2013-08-17 00:00:00', '2101-01-31 00:00:00', 'Y', 'Y', 'list', ''),
(171, 'New item', 154, 1, 100, 'M', 5, '2013-08-17', '2013-08-17 00:00:00', '2101-01-31 00:00:00', 'Y', 'Y', 'list', ''),
(172, 'New item', 154, 1, 100, 'M', 5, '2013-08-17', '2013-08-17 00:00:00', '2101-01-31 00:00:00', 'Y', 'Y', 'list', ''),
(174, 'New item', 1, 1, 100, 'M', 30, '2013-08-17', '2013-08-17 00:00:00', '2101-01-31 00:00:00', 'Y', NULL, 'list', '');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `languages`
--

CREATE TABLE IF NOT EXISTS `languages` (
  `id` varchar(4) NOT NULL DEFAULT '',
  `name` varchar(32) DEFAULT '',
  `sortorder` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gegevens worden uitgevoerd voor tabel `languages`
--

INSERT INTO `languages` (`id`, `name`, `sortorder`) VALUES
('en', 'English', 1),
('nl', 'Nederlands', 2);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `levels`
--

CREATE TABLE IF NOT EXISTS `levels` (
  `id` int(11) DEFAULT NULL,
  `name` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gegevens worden uitgevoerd voor tabel `levels`
--

INSERT INTO `levels` (`id`, `name`) VALUES
(2, 'user'),
(50, 'admin'),
(99, 'super');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `pages`
--

CREATE TABLE IF NOT EXISTS `pages` (
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

--
-- Gegevens worden uitgevoerd voor tabel `pages`
--

INSERT INTO `pages` (`item`, `language`, `title`, `link`, `active`, `keywords`, `description`, `created`, `updated`) VALUES
(1, 'en', 'Website', 'welcome', 'Y', '', '', '2010-01-01 00:00:00', '2013-01-23 10:40:29'),
(1, 'nl', 'Website', 'welcome', 'Y', '', '', '2010-01-01 00:00:00', '2013-08-18 19:26:16'),
(2, 'en', 'Login', 'login', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(2, 'nl', 'Login', 'login', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(3, 'en', 'Pages', '', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(3, 'nl', 'Pages', '', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(4, 'en', 'Footer', '', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(4, 'nl', 'Footer', '', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(9, 'en', 'Dashboard', 'dashboard', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(9, 'nl', 'Dashboard', 'dashboard', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(10, 'en', 'Website CMS', 'cms', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(10, 'nl', 'Website CMS', 'cms', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(11, 'en', 'Structure', 'pages', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(11, 'nl', 'Structuur', 'pages', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(12, 'en', 'Images', 'images', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(12, 'nl', 'Beelden', 'images', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(13, 'en', 'Files', 'files', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(13, 'nl', 'Bestanden', 'files', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(14, 'en', 'Forms', 'forms', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(14, 'nl', 'Formulieren', 'forms', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(15, 'en', 'Users', 'users', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(15, 'nl', 'Gebruikers', 'users', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(16, 'en', 'Templates', 'templates', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(16, 'nl', 'Sjablonen', 'templates', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(17, 'en', 'System', 'system', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(17, 'nl', 'Systeem', 'system', 'Y', '', '', '2010-01-01 00:00:00', '2010-01-01 00:00:00'),
(97, 'en', 'Privacy', 'privacy', 'Y', '', '', '2010-01-01 00:00:00', '2013-03-19 09:30:30'),
(97, 'nl', 'Privacy Verklaring', 'privacy', 'Y', '', '', '2010-01-01 00:00:00', '2013-03-19 09:30:30'),
(98, 'en', 'Disclaimer', 'disclaimer', 'Y', '', '', '2010-01-01 00:00:00', '2012-08-20 17:09:50'),
(98, 'nl', 'Disclaimer', 'disclaimer', 'Y', '', '', '2010-01-01 00:00:00', '2012-08-20 17:09:50'),
(99, 'en', 'Global', 'global', 'Y', '', '', '2010-01-01 00:00:00', '2012-08-15 22:02:59'),
(99, 'nl', 'Global', 'global', 'Y', '', '', '2010-01-01 00:00:00', '2012-08-15 22:02:59'),
(101, 'en', 'First page', 'first', 'Y', '', '', '2010-01-01 00:00:00', '2012-08-28 09:39:37'),
(101, 'nl', 'Home', 'home', 'Y', '', '', '2010-01-01 00:00:00', '2013-08-22 16:45:05'),
(152, 'en', 'New item', '', 'Y', '', '', '2013-07-23 15:04:03', '2013-07-23 15:04:03'),
(152, 'nl', 'Info', '', 'Y', '', '', '2013-07-23 15:04:03', '2013-07-24 15:08:10'),
(153, 'en', 'New item', '', 'Y', '', '', '2013-07-23 15:04:09', '2013-07-23 15:04:09'),
(153, 'nl', 'Agenda', 'Calendar', 'Y', '', '', '2013-07-23 15:04:09', '2013-08-22 16:34:25'),
(154, 'en', 'New item', '', 'Y', '', '', '2013-07-23 15:04:16', '2013-07-23 15:04:16'),
(154, 'nl', 'Geschiedenis', '', 'Y', '', '', '2013-07-23 15:04:17', '2013-08-17 16:29:57'),
(156, 'en', 'New item', '', 'Y', '', '', '2013-08-13 15:15:39', '2013-08-13 15:15:39'),
(156, 'nl', 'Ledenlijst', 'members', 'Y', '', '', '2013-08-13 15:15:39', '2013-08-13 15:16:08'),
(157, 'en', 'New item', '', 'Y', '', '', '2013-08-17 15:45:20', '2013-08-17 15:45:20'),
(157, 'nl', '1991', '', 'Y', '', '', '2013-08-17 15:45:20', '2013-08-17 15:54:48'),
(158, 'en', 'New item', '', 'Y', '', '', '2013-08-17 15:55:25', '2013-08-17 15:55:25'),
(158, 'nl', '1992', '', 'Y', '', '', '2013-08-17 15:55:25', '2013-08-17 16:04:55'),
(160, 'en', 'New item', '', 'Y', '', '', '2013-08-17 16:18:41', '2013-08-17 16:18:41'),
(160, 'nl', '1993', '', 'Y', '', '', '2013-08-17 16:18:41', '2013-08-17 16:23:07'),
(161, 'en', 'New item', '', 'Y', '', '', '2013-08-17 16:24:12', '2013-08-17 16:24:12'),
(161, 'nl', '1994', '', 'Y', '', '', '2013-08-17 16:24:12', '2013-08-17 16:24:38'),
(162, 'en', 'New item', '', 'Y', '', '', '2013-08-17 16:25:27', '2013-08-17 16:25:27'),
(162, 'nl', '1995', '', 'Y', '', '', '2013-08-17 16:25:27', '2013-08-17 16:25:38'),
(163, 'en', 'New item', '', 'Y', '', '', '2013-08-17 16:25:58', '2013-08-17 16:25:58'),
(163, 'nl', '1996', '', 'Y', '', '', '2013-08-17 16:25:58', '2013-08-17 16:26:09'),
(164, 'en', 'New item', '', 'Y', '', '', '2013-08-17 16:26:58', '2013-08-17 16:26:58'),
(164, 'nl', '1997', '', 'Y', '', '', '2013-08-17 16:26:58', '2013-08-17 16:27:22'),
(165, 'en', 'New item', '', 'Y', '', '', '2013-08-17 16:27:59', '2013-08-17 16:27:59'),
(165, 'nl', '1998', '', 'Y', '', '', '2013-08-17 16:27:59', '2013-08-17 16:28:11'),
(166, 'en', 'New item', '', 'Y', '', '', '2013-08-17 16:28:52', '2013-08-17 16:28:52'),
(166, 'nl', '1999', '', 'Y', '', '', '2013-08-17 16:28:52', '2013-08-17 16:29:07'),
(167, 'en', 'New item', '', 'Y', '', '', '2013-08-17 16:29:40', '2013-08-17 16:29:40'),
(167, 'nl', '2000', '', 'Y', '', '', '2013-08-17 16:29:40', '2013-08-17 16:29:50'),
(168, 'en', 'New item', '', 'Y', '', '', '2013-08-17 16:30:51', '2013-08-17 16:30:51'),
(168, 'nl', '2002', '', 'Y', '', '', '2013-08-17 16:30:51', '2013-08-17 16:34:38'),
(169, 'en', 'New item', '', 'Y', '', '', '2013-08-17 16:42:55', '2013-08-17 16:42:55'),
(169, 'nl', '2003', '', 'Y', '', '', '2013-08-17 16:42:56', '2013-08-17 16:47:37'),
(170, 'en', 'New item', '', 'Y', '', '', '2013-08-17 16:47:55', '2013-08-17 16:47:55'),
(170, 'nl', '2004', '', 'Y', '', '', '2013-08-17 16:47:55', '2013-08-17 19:27:03'),
(171, 'en', 'New item', '', 'Y', '', '', '2013-08-17 19:18:37', '2013-08-17 19:18:37'),
(171, 'nl', '2005', '', 'Y', '', '', '2013-08-17 19:18:37', '2013-08-17 19:21:19'),
(172, 'en', 'New item', '', 'Y', '', '', '2013-08-17 19:21:41', '2013-08-17 19:21:41'),
(172, 'nl', '2006', '', 'Y', '', '', '2013-08-17 19:21:41', '2013-08-17 19:24:01'),
(174, 'en', 'New item', '', 'Y', '', '', '2013-08-17 19:29:23', '2013-08-17 19:29:23'),
(174, 'nl', 'speech04', 'speech04', 'N', '', '', '2013-08-17 19:29:23', '2013-08-17 19:30:00');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `templates`
--

CREATE TABLE IF NOT EXISTS `templates` (
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=108 ;

--
-- Gegevens worden uitgevoerd voor tabel `templates`
--

INSERT INTO `templates` (`id`, `name`, `description`, `controller`, `fn`, `allowedtemplates`, `maxnumber`, `system`, `defaultchild`) VALUES
(2, 'Login', '', 'LoginController', '-/login.ejs', '', 0, 'Y', 0),
(9, 'Dashboard', '', 'DashboardController', '-/cms/dashboard.ejs', '', 0, 'Y', 0),
(11, 'CMS-Page', '', 'PageController', '-/cms/pages.ejs', '', 0, 'Y', 0),
(12, 'CMS-Images', '', 'ImageController', '-/cms/images.ejs', '', 0, 'Y', 0),
(13, 'CMS-Files', '', 'FileController', '-/cms/files.ejs', '', 0, 'Y', 0),
(14, 'CMS-Forms', '', 'FormController', '-/cms/forms.ejs', '', 0, 'Y', 0),
(15, 'CMS-Users', '', 'UserController', '-/cms/users.ejs', '', 0, 'Y', 0),
(16, 'CMS-Templates', '', 'TemplateController', '-/cms/templates.ejs', '', 0, 'Y', 0),
(17, 'CMS-System', '', 'SystemController', '', '', 0, 'Y', 0),
(100, 'Content', '', 'ContentController', 'index.ejs', '', 999, 'N', 100),
(105, 'Calendar', '', 'CalendarController', 'calendar-month.ejs', '', 10, 'N', 101),
(106, 'Userlist', 'Add some social options to your cody website', 'SocialuserController', 'userlist.ejs', '', 10, 'N', 101),
(107, 'ExportCalendar', '', 'ExportController', 'noview.ejs', '', 0, 'Y', 0);

-- content template holder for Content page
insert into content values (0,-100,'*',99,'N','C',0,'Upcoming','10');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `users`
--

CREATE TABLE IF NOT EXISTS `users` (
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=28 ;

--
-- Gegevens worden uitgevoerd voor tabel `users`
--

INSERT INTO `users` (`id`, `username`, `name`, `password`, `domain`, `level`, `badlogins`, `maxbadlogins`, `active`, `email`, `note`, `nomail`, `sortorder`) VALUES
(1, 'rsuper', 'rWorks Super', 'akitest', 'rWorks', 99, 0, 99, 'Y', 'johan577@mac.com', '', 'N', 0),
(2, 'radmin', 'rWorks Admin', 'akitest', 'rWorks', 50, 0, 99, 'Y', 'johan577@mac.com', '', 'N', 0),
(3, 'rtest', 'rWorks Test', 'akitest', 'rWorks', 2, 0, 99, 'Y', 'johan577@mac.com', '', 'N', 0),
(9, 'codyweb', 'Cody User', 'ydoc', 'user', 50, 0, 99, 'Y', 'cody@cody.com', '', 'N', 0),
(11, 'user', 'Mr. User Vaneigens', 'user', 'users', 50, 0, 99, 'Y', 'user@cody-cms.be', '', 'N', 10),
(12, 'FSurmont', 'Filip Surmont', 'FSurmont', 'users', 50, 0, 99, 'Y', '', '', 'N', 10),
(13, 'PJanssens', 'Peter Janssens', 'PJanssens', 'users', 50, 0, 99, 'Y', '', '', 'N', 10),
(14, 'JCoppieters', 'Johan Coppieters', 'JCoppieters', 'users', 50, 0, 99, 'Y', 'johan577@mac.com', '', 'N', 10),
(15, 'DLecoutere', 'Dominiek Lecoutere', 'DLecoutere', 'users', 50, 0, 99, 'Y', '', '', 'N', 10),
(16, 'PBallière', 'Peter Ballieère', 'PBallieère', 'users', 50, 0, 99, 'Y', '', '', 'N', 10),
(17, 'JDeRycke', 'Johan De Rycke', 'JDeRycke', 'users', 50, 0, 99, 'Y', '', '', 'N', 10),
(18, 'MCabooter', 'Marc Cabooter', 'MCabooter', 'users', 50, 0, 99, 'Y', '', '', 'N', 10),
(19, 'GDeleyn', 'Gelbert Deleyn', 'GDeleyn', 'users', 50, 0, 99, 'Y', '', '', 'N', 10),
(20, 'JDombret', 'Jacques Dombret', 'JDombret', 'users', 50, 0, 99, 'Y', '', '', 'N', 10),
(21, 'LFevery', 'Lionel Fevery', 'LFevery', 'users', 50, 0, 99, 'Y', '', '', 'N', 10),
(22, 'MVanfleteren', 'Mark Vanfleteren', 'MVanfleteren', 'users', 50, 0, 99, 'Y', '', '', 'N', 10),
(23, 'PPSchumacher', 'Paul-Phillipe Schumacher', 'PPSchumacher', 'users', 50, 0, 99, 'Y', '', '', 'N', 10),
(24, 'JVDooren', 'Jan Van Dooren', 'JVDooren', 'users ', 50, 0, 99, 'Y', '', '', 'N', 10),
(25, 'GDecadt', 'Geert Decadt', 'GDecadt', 'users', 50, 0, 99, 'Y', '', '', 'N', 10),
(26, 'HCarrette', 'Herman Carrette', 'HCarrette', 'users', 50, 0, 99, 'Y', '', '', 'N', 10),
(27, 'HVandeweghe', 'Hans Vandeweghe', 'HVandeweghe', 'users ', 50, 0, 99, 'Y', '', '', 'N', 10);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `user_info`
--

CREATE TABLE IF NOT EXISTS `user_info` (
  `id` int(11) NOT NULL,
  `info` text,
  `Street` varchar(100) DEFAULT NULL,
  `number` varchar(20) DEFAULT NULL,
  `zip` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `userFunction` varchar(45) DEFAULT NULL,
  `telephone` varchar(45) DEFAULT NULL,
  `since` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gegevens worden uitgevoerd voor tabel `user_info`
--

INSERT INTO `user_info` (`id`, `info`, `Street`, `number`, `zip`, `city`, `userFunction`, `telephone`, `since`) VALUES
(11, 'I''m just a test user, after this is completed I will be deleted !!', 'fakestreet', '123', '888', 'Somewhere', 'Test user', '999', NULL),
(12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1991),
(13, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1991),
(14, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1991),
(15, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1992),
(16, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1993),
(17, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1993),
(18, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1993),
(19, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1993),
(20, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1993),
(21, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1993),
(22, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1993),
(23, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1994),
(24, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1996),
(25, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1996),
(26, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1998),
(27, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2004);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `user_message`
--

CREATE TABLE IF NOT EXISTS `user_message` (
  `messageId` int(11) NOT NULL AUTO_INCREMENT,
  `user_from` int(11) NOT NULL,
  `user_to` int(11) NOT NULL,
  `message` text NOT NULL,
  `timestamp` datetime NOT NULL,
  PRIMARY KEY (`messageId`),
  KEY `fk_user_message_from_idx` (`user_from`),
  KEY `fk_user_message_to_idx` (`user_to`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Gegevens worden uitgevoerd voor tabel `user_message`
--

INSERT INTO `user_message` (`messageId`, `user_from`, `user_to`, `message`, `timestamp`) VALUES
(7, 1, 11, 'Vergeet niet je persoonlijke gegevens aan te vullen !!', '2013-08-13 15:26:09'),
(8, 11, 11, 'Sending a message to myself', '2013-08-13 16:35:54'),
(9, 1, 11, 'Vul de nodige data aan aub !!', '2013-08-13 17:12:24');

--
-- Beperkingen voor gedumpte tabellen
--

--
-- Beperkingen voor tabel `appointment`
--
ALTER TABLE `appointment`
  ADD CONSTRAINT `fkuser_appointment` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `appointmentcomment`
--
ALTER TABLE `appointmentcomment`
  ADD CONSTRAINT `fk_comment_appointment` FOREIGN KEY (`appointmentId`) REFERENCES `appointment` (`idappointment`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_comment_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `user_info`
--
ALTER TABLE `user_info`
  ADD CONSTRAINT `fk_user_user_info` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Beperkingen voor tabel `user_message`
--
ALTER TABLE `user_message`
  ADD CONSTRAINT `fk_user_message_from` FOREIGN KEY (`user_from`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_message_to` FOREIGN KEY (`user_to`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
