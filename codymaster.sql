set names utf8;
/*!40101 SET NAMES utf8 */;

CREATE DATABASE cody DEFAULT CHARSET=utf8;
USE cody;
grant all privileges on cody.* to 'cody'@'localhost';
grant all privileges on cody.* to 'cody'@'%';

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


--
-- Databank: `cody`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `websites`
--

CREATE TABLE IF NOT EXISTS `websites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `version` char(100) NOT NULL,
  `defaultlanguage` varchar(2) NOT NULL,
  `dbuser` varchar(100) NOT NULL,
  `dbpassword` varchar(100) NOT NULL,
  `dbhost` varchar(100) NOT NULL,
  `datapath` varchar(200) NOT NULL,
  `db` varchar(100) NOT NULL,
  `customcontrollers` varchar(3000) NOT NULL,
   `active` char(1) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Gegevens worden uitgevoerd voor tabel `websites`
--

INSERT INTO `websites` (`id`, `name`, `version`, `dbuser`, `dbpassword`, `dbhost`, `datapath`, `db`, `customcontrollers`) VALUES
(1, 'essen', 'v0.1a1', 'cody', 'ydoc', 'localhost', '/usr/local/data/essen', 'essen', 'AgendaController,BookingController'),
(2, 'empty', 'v0.1a1', 'cody', 'ydoc', 'localhost', '/usr/local/data/empty', 'empty', ''),
(3, 'codyweb', 'v0.1a1', 'cody', 'ydoc', 'localhost', '/usr/local/data/codyweb', 'codyweb', '');
update websites set active='Y';

create unique index nameIndex on cody.websites(name);
