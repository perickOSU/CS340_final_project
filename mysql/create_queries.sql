/* clear a path for new tables... */

DROP TABLE IF EXISTS `sat_contractor_country`;
DROP TABLE IF EXISTS `sat_satellite`;
DROP TABLE IF EXISTS `sat_launch_vehicle`;
DROP TABLE IF EXISTS `sat_contractor`;
DROP TABLE IF EXISTS `sat_country`;



/*
 * Table structure for sat_country
 */

CREATE TABLE `sat_country` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	`population` bigint(20) DEFAULT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;




/*
 * Table structure for sat_contractor
 */

CREATE TABLE `sat_contractor` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	`revenue` bigint(20) DEFAULT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

/*
LOCK TABLES `sat_contractor` WRITE;
INSERT INTO `sat_contractor` VALUES (1,'Raptor'),(2,'Viper'),(3,'Mechanic'),(4,'Command');
UNLOCK TABLES;
 */




/*
 * Table structure for sat_launch_vehicle
 *	
 *	@units:
 *		payload_leo:		kg
 */

CREATE TABLE `sat_launch_vehicle` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	`payload_leo` bigint(20) DEFAULT NULL,
	PRIMARY KEY (`id`),
	UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;




/*
 * Table structure for sat_satellite
 * 	
 *	@units:
 *		longitude: 		degrees
 *		perigee: 		km
 *		apogee: 		km
 *		eccentricity: 	
 *		inclination: 	degrees
 *		preiod: 		minutes
 */

CREATE TABLE `sat_satellite` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	`launch_vehicle` int(11) DEFAULT NULL,
	`longitude` float(5,2) DEFAULT NULL,
	`perigee` int(11) DEFAULT NULL,
	`apogee` int(11) DEFAULT NULL,
	`eccentricity` float(11,10) DEFAULT NULL,
	`inclination` float(5,2) DEFAULT NULL,
	`period` float(7,2) DEFAULT NULL,
	PRIMARY KEY (`id`),
	KEY `launch_vehicle` (`launch_vehicle`),
	CONSTRAINT `sat_satellite_ibfk_1` FOREIGN KEY (`launch_vehicle`) REFERENCES `sat_launch_vehicle` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

/*
LOCK TABLES `sat_satellite` WRITE;
INSERT INTO `sat_satellite` VALUES (1,'William','Adama',3,61),(2,'Lee','Adama',3,30),(3,'Laura','Roslin',3,NULL),(4,'Kara','Thrace',3,NULL),(5,'Gaius','Baltar',3,NULL),(6,'Saul','Tigh',NULL,71),(7,'Karl','Agathon',1,NULL),(8,'Galen','Tyrol',1,32),(9,'Callandra','Henderson',NULL,NULL);
UNLOCK TABLES;
*/



/*
 * Table structure for table `sat_contractor_country`
 */

CREATE TABLE `sat_contractor_country` (
	`bid` int(11) NOT NULL DEFAULT '0',
	`cid` int(11) NOT NULL DEFAULT '0',
	PRIMARY KEY (`bid`,`cid`),
	KEY `cid` (`cid`),
	CONSTRAINT `sat_contractor_country_ibfk_1` FOREIGN KEY (`bid`) REFERENCES `sat_contractor` (`id`),
	CONSTRAINT `sat_contractor_country_ibfk_2` FOREIGN KEY (`cid`) REFERENCES `sat_country` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


/*
LOCK TABLES `sat_contractor_country` WRITE;
INSERT INTO `sat_contractor_country` VALUES (2,2),(4,2),(4,3),(2,4),(4,6),(1,7),(3,8),(3,9);
UNLOCK TABLES;
*/
