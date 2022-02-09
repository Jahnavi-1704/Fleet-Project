const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

// connecting to MongoDB
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

const Schema = mongoose.Schema;

const companySchema = new Schema({
    name: { type: String, required: true },
    modeType: { type: String, required: true },
    icon: { type: String },
    website: { type: String },
    description: { type: String, required: true },
});

const Company = mongoose.model('Company', companySchema);

// data to be initially inserted into the DB collection (only once to populate the DB)
 const CompanyData = [
     {
         "name": "Uber",
         "modeType": "RIDESHARE",
         "icon": "https://fleet-core-static.s3.amazonaws.com/assets/provider_images/collected_defaults/uber/primary.png",
         "website": "https://www.uber.com",
         "description": "Rideshare platform where those who drive and deliver can connect with riders, eaters, and restaurants."
     },
     {
         "name": "Bay Wheels",
         "modeType": "BIKESHARE",
         "icon": "https://fleet-core-static.s3.amazonaws.com/assets/provider_images/collected_defaults/bay_wheels/primary.png",
         "website": "https://www.lyft.com/bikes/bay-wheels",
         "description": "Bay Wheels is a regional public bicycle sharing system in California's San Francisco Bay Area. It is operated by Motivate in a partnership with the Metropolitan Transportation Commission and the Bay Area Air Quality Management District."
     },
     {
         "name": "Lyft",
         "modeType": "RIDESHARE",
         "icon": "https://fleet-core-static.s3.amazonaws.com/assets/provider_images/collected_defaults/lyft/primary.png",
         "website": "https://www.lyft.com/",
         "description": "Lyft operates in the United States and Canada. They set specific requirements on the vehicles used by drivers and have several different categories or levels of service. The Lyft app for smartphones and the dashboard Amp sign notify passengers of the driver's arrival and give the passenger an estimated cost in advance."
     },
     {
         "name": "Scoot",
         "modeType": "ESCOOTERSHARE",
         "icon": "https://fleet-core-static.s3.amazonaws.com/assets/provider_images/collected_defaults/scoot/primary.png",
         "website": "https://scoot.co/san-francisco/",
         "description": "Scoot lets SF locals rent electric scooters by the hour, ride them around town and drop them off when they're done. It's fun, cheap, and super-efficient. Think bike-sharing for electric scooters — that turn on with a smartphone! Faster than the bus, cheaper than cabs, and way more fun than sitting in traffic in a car."
     },
     {
         "name": "Citi Bike",
         "modeType": "BIKESHARE",
         "icon": "https://fleet-core-static.s3.amazonaws.com/assets/provider_images/collected_defaults/citi_bike/primary.png",
         "website": "https://account.citibikenyc.com/access-plans",
         "description": "Citi Bike is a privately owned public bicycle sharing system serving the New York City boroughs of the Bronx, Brooklyn, Manhattan, and Queens, as well as Jersey City, New Jersey, and Hoboken, New Jersey."
     },
     {
         "name": "Revel",
         "modeType": "EBIKESHARE",
         "icon": "https://fleet-core-static.s3.amazonaws.com/assets/provider_images/collected_defaults/revel/primary.png",
         "website": "https://gorevel.com/",
         "description": "Revel is a Brooklyn-born transportation company that’s electrifying cities through charging infrastructure and shared electric vehicle fleets. Through the Revel app, users can rent electric mopeds, sign up for monthly eBike subscriptions, or find fast-charging stations compatible with any brand of EV. Revel prides itself on its total rejection of the gig economy and its collaborative approach with local governments."
     },
     {
         "name": "Revel",
         "modeType": "EMOPEDSHARE",
         "icon": "https://fleet-core-static.s3.amazonaws.com/assets/provider_images/collected_defaults/revel/primary.png",
         "website": "https://gorevel.com/",
         "description": "Revel is a Brooklyn-born transportation company that’s electrifying cities through charging infrastructure and shared electric vehicle fleets. Through the Revel app, users can rent electric mopeds, sign up for monthly eBike subscriptions, or find fast-charging stations compatible with any brand of EV. Revel prides itself on its total rejection of the gig economy and its collaborative approach with local governments."
     },
     {
         "name": "Lime",
         "modeType": "BIKESHARE",
         "icon": "https://fleet-core-static.s3.amazonaws.com/assets/provider_images/collected_defaults/lime/primary.png",
         "website": "https://www.li.me/en-us/home",
         "description": "Lime is an electric scooter, bike, and moped-sharing app. Their micro-mobility solutions are available anytime to get you anywhere."
     },
     {
         "name": "Lime",
         "modeType": "ESCOOTERSHARE",
         "icon": "https://fleet-core-static.s3.amazonaws.com/assets/provider_images/collected_defaults/lime/primary.png",
         "website": "https://www.li.me/en-us/home",
         "description": "Lime is an electric scooter, bike, and moped-sharing app. Their micro-mobility solutions are available anytime to get you anywhere."
     },
     {
         "name": "Lime",
         "modeType": "EMOPED",
         "icon": "https://fleet-core-static.s3.amazonaws.com/assets/provider_images/collected_defaults/lime/primary.png",
         "website": "https://www.li.me/en-us/home",
         "description": "Lime is an electric scooter, bike, and moped-sharing app. Their micro-mobility solutions are available anytime to get you anywhere."
     },
     {
         "name": "Wheels",
         "modeType": "ESCOOTER",
         "icon": "https://fleet-core-static.s3.amazonaws.com/assets/provider_images/collected_defaults/wheels/primary.png",
         "website": "https://takewheels.com/",
         "description": "Wheels is a shared electric mobility platform that provides transportation services to the masses. Its electric-powered vehicle falls somewhere in between a bike and scooter, with no pedals, a seat, small but thick wheels, and a distinctive frame."
     },
     {
         "name": "Gig",
         "modeType": "CARSHARE",
         "icon": "https://fleet-core-static.s3.amazonaws.com/assets/provider_images/collected_defaults/gig/primary.png",
         "website": "https://gigcarshare.com/",
         "description": "GIG Car Share is a carsharing service in parts of the San Francisco Bay Area and Sacramento. The company operates a fleet of Toyota Prius Hybrid vehicles and all-electric Chevy Bolts, with roof-top bike racks and features one-way point-to-point rentals."
     }
 ];

