To create docker mysql: 
 -  docker run --name mysql001 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=pw -d mysql:latest

 To execute interactive bash:
 - docker exec -it mysql001 bash

 To run mysql: 
 - mysql -u root -p

 To create table: 
 - create table Users ( name VARCHAR(20), email VARCHAR(255), password VARCHAR(255));

 use npm express sessions