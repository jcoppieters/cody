CREATE DATABASE cody;
USE cody;

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
  `active` char(1) NOT NULL,
  `hostname` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;


INSERT INTO `websites` (`id`, `name`, `version`, `dbuser`, `dbpassword`, `dbhost`, `datapath`, `db`, `customcontrollers`, `active`, `hostname`) VALUES
(1, 'essen', 'v0.1a1', 'cody', 'ydoc', 'localhost', '/usr/local/data/essen', 'essen', 'AgendaController,BookingController', 'Y', 'essen.local.cody-cms.org'),
(2, 'empty', 'v0.1a1', 'cody', 'ydoc', 'localhost', '/usr/local/data/empty', 'empty', '', 'Y', 'empty.local.cody-cms.org'),
(3, 'codyweb', 'v0.1a1', 'cody', 'ydoc', 'localhost', '/usr/local/data/codyweb', 'codyweb', 'SiteCreationController', 'Y', 'codyweb.local.cody-cms.org');

-- Copy/paste the following into your hosts file:

-- 172.21.1.114 essen.vpn.cody-cms.org
-- 127.0.0.1	 essen.local.cody-cms.org
-- 172.21.1.114 codyweb.vpn.cody-cms.org
-- 127.0.0.1	 codyweb.local.cody-cms.org
-- 172.21.1.114 empty.vpn.cody-cms.org
-- 127.0.0.1	 empty.local.cody-cms.org