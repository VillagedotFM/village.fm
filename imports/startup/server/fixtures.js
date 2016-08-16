import {Meteor} from "meteor/meteor";
import {Villages} from "../../api/villages/villages.js";

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
    if (Villages.find().count() === 0) {
        console.log("No villages found, creating default one");
        Villages.insert({
            name: 'Main',
            description: 'The main Village',
        });
    }
    
    // When only the Main Village is present, add blog villages
    if (Villages.find().count() === 1) {
    	console.log("No blog Villages found, creating defaults");
    	const blogs = ['eclecticasfuck', 'soulection', 'freshasfuck', 'okayplayer', 'indieheads', 'psytrance', 'psybient', 'iambient', 'heavyblogisheavy', 'fusionculture', 'ethniczone'];
    	blogs.forEach(blog => {
    		Villages.insert({
    			name: blog,
    			// TODO: use template string
    			description: 'The ' + blog + ' Village'
    		})
    	});
    } 
});
