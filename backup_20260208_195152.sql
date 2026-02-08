-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: gestion_depense
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `couleur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#E2E8F0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_nom_key` (`nom`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES (1,'Courses ','FaShoppingCart','#669900'),(2,'Plaisir','FaGift','#E91E63'),(3,'Sports','FaDumbbell','#CC0000'),(4,'Transport','FaCar','#ffbb33'),(5,'Abonnement','FaFilm','#33b5e5'),(6,'Banque','FaCreditCard','#5e6ad2'),(7,'Autres','FaQuestion','#2E2E2E'),(8,'Soins','FaHeart','#673AB7'),(9,'Cantines','FaUtensils','#ff8800'),(10,'Investissements','FaChartLine','#5e6ad2');
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CategoryBudget`
--

DROP TABLE IF EXISTS `CategoryBudget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CategoryBudget` (
  `id` int NOT NULL AUTO_INCREMENT,
  `monthlyBudgetId` int NOT NULL,
  `categoryId` int NOT NULL,
  `limit` decimal(10,2) NOT NULL,
  `isDisabled` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `CategoryBudget_monthlyBudgetId_categoryId_key` (`monthlyBudgetId`,`categoryId`),
  KEY `CategoryBudget_categoryId_fkey` (`categoryId`),
  CONSTRAINT `CategoryBudget_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CategoryBudget_monthlyBudgetId_fkey` FOREIGN KEY (`monthlyBudgetId`) REFERENCES `MonthlyBudget` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CategoryBudget`
--

LOCK TABLES `CategoryBudget` WRITE;
/*!40000 ALTER TABLE `CategoryBudget` DISABLE KEYS */;
/*!40000 ALTER TABLE `CategoryBudget` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Expense`
--

DROP TABLE IF EXISTS `Expense`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Expense` (
  `id` int NOT NULL AUTO_INCREMENT,
  `montant` decimal(10,2) NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime(3) NOT NULL,
  `mois` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categorieId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `recurringExpenseId` int DEFAULT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'expense',
  `isShared` tinyint(1) DEFAULT '0',
  `sharePercentage` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Expense_mois_idx` (`mois`),
  KEY `Expense_categorieId_fkey` (`categorieId`),
  KEY `Expense_recurringExpenseId_idx` (`recurringExpenseId`),
  CONSTRAINT `Expense_categorieId_fkey` FOREIGN KEY (`categorieId`) REFERENCES `Category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Expense_recurringExpenseId_fkey` FOREIGN KEY (`recurringExpenseId`) REFERENCES `RecurringExpense` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Expense`
--

LOCK TABLES `Expense` WRITE;
/*!40000 ALTER TABLE `Expense` DISABLE KEYS */;
INSERT INTO `Expense` VALUES (1,9.48,'Carrefour','2026-01-03 00:00:00.000','2026-01',1,'2026-02-08 18:10:05.905',NULL,'expense',1,50.00),(2,17.90,'Carrefour','2026-01-03 00:00:00.000','2026-01',1,'2026-02-08 18:10:23.638',NULL,'expense',1,50.00),(3,61.59,'Carrefour','2026-01-05 00:00:00.000','2026-01',1,'2026-02-08 18:12:34.429',NULL,'expense',1,50.00),(4,11.16,'Action','2026-01-03 00:00:00.000','2026-01',1,'2026-02-08 18:13:14.051',NULL,'expense',1,50.00),(5,7.18,'Action','2026-01-05 00:00:00.000','2026-01',1,'2026-02-08 18:13:44.715',NULL,'expense',1,50.00),(6,15.90,'BK','2026-01-06 00:00:00.000','2026-01',2,'2026-02-08 18:14:54.013',NULL,'expense',0,NULL),(7,31.90,'On Air - Salle','2026-01-01 00:00:00.000','2026-01',3,'2026-02-08 18:16:00.157',1,'expense',0,NULL),(8,7.46,'Action','2026-01-08 00:00:00.000','2026-01',1,'2026-02-08 18:16:40.783',NULL,'expense',1,50.00),(9,16.50,'KFC','2026-01-09 00:00:00.000','2026-01',2,'2026-02-08 18:17:37.855',NULL,'expense',0,NULL),(10,10.90,'Normal - vaulx','2026-01-09 00:00:00.000','2026-01',1,'2026-02-08 18:18:07.611',NULL,'expense',1,50.00),(11,68.00,'Essence','2026-01-10 00:00:00.000','2026-01',4,'2026-02-08 18:19:06.129',NULL,'expense',0,NULL),(12,2.99,'Apple','2026-01-01 00:00:00.000','2026-01',5,'2026-02-08 18:20:18.213',2,'expense',0,NULL),(13,31.90,'On Air - Salle','2026-02-01 00:00:00.000','2026-02',3,'2026-02-08 18:20:41.642',1,'expense',0,NULL),(14,2.99,'Apple','2026-02-01 00:00:00.000','2026-02',5,'2026-02-08 18:20:41.642',2,'expense',0,NULL),(15,9.00,'Marinade','2026-01-12 00:00:00.000','2026-01',2,'2026-02-08 18:21:39.926',NULL,'expense',0,NULL),(16,4.33,'Cotisation - Carte','2026-01-01 00:00:00.000','2026-01',6,'2026-02-08 18:22:43.126',3,'expense',0,NULL),(17,4.33,'Cotisation - Carte','2026-02-01 00:00:00.000','2026-02',6,'2026-02-08 18:22:58.134',3,'expense',0,NULL),(18,2.80,'Péage','2026-01-18 00:00:00.000','2026-01',4,'2026-02-08 18:24:38.373',NULL,'expense',0,NULL),(19,43.45,'Carrefour','2026-01-16 00:00:00.000','2026-01',1,'2026-02-08 18:25:08.815',NULL,'expense',1,50.00),(20,12.90,'BK','2026-01-16 00:00:00.000','2026-01',2,'2026-02-08 18:25:39.694',NULL,'expense',0,NULL),(21,97.52,'LIDL','2026-01-16 00:00:00.000','2026-01',1,'2026-02-08 18:25:58.158',NULL,'expense',1,50.00),(22,6.60,'Gifi','2026-01-16 00:00:00.000','2026-01',1,'2026-02-08 18:26:21.232',NULL,'expense',0,NULL),(23,22.00,'Enjoy Coiffure','2026-01-16 00:00:00.000','2026-01',8,'2026-02-08 18:27:10.063',NULL,'expense',0,NULL),(24,2.80,'Peage','2026-01-18 00:00:00.000','2026-01',4,'2026-02-08 18:28:02.234',NULL,'expense',0,NULL),(25,15.98,'Aliexpress','2026-01-25 00:00:00.000','2026-01',2,'2026-02-08 18:28:43.044',NULL,'expense',0,NULL),(26,8.00,'BK','2026-01-23 00:00:00.000','2026-01',2,'2026-02-08 18:29:00.464',NULL,'expense',0,NULL),(27,32.98,'Conforama','2026-01-24 00:00:00.000','2026-01',1,'2026-02-08 18:29:15.009',NULL,'expense',1,50.00),(28,5.30,'Carrefour','2026-01-24 00:00:00.000','2026-01',1,'2026-02-08 18:29:43.466',NULL,'expense',0,NULL),(29,800.00,'Invest - programmés ','2026-01-01 00:00:00.000','2026-01',10,'2026-02-08 18:33:12.816',4,'expense',0,NULL),(30,800.00,'Invest - programmés ','2026-02-01 00:00:00.000','2026-02',10,'2026-02-08 18:33:26.644',4,'expense',0,NULL),(31,2.10,'TCL - bus','2026-01-27 00:00:00.000','2026-01',4,'2026-02-08 18:34:05.368',NULL,'expense',0,NULL),(32,9.00,'Marinade','2026-01-29 00:00:00.000','2026-01',2,'2026-02-08 18:34:19.364',NULL,'expense',0,NULL),(33,20.00,'Essence','2026-01-29 00:00:00.000','2026-01',4,'2026-02-08 18:34:43.929',NULL,'expense',0,NULL),(34,18.00,'BK','2026-01-30 00:00:00.000','2026-01',2,'2026-02-08 18:36:05.012',NULL,'expense',0,NULL),(35,68.00,'Essence - Sam','2026-02-01 00:00:00.000','2026-02',4,'2026-02-08 18:37:20.380',NULL,'expense',1,0.00),(36,95.00,'LIDL ','2026-01-01 00:00:00.000','2026-01',1,'2026-02-08 18:38:49.370',NULL,'expense',1,50.00),(37,46.00,'Restaurant','2026-01-01 00:00:00.000','2026-01',2,'2026-02-08 18:39:12.185',NULL,'expense',0,NULL),(39,6.89,'Aliexpress - Maillot','2026-01-31 00:00:00.000','2026-01',2,'2026-02-08 18:42:35.344',NULL,'refund',0,NULL);
/*!40000 ALTER TABLE `Expense` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MonthlyBudget`
--

DROP TABLE IF EXISTS `MonthlyBudget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `MonthlyBudget` (
  `id` int NOT NULL AUTO_INCREMENT,
  `month` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `globalLimit` decimal(10,2) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `MonthlyBudget_month_key` (`month`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MonthlyBudget`
--

LOCK TABLES `MonthlyBudget` WRITE;
/*!40000 ALTER TABLE `MonthlyBudget` DISABLE KEYS */;
INSERT INTO `MonthlyBudget` VALUES (1,'2026-01',1455.00,'2026-02-08 18:11:00.789','2026-02-08 18:39:30.013'),(2,'2026-02',1455.00,'2026-02-08 18:40:15.345','2026-02-08 18:40:15.345');
/*!40000 ALTER TABLE `MonthlyBudget` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RecurringExpense`
--

DROP TABLE IF EXISTS `RecurringExpense`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RecurringExpense` (
  `id` int NOT NULL AUTO_INCREMENT,
  `montant` decimal(10,2) NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categorieId` int NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `startDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `RecurringExpense_categorieId_fkey` (`categorieId`),
  CONSTRAINT `RecurringExpense_categorieId_fkey` FOREIGN KEY (`categorieId`) REFERENCES `Category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RecurringExpense`
--

LOCK TABLES `RecurringExpense` WRITE;
/*!40000 ALTER TABLE `RecurringExpense` DISABLE KEYS */;
INSERT INTO `RecurringExpense` VALUES (1,31.90,'On Air - Salle',3,1,'2026-01-01 00:00:00.000','2026-02-08 18:16:00.121'),(2,2.99,'Apple',5,1,'2026-01-01 00:00:00.000','2026-02-08 18:20:18.185'),(3,4.33,'Cotisation - Carte',6,1,'2026-01-01 00:00:00.000','2026-02-08 18:22:43.101'),(4,800.00,'Invest - programmés ',10,1,'2026-01-01 00:00:00.000','2026-02-08 18:32:57.548');
/*!40000 ALTER TABLE `RecurringExpense` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Setting`
--

DROP TABLE IF EXISTS `Setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Setting` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Setting`
--

LOCK TABLES `Setting` WRITE;
/*!40000 ALTER TABLE `Setting` DISABLE KEYS */;
INSERT INTO `Setting` VALUES ('defaultBudget','1455');
/*!40000 ALTER TABLE `Setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('059b95e6-44f4-4613-bc39-bf20da232720','fcf58e246855e65a5a97d0ba8b90cf43c54541611b761e3476e1d2753a1e7e75','2026-02-08 17:54:33.006','20260126071255_add_category_color',NULL,NULL,'2026-02-08 17:54:32.847',1),('32b5b50e-7ae0-4192-ab88-ed8a9467b9d5','ec2d1e52c9baa9d2a9f9c88eaec16c3992970af72f83b2bc65471d5d1998b444','2026-02-08 17:54:33.785','20260130192202_add_recurring_expenses',NULL,NULL,'2026-02-08 17:54:33.101',1),('336ec770-a210-474a-9906-b69addffad09','c84ff64ee0a77317ce4d711dfe433678e8331f980dba15572549f657a78c3f9f','2026-02-08 17:54:34.176','20260202192700_add_is_disabled_category',NULL,NULL,'2026-02-08 17:54:34.003',1),('4aa712cb-ac01-452b-ae54-3fd6a549f02d','1a54eaf3799a8b500496094d5ceff89fb4c1249f53ec32ef294c1c03c14ad438','2026-02-08 17:54:38.952','20260208175438_add_shared_expenses_fields',NULL,NULL,'2026-02-08 17:54:38.677',1),('4d6a38de-8671-4546-915e-fdd7fe13de33','0defd59f0fb8f301f7c4caf444dedf5f93e9b6646c7b378515a4e77d84043ec2','2026-02-08 17:54:33.991','20260131134805_add_expense_type',NULL,NULL,'2026-02-08 17:54:33.809',1),('52b826a9-2b82-4d57-8ed8-32762a66f5d0','e9d58e1531bf3fb99acf8bc27aae85bab300c697bf9ce68d23935ab5ae57f81b','2026-02-08 17:54:32.838','20260124214716_add_budget',NULL,NULL,'2026-02-08 17:54:32.282',1),('b08f1dae-a294-4f1e-9b87-11b95288de53','10bcd186cacf21b05625d01d0ecd706d9871d36d37905dbbccb96e6ed3368128','2026-02-08 17:54:33.088','20260128175013_add_settings',NULL,NULL,'2026-02-08 17:54:33.014',1),('d0993973-e1f3-4aa4-b738-436da811b201','7e35eb7a7b3e90b90c920c2427459f5d1069ba0e034037675fc0844192afcbf6','2026-02-08 17:54:32.271','20260124190611_init',NULL,NULL,'2026-02-08 17:54:31.711',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-08 19:52:03
