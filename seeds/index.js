const mongoose = require('mongoose');
const Campground = require('../models/campground.js');
const cities = require('./cities');
const { places,descriptors } = require('./seedhelper.js');


mongoose.connect("mongodb://127.0.0.1:27017/yelpcamp")
  .then(() => console.log("Database connected"))
  .catch(err => console.log("Connection error:", err));


  const seeddb = async()=>{
    await Campground.deleteMany({});

    for(let i=0;i<50;i++){
        const rand1=Math.floor(Math.random()*1000);
        const rand2=Math.floor(Math.random()*places.length);
      const camp=new Campground({
        author:  new mongoose.Types.ObjectId('68e4151680d2fbe176ebb2c3'),
        title:`${places[rand2]} ${descriptors[rand2]}`,
        location:`${cities[rand1].city},${cities[rand1].state}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
        price:Math.floor(Math.random()*20)+10,
        images:[
            {
      url: 'https://res.cloudinary.com/daqxxhkyh/image/upload/v1760134762/Yelpcamp/b3sal1wrthayval02lwu.jpg',
      filename: 'Yelpcamp/b3sal1wrthayval02lwu',
    },
    {
      url: 'https://res.cloudinary.com/daqxxhkyh/image/upload/v1760134762/Yelpcamp/juzlkexhri2vja9zvbud.jpg',
      filename: 'Yelpcamp/juzlkexhri2vja9zvbud',
    },
    {
      url: 'https://res.cloudinary.com/daqxxhkyh/image/upload/v1760134762/Yelpcamp/giijrtmllhrs4ejwd8nw.jpg',
      filename: 'Yelpcamp/giijrtmllhrs4ejwd8nw',
    }
        
      ]
    })

      await camp.save();
    }
    }

    seeddb().then(()=>{
        mongoose.connection.close();
    });