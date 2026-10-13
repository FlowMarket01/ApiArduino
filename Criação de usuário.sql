CREATE USER 'flowmarket_api'@'%' IDENTIFIED BY '1408Tech!';
SHOW GRANTS FOR 'flowmarket_api'@'%';

GRANT INSERT, SELECT ON leituraRegiaoFila TO 'flowmarket_api'@'%';
GRANT INSERT, SELECT ON leituraCorredor TO 'flowmarket_api'@'%';
GRANT INSERT, SELECT ON usuario TO 'flowmarket_api'@'%';