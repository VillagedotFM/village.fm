# village.fm

## Running Locally
Run ```meteor --settings setings.json --production``` to use the settings file and to simulate a
production environment (optional but useful for testing bugs)


## Deploying
In ```mup.json``` ensure the "host" (line 5) and "ROOT_URL" (line 36) match up to the following:
### Staging
host = 45.55.219.50

ROOT_URL = http://45.55.219.50/
### Production
host = 159.203.72.180

ROOT_URL = http://village.fm

Then run ```mupx setup``` followed by ```mupx deploy```


## Connect to MongoDB
You can SSH (or connect with a GUI like 3T MongoChef) into either 45.55.219.50 (staging) or 159.203.72.180 (prod) the username/password combo for both is root/Pineapple15!


## Taking a Backup of the Database
There are 3 steps in taking a backup of the production database:
(1) Using a terminal, SSH into the production server 159.203.72.180 (See Connect to MongoDB above)
(2) Dump the db "villagefm" into the docker container that was formed with mupx  
```docker exec mongodb mongodump -d villagefm -o /backup-MM-DD```
the ```-d villagefm``` specifies the database to dump while the ```-o /backup-MM-DD``` creates a new directory to place the dump, change the MM-DD to the current month and day for clarity. You can ensure that the dump was successful and the new directory was created by running
```docker exec -it mongodb ls``` and locating the directory in the container.
(3) Transfer the new dump directory from the container to the server by running
```docker cp mongodb:backup-MM-DD .```
You should now see the folder in the root of the server by running ```ls```
[OPTIONAL](4) Now that the backup is on the server you can copy it over to your local machine to restore to your local db (or staging). You can use scp or a GUI like CyberDuck. This isn't necessary as we'll have the backup on the server.


## Restoring a Backup
Depending on which db you're trying to restore (local, staging, or prod) You may need to use scp or CyberDuck to transfer the backup folder to the server. Once the backup folder is on the server, all you need to do is SSH into it and run
```mongorestore /root/backup-MM-DD/ --drop```
This will restore the db to the backup in the directory of your choosing (specified with the MM-DD) in the root of the server. The ```--drop``` flag just ensures that not corrupted data is left in the db after the restore.


## Adding a new Village
First, add the topbar image to ```public/images/```
The naming convention is ```img-topbar-{{slug}}@3x.png```
Next, add a new record in the villages collection using something like 3T MongoChef with a String id (not ObjectId) [NOTE: We get a weird error when you leave the default String id from MongoChef so you should paste in "LtfJqmKbvG2HEXXXX" replacing the X's with random letters for now or at least keep the id to 17 characters]. Edit the JSON and paste in this blank example:
```
"name" : "VILLAGE NAME",
"description" : "The VILLAGE NAME Village",
"slug" : "/",
"admins" : [
    null
],
"users" : [

],
"related" : [

],
"genres" : [

],
"createdAt" : ISODate("2016-09-11T18:25:22.463+0000"),
"createdBy" : "",
"friendlySlugs" : {
    "slug" : {
        "base" : "VILLAGESLUG",
        "index" : NumberInt(0)
    }
},
"posts" : [

],
"profiles" : [

]
```
Change the name, description, and friendlySlugs.slug.base (make the slug lowercase and one word).
