const Campground = require("../models/campground");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
const { cloudinary } = require("../cloudniary/index.js");
module.exports.allCampground=async(req, res) => {
    const camp=await Campground.find({});
  res.render("campgrounds",{camp});
}

module.exports.addCampground=async(req,res,next)=>{

    const geoData = await maptilerClient.geocoding.forward(req.body.camp.location, { limit: 1 });
    console.log(geoData);
    if (!geoData.features?.length) {
        req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
        return res.redirect('/campgrounds/new');
    }
  const camp=new Campground(req.body.camp);

   camp.geometry = geoData.features[0].geometry;
   camp.location = geoData.features[0].place_name;
  camp.images=  req.files.map(f=>({url:f.path,filename:f.filename}))
  camp.author=req.user._id;
  await camp.save();
// console.log(camp);

  req.flash('success','successfully made a new campground')
  res.redirect(`/campgrounds/${camp._id}`);
  
}


module.exports.showNewForm=async(req, res) => {
  res.render("new");
}

module.exports.showOneCampground=async(req,res)=>{
  const camp=await Campground.findById(req.params.id).populate({path:'reviews',populate:{path:'author'}}).populate('author');

  if(!camp){
    req.flash('error','Cannot find campground');
    return res.redirect('/campgrounds')
  }

res.render("show",{camp});
}


module.exports.showEditForm= async(req,res)=>{
  const {id}=req.params;
const camp=await Campground.findById(id);

if(!camp){
    req.flash('error','Cannot find campground');
    return res.redirect('/campgrounds')
  }
  res.render("edit",{camp});
}

module.exports.editCampground = async (req, res) => {
  const { id } = req.params;

  // Geocode location
  const geoData = await maptilerClient.geocoding.forward(req.body.camp.location, { limit: 1 });
  if (!geoData.features?.length) {
    req.flash('error', 'Could not geocode that location. Please enter a valid location.');
    return res.redirect(`/campgrounds/${id}/edit`);
  }

  // Update fields that exist in schema
  const { title, description, price } = req.body.camp;
  const camp = await Campground.findByIdAndUpdate(
    id,
    { title, description, price },
    { new: true, runValidators: true }
  );

  // Update geometry & location
  camp.geometry = geoData.features[0].geometry;
  camp.location = geoData.features[0].place_name;

  // Handle uploaded images
  if (req.files && req.files.length > 0) {
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...imgs);
  }

  await camp.save();
  if(req.body.deleteImages){

    for(let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename);
    }
await camp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}});
  }
  req.flash('success', 'Successfully updated campground');
  res.redirect(`/campgrounds/${camp._id}`);
};



module.exports.deleteCampground=async(req,res)=>{
  const {id}=req.params;  
  
  await Campground.findByIdAndDelete(id);

  res.redirect("/campgrounds");
}