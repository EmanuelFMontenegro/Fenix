-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bd_fenix
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accesos`
--

DROP TABLE IF EXISTS `accesos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accesos` (
  `acceso_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `resultado` enum('éxito','fallo') NOT NULL,
  PRIMARY KEY (`acceso_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `accesos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accesos`
--

LOCK TABLES `accesos` WRITE;
/*!40000 ALTER TABLE `accesos` DISABLE KEYS */;
/*!40000 ALTER TABLE `accesos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleados`
--

DROP TABLE IF EXISTS `empleados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleados` (
  `empleado_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `horario_laboral` varchar(100) DEFAULT NULL,
  `activo` enum('A','I') DEFAULT 'A',
  `registro_rostro_id` int DEFAULT NULL,
  PRIMARY KEY (`empleado_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `registro_rostro_id` (`registro_rostro_id`),
  CONSTRAINT `empleados_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`),
  CONSTRAINT `empleados_ibfk_2` FOREIGN KEY (`registro_rostro_id`) REFERENCES `rostros` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleados`
--

LOCK TABLES `empleados` WRITE;
/*!40000 ALTER TABLE `empleados` DISABLE KEYS */;
/*!40000 ALTER TABLE `empleados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horarios_empleados`
--

DROP TABLE IF EXISTS `horarios_empleados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horarios_empleados` (
  `horario_empleado_id` int NOT NULL AUTO_INCREMENT,
  `empleado_id` int NOT NULL,
  `hora_entrada` datetime NOT NULL,
  `hora_salida` datetime DEFAULT NULL,
  PRIMARY KEY (`horario_empleado_id`),
  KEY `empleado_id` (`empleado_id`),
  CONSTRAINT `horarios_empleados_ibfk_1` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`empleado_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horarios_empleados`
--

LOCK TABLES `horarios_empleados` WRITE;
/*!40000 ALTER TABLE `horarios_empleados` DISABLE KEYS */;
/*!40000 ALTER TABLE `horarios_empleados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `menu_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `href` varchar(100) NOT NULL,
  `rol_id` int NOT NULL,
  PRIMARY KEY (`menu_id`),
  KEY `rol_id` (`rol_id`),
  CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`rol_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permisos_acceso`
--

DROP TABLE IF EXISTS `permisos_acceso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permisos_acceso` (
  `usuario_id` int NOT NULL,
  `rol_id` int NOT NULL,
  PRIMARY KEY (`usuario_id`,`rol_id`),
  KEY `rol_id` (`rol_id`),
  CONSTRAINT `permisos_acceso_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`),
  CONSTRAINT `permisos_acceso_ibfk_2` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`rol_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permisos_acceso`
--

LOCK TABLES `permisos_acceso` WRITE;
/*!40000 ALTER TABLE `permisos_acceso` DISABLE KEYS */;
/*!40000 ALTER TABLE `permisos_acceso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `rol_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`rol_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin1','Rol para el administrador principal'),(2,'Admin2','Rol para el administrador de solo lectura'),(3,'admin3','rol sin acceso');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rostros`
--

DROP TABLE IF EXISTS `rostros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rostros` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `imagen_rostro` longblob NOT NULL,
  `descriptor1` float DEFAULT NULL,
  `descriptor2` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre_apellido_unico` (`nombre`,`apellido`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rostros`
--

LOCK TABLES `rostros` WRITE;
/*!40000 ALTER TABLE `rostros` DISABLE KEYS */;
INSERT INTO `rostros` VALUES (1,'qwe','qwe',_binary 'captura_1697848436766.png',-0.110654,0.133619),(2,'qwe','qweqwe',_binary 'captura_1697852650845.png',-0.0863028,0.128414),(3,'hjgj','lplplp',_binary 'captura_1697856089520.png',-0.102709,0.172794),(4,'iutuyf','resfdxcgfvb',_binary 'captura_1697856100089.png',-0.103248,0.150552),(5,'Mauro','Flores',_binary 'captura_1697856370325.png',-0.128773,0.17267),(6,'Mauiro','Flores',_binary 'captura_1697867338350.png',-0.0894858,0.129039);
/*!40000 ALTER TABLE `rostros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `usuario_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL DEFAULT 'Nombre Predeterminado',
  `apellido` varchar(255) NOT NULL DEFAULT 'Apellido Predeterminado',
  `dni` int DEFAULT NULL,
  `user` varchar(255) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `rol_id` int NOT NULL,
  `estado` enum('A','B') DEFAULT 'A',
  PRIMARY KEY (`usuario_id`),
  KEY `rol_id` (`rol_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`rol_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (9,'Nombre Predeterminado','Apellido Predeterminado',NULL,'123','$2b$10$3fNs02luNX9p.wJ2afUOSudgRUeGi0h8qN4MPkHb1QS3yxKrZ9W..','123@gmail.com',1,'A'),(10,'Nombre Predeterminado','Apellido Predeterminado',NULL,'wewe','$2b$10$MUIDWQfj5IC59VjT7Niwu.kVHtDsOiAXp0r3GzrbGsiLJrXGKpQ3.','wewe@gmail.com',1,'A'),(11,'Nombre Predeterminado','Apellido Predeterminado',NULL,'qwe','$2b$10$eAwggELs1HRtFQIdW9a3Kunwxk6e/NkNdnwD6QV/pKBI9Uf37b55O','qwe@gmail.com',1,'A'),(12,'Predeterminado','Predeterminado',NULL,'temporal','temporal',NULL,3,'A');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'bd_fenix'
--

--
-- Dumping routines for database 'bd_fenix'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-23 18:38:06
