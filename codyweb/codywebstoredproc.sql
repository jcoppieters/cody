DELIMITER // 
DROP PROCEDURE IF EXISTS createWebsite
//

CREATE PROCEDURE createWebsite(IN siteName VARCHAR(255), IN pass VARCHAR(255), IN email VARCHAR(255))
BEGIN
  SET @sql = CONCAT('CREATE DATABASE ', siteName, ';');
  PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;
   
   SET @sql = REPLACE(REPLACE(REPLACE('CREATE TABLE %newdb%.%tablename% LIKE %template%.%tablename%;', '%newdb%', siteName), '%tablename%', 'atoms'), '%template%', 'empty');
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;       
   SET @sql = REPLACE(REPLACE(REPLACE('INSERT INTO %newdb%.%tablename% SELECT * FROM %template%.%tablename%;', '%newdb%', siteName), '%tablename%', 'atoms'), '%template%', 'empty');
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;       

   SET @sql = REPLACE(REPLACE(REPLACE('CREATE TABLE %newdb%.%tablename% LIKE %template%.%tablename%;', '%newdb%', siteName), '%tablename%', 'content'), '%template%', 'empty');
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;       
   SET @sql = REPLACE(REPLACE(REPLACE('INSERT INTO %newdb%.%tablename% SELECT * FROM %template%.%tablename%;', '%newdb%', siteName), '%tablename%', 'content'), '%template%', 'empty');
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;           

   SET @sql = REPLACE(REPLACE(REPLACE('CREATE TABLE %newdb%.%tablename% LIKE %template%.%tablename%;', '%newdb%', siteName), '%tablename%', 'domains'), '%template%', 'empty');
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;       
   SET @sql = REPLACE(REPLACE(REPLACE('INSERT INTO %newdb%.%tablename% SELECT * FROM %template%.%tablename%;', '%newdb%', siteName), '%tablename%', 'domains'), '%template%', 'empty');
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;              

   SET @sql = REPLACE(REPLACE(REPLACE('CREATE TABLE %newdb%.%tablename% LIKE %template%.%tablename%;', '%newdb%', siteName), '%tablename%', 'items'), '%template%', 'empty');
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;       
   SET @sql = REPLACE(REPLACE(REPLACE('INSERT INTO %newdb%.%tablename% SELECT * FROM %template%.%tablename%;', '%newdb%', siteName), '%tablename%', 'items'), '%template%', 'empty');
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;              
   
   SET @sql = REPLACE(REPLACE(REPLACE('CREATE TABLE %newdb%.%tablename% LIKE %template%.%tablename%;', '%newdb%', siteName), '%tablename%', 'languages'), '%template%', 'empty');
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;       
   SET @sql = REPLACE(REPLACE(REPLACE('INSERT INTO %newdb%.%tablename% SELECT * FROM %template%.%tablename%;', '%newdb%', siteName), '%tablename%', 'languages'), '%template%', 'empty');
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;                  

   SET @sql = REPLACE(REPLACE(REPLACE('CREATE TABLE %newdb%.%tablename% LIKE %template%.%tablename%;', '%newdb%', siteName), '%tablename%', 'levels'), '%template%', 'empty');
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;       
   SET @sql = REPLACE(REPLACE(REPLACE('INSERT INTO %newdb%.%tablename% SELECT * FROM %template%.%tablename%;', '%newdb%', siteName), '%tablename%', 'levels'), '%template%', 'empty');
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;                  
    
   SET @sql = REPLACE(REPLACE(REPLACE('CREATE TABLE %newdb%.%tablename% LIKE %template%.%tablename%;', '%newdb%', siteName), '%tablename%', 'pages'), '%template%', 'empty');
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;       
   SET @sql = REPLACE(REPLACE(REPLACE('INSERT INTO %newdb%.%tablename% SELECT * FROM %template%.%tablename%;', '%newdb%', siteName), '%tablename%', 'pages'), '%template%', 'empty');
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;              

	SET @sql = REPLACE(REPLACE(REPLACE('CREATE TABLE %newdb%.%tablename% LIKE %template%.%tablename%;', '%newdb%', siteName), '%tablename%', 'templates'), '%template%', 'empty');
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;       
   SET @sql = REPLACE(REPLACE(REPLACE('INSERT INTO %newdb%.%tablename% SELECT * FROM %template%.%tablename%;', '%newdb%', siteName), '%tablename%', 'templates'), '%template%', 'empty');
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;              

   SET @sql = REPLACE(REPLACE(REPLACE('CREATE TABLE %newdb%.%tablename% LIKE %template%.%tablename%;', '%newdb%', siteName), '%tablename%', 'users'), '%template%', 'empty');
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;       
   SET @sql = REPLACE(REPLACE(REPLACE('INSERT INTO %newdb%.%tablename% SELECT * FROM %template%.%tablename%;', '%newdb%', siteName), '%tablename%', 'users'), '%template%', 'empty');
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;       

   SET @sql = REPLACE('DELETE FROM %newdb%.users', '%newdb%', siteName);
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;       

	SET @sql = REPLACE(REPLACE(REPLACE('INSERT INTO %newdb%.users (username, name, password, domain, level, active, email) VALUES(\'admin\', \'admin\', \'%pass%\', \'users\', \'99\', \'Y\', \'%email%\')', '%pass%', pass), '%newdb%', siteName), '%email%', email);
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;       
	
	SET @sql = REPLACE(REPLACE(REPLACE('GRANT ALL ON %newdb%.* TO \'%sitename%\'@\'%\' IDENTIFIED BY \'%pass%\'', '%newdb%', siteName), '%pass%', pass), '%sitename%', siteName);
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;       

SET @sql = REPLACE(REPLACE(REPLACE('GRANT ALL ON %newdb%.* TO \'%sitename%\'@\'localhost\' IDENTIFIED BY \'%pass%\'', '%newdb%', siteName), '%pass%', pass), '%sitename%', siteName);
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;       

	SET @sql = 'FLUSH PRIVILEGES;';
   PREPARE stmt FROM @sql;  EXECUTE stmt;  DEALLOCATE PREPARE stmt;       

       
   
END//