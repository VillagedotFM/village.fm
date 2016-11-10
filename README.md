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
