-- MySQL dump 10.13  Distrib 5.7.21, for osx10.13 (x86_64)
--
-- Host: localhost    Database: horseracing
-- ------------------------------------------------------
-- Server version	5.7.21

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
-- Current Database: `horseracing`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `horseracing` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `horseracing`;

--
-- Table structure for table `game_record`
--

DROP TABLE IF EXISTS `game_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `value` float DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `username` varchar(20) DEFAULT NULL,
  `data` text,
  `rank` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_record`
--

LOCK TABLES `game_record` WRITE;
/*!40000 ALTER TABLE `game_record` DISABLE KEYS */;
INSERT INTO `game_record` VALUES (3,NULL,'2018-08-03 20:21:25',0,1,'root',NULL,NULL),(4,NULL,'2018-08-03 20:21:31',0,1,'root',NULL,NULL),(5,NULL,'2018-08-03 20:21:31',0,1,'root',NULL,NULL),(6,NULL,'2018-08-03 20:21:31',0,1,'root',NULL,NULL),(7,NULL,'2018-08-03 20:21:31',0,1,'root',NULL,NULL),(8,NULL,'2018-08-03 20:21:32',0,1,'root',NULL,NULL),(9,NULL,'2018-08-03 20:21:32',0,1,'root',NULL,NULL),(10,NULL,'2018-08-03 20:21:32',0,1,'root',NULL,NULL),(11,NULL,'2018-08-03 20:21:32',0,1,'root',NULL,NULL),(12,NULL,'2018-08-03 20:21:33',0,1,'root',NULL,NULL),(13,NULL,'2018-08-03 20:21:33',0,1,'root',NULL,NULL),(14,NULL,'2018-08-03 23:39:49',1.0318,2,'root',NULL,NULL),(15,NULL,'2018-08-03 23:53:39',11.9517,2,'cxhhxx',NULL,NULL),(16,NULL,'2018-08-03 23:54:04',-2.7004,1,'cxhhxx',NULL,NULL),(17,NULL,'2018-08-03 23:54:58',-2.26101,1,'cxhhxx',NULL,NULL),(18,NULL,'2018-08-03 23:55:12',3.05125,1,'cxhhxx',NULL,NULL),(19,NULL,'2018-08-10 15:46:43',3.7371,2,'winter002','[object Object]',NULL),(20,NULL,'2018-08-10 15:52:15',12.8582,2,'winter002','{\"numTrack\":2,\"startDate\":\"170810\",\"endDate\":\"170913\",\"tracks\":[\"SH600887\",\"SH601398\"],\"history\":[{\"i\":1,\"time\":1015},{\"i\":1,\"time\":1247},{\"i\":2,\"time\":1546},{\"i\":1,\"time\":1996},{\"i\":1,\"time\":2148},{\"i\":1,\"time\":2365},{\"i\":1,\"time\":2518},{\"i\":1,\"time\":2698},{\"i\":2,\"time\":3714},{\"i\":2,\"time\":3887},{\"i\":2,\"time\":4066},{\"i\":1,\"time\":4315},{\"i\":1,\"time\":4548},{\"i\":1,\"time\":4701},{\"i\":1,\"time\":4967},{\"i\":0,\"time\":6283},{\"i\":0,\"time\":7271},{\"i\":0,\"time\":7432},{\"i\":2,\"time\":8514},{\"i\":2,\"time\":8965},{\"i\":2,\"time\":9209},{\"i\":2,\"time\":9665},{\"i\":2,\"time\":9882},{\"i\":2,\"time\":10080}],\"round\":25,\"auto\":false,\"profit\":12.858160197845734,\"rank\":1}',1),(21,NULL,'2018-08-10 18:10:28',-1,1,'admin',NULL,NULL),(22,NULL,'2018-08-10 18:10:34',-1,1,'admin',NULL,NULL),(23,NULL,'2018-08-10 18:11:35',11,1,'admin',NULL,NULL),(24,NULL,'2018-08-10 18:15:02',11,1,'admin',NULL,NULL),(25,NULL,'2018-08-10 18:15:18',11,1,'admin',NULL,NULL);
/*!40000 ALTER TABLE `game_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `level` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin',1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-08-10 20:06:03
