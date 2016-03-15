# snow-white

Instructions to play with this app :

1) Install mongodb and nodejs on your local machine. for instructions to install please go to their resp. websites.

2) To start mongodb, open cmd.exe and navigate to bin directory under mongodb installation directory and type mongod.exe (mongod on Mac) . This will start mongodb database daemon, databases will be stored in the data directory you have chosen as part of mongodb installation.

If you want to store databases in a different folder, type the following command. (I recommend this)
type  mongod.exe --dbpath <path to the data folder>

3) Get the latest version (master) of snow-white project from Github.

4) IMPORTANT - For windows machines, if you are building or deploying for the first time, go to data folder in snow-white project(load script  located at /data/load.bat(sh)) and run load.bat. This will load the setup data necessary for the project into the database.
    NOTE - On Mac you may have to add execution permission to load.sh with the following command: chmod +x load.sh
    The default name of database is prototype
    
5) From snow-white project home directory, run npm install command, this will install all the node js dependencies

6) To start the node server go to the snow-white project folder. This folder should contain server.js in it.
type node server.js <port number>

7) Go to a browser and type http://localhost:<port number> to access the application.