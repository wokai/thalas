# Header

 - Thalas: Control multiple Xenon (Dräger Medibus Interface) devices and maintain a Vital Signs database 
 - Date: 14.04.2022


--------------------------------------------------------------------------------

<!--- --------------------------------------------------------------------- --->
# Xenon
<!--- --------------------------------------------------------------------- --->

Xenon is a HTTP-server which communicates with Dräger Devices via Dräger Medibus.

<!--- --------------------------------------------------------------------- --->
# Thalas
<!--- --------------------------------------------------------------------- --->

Thalas keeps a list of Xenon devices which can be controlled and queried.
Each device can be started or stopped.
An interval query function queries new vital sign data periodically from all 
open devices and saves the incoming data to a database.

Thalas is written in NodeJs and maintains a connection to a MySql database
via [Sequelize](https://www.npmjs.com/package/sequelize).


## Setup instruction

 - Download project
 - Run `npm install`
 - Running `npm start` will launch the system
 - Per default, the system will listen to port 4040

