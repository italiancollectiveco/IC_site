DROP DATABASE IF EXISTS `IC`;

CREATE DATABASE `IC`;

USE IC;

-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;


-- ---
-- Table 'access_right'
-- Original access_right list
-- ---

DROP TABLE IF EXISTS `access_right`;

CREATE TABLE `access_right` (
  `id` INT(20) AUTO_INCREMENT,
  `full_name` VARCHAR(255),
  `username` VARCHAR(255),
  `email` VARCHAR(255),
  `token` VARCHAR(32),
  `user_status` VARCHAR(32) DEFAULT 'alumni',

  `latitude` FLOAT(17,14),
  `longitude` FLOAT(17,14),
  `geoposition_timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `share_geoposition` INT DEFAULT 1,

  `address` VARCHAR(255),
  `phone_number` VARCHAR(255),
  `profile_picture` VARCHAR(255), -- as a backup but not used
  `creation_date` TIMESTAMP DEFAULT 0,

  PRIMARY KEY (`id`)
) COMMENT 'Original access_right list';


DROP TABLE IF EXISTS `devices`;

CREATE TABLE `devices` (
  `id` INT(20) AUTO_INCREMENT,
  `hrx_id` INT(20),
  `apn_token` VARCHAR(255),
  `state` INT DEFAULT 1,
  PRIMARY KEY (`id`)
) COMMENT 'Apple iOS device list and notification status';


DROP TABLE IF EXISTS `API_passwords`;

CREATE TABLE `API_passwords` (
  `id` INT(20) AUTO_INCREMENT,
  `password` VARCHAR(255),
  PRIMARY KEY (`id`)
) COMMENT 'Dumb passwords to manage database edits';
