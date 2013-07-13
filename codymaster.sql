CREATE DATABASE cody;
USE cody;
grant all privileges on cody.* to 'cody'@'localhost';
grant all privileges on cody.* to 'cody'@'%';

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

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
  `version` varchar(100) NOT NULL,
  `dbuser` varchar(100) NOT NULL,
  `dbpassword` varchar(100) NOT NULL,
  `dbhost` varchar(100) NOT NULL,
  `datapath` varchar(200) NOT NULL,
  `db` varchar(100) NOT NULL,
  `customcontrollers` varchar(3000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Gegevens worden uitgevoerd voor tabel `websites`
--

INSERT INTO `websites` (`id`, `name`, `version`, `dbuser`, `dbpassword`, `dbhost`, `datapath`, `db`, `customcontrollers`) VALUES
(1, 'essen', 'v0.1a1', 'cody', 'ydoc', 'localhost', '/usr/local/data/essen', 'essen', 'AgendaController,BookingController'),
(2, 'empty', 'v0.1a1', 'cody', 'ydoc', 'localhost', '/usr/local/data/empty', 'empty', ''),
(3, 'codyweb', 'v0.1a1', 'cody', 'ydoc', 'localhost', '/usr/local/data/codyweb', 'codyweb', '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
