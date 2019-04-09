DROP TABLE IF EXISTS `dksm_match`;


CREATE TABLE `dksm_match` (
  `id` int(11) unsigned NOT NULL,
  `title` varchar(50) NOT NULL,
  `info` varchar(100) NOT NULL,
  `count` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_dksm_match_id` FOREIGN KEY (`id`) REFERENCES `ht_user_groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS `dksm_submatch`;


CREATE TABLE `dksm_submatch` (
  `matchid` int(11) NOT NULL,
  `subid` int(11) NOT NULL,
  `enddate` datetime NOT NULL,
  `round` int(11) NOT NULL DEFAULT '25',
  `code` varchar(100) NOT NULL,
  `level` int(11) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique` (`matchid`,`level`,`subid`)
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS `dksm_user_match`;


CREATE TABLE `dksm_user_match` (
  `matchid` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`matchid`,`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



DROP TABLE IF EXISTS `dksm_user_submatch`;


CREATE TABLE `dksm_user_submatch` (
  `username` varchar(20) NOT NULL,
  `submatchid` int(11) NOT NULL,
  `recordid` int(11) DEFAULT NULL,
  PRIMARY KEY (`username`,`submatchid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