// function to initialize the DB if not previously done
function initializer() {
    // console.log('inside initializer()');

    Company.find({})
        .then(data => {
            if(data.length == 0)
            {
                console.log('populating DB');
                Company.create( CompanyData, function (err, companies) {
                    if (err) {
                        throw err;
                    }
                    console.log(companies + '\n-- companies inserted successfully');
                });
            }
            else
            {
                console.log('initial data already exists');
            }

        })
}

// REST API to get the data about all companies
app.route('/companies').get((req, res) => {
    // console.log('parsing get request');

    Company.find()
        .then(companies => res.json(companies))
        .catch(err => {
            console.log('error in backend is: ' + err);
            res.status(400).json('Error: ' + err);
        });
});

// REST API to update information about a company in all instances
app.route('/companies/:companyName').put (async (req, res) => {
    // console.log('parsing put request');

    let name = req.params.companyName.substring(1);
    let updatedWebsite = req.body.website;
    let updatedDesc = req.body.description;

    // console.log('to update companies with name: ' + name);
    // console.log('new website: ' + updatedWebsite);
    // console.log('new description: ' + updatedDesc);

    Company.updateMany({name: {$eq: name}}, { website: updatedWebsite, description: updatedDesc })
        .then(companies => res.json(companies))
        .catch(err => {
            console.log('error in backend is: ' + err);
            res.status(400).json('Error: ' + err);
        });

    // const updation = await Company.updateMany({name: {$eq: name}}, { website: updatedWebsite, description: updatedDesc } );
    // console.log(updation.matchedCount);
    // console.log(updation.modifiedCount);
    // console.log(updation.acknowledged);

});

initializer();

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});