module.exports=(fn)=>{
    return function(reqres,next){
        fn(req,res,next).catch(next);
    }
}


// const express=require("express");
// const app=express();
// const ejsMate = require('ejs-mate');
// const mongoose=require("mongoose")
// const Listing=require("./models/listing.js");
// const path=require("path")
// app.set('view engine', 'ejs');
// app.engine("ejs",ejsMate);
// app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.urlencoded({ extended: true })); // Apply it to the app.
// const methodOverride = require('method-override');
// app.use(methodOverride('_method'));
// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
// const wrapAsync=require("./utils/wrapAsync.js")
// const expressError=require("./utils/expressError.js")
// main()
// .then(()=>{
//     console.log("connected to DB")

// })
// .catch((err)=>{
//     let message=err
//     ;res.render("error.ejs",{message})})
// async function main() {
//     await mongoose.connect(MONGO_URL);}

// app.get("/",(req,res)=>{
//     res.send("working")
// })

// // app.get("/testlisting", async (req,res)=>{
// //     let samplelisting=new Listing({
// //         title:"my new villa",
// //         description:"by the beach",
// //         price:1200,
// //         location:"jalandhar",
// //         country:"india"
// //     })
// //     await samplelisting.save();
// //     console.log("sample saved");
// //     res.send("successful testing") 
// // })
// //index route
// app.get("/listings" , async (req,res)=>{
//     let alllistings= await Listing.find();
//     console.log(alllistings);
//     res.render("listings/index.ejs",{alllistings})
// })

// //new add 
// app.get("/listings/new", (req,res)=>{
//      res.render("listings/new.ejs")
// })

// app.post("/listings",wrapAsync (async (req, res) => {
//     let { title, description, price, location, country, image } = req.body;
//    if(!title || !description || !price){
//     throw new expressError(statuscode=400,message="send valid data");
//    } 
//     const newListing = new Listing({
//         title,
//         description,
//         price,
//         location,
//         country,
//         image: {
//             filename: "listingimage", // Use a placeholder or generate dynamically
//             url: image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz0P7Hc-KEeZ2S6WC_INBHTHqmC83WAPBI5A&s" // Directly assign the URL from the form input
//  }
// });
//         await newListing.save();
//         console.log("New listing created:", newListing);
//         res.redirect("/listings"); // Redirect to the listings index after creation
  
// }));
// //show route
// app.get("/listings/:id" , (async (req,res)=>{
//     let {id}=req.params;
//     const item=await Listing.findById(id);
//     console.log(item);
//     res.render("listings/view.ejs",{item}
   
//     )
// }))

// app.delete("/listings/:id",( async (req,res)=>{
//     let {id}=req.params;
//     let deleteditem=await Listing.findByIdAndDelete(id);
//     console.log(deleteditem);
//     await  res.redirect("/listings")
// }))

// //edit route ;
// app.get("/listings/:id/edit",( async (req,res)=>{
//     let {id}=req.params;
//     const item=await Listing.findById(id);
//     res.render("listings/edit.ejs",{item})
// })
// )
// app.patch("/listings/:id/save", (async (req, res) => {
//     let { id } = req.params;
//     let { title, description, price, location, country, image } = req.body;
    
   
//         // Update the listing
//         const updatedListing = await Listing.findByIdAndUpdate(id, {
//             title,
//             description,
//             price, 
//             location,
//             country,
//             "image.url": image  // Updating the nested field for image URL
//         }, { new: true }); // { new: true } returns the updated document
        
//         console.log("Updated listing:", updatedListing);
//         res.redirect(`/listings/${id}`); // Redirect to the updated listing view
   
    
// }));


// app.all("*",(req,res,next)=>{
//     next(new expressError(404,"page not found"))
// })

// app.use((err,req,res,next)=>{
//     let{statuscode,message}= err;
//     if (!statuscode){
//         statuscode=500
//     }
//    res.render("listings/error.ejs",{message})
// })



// app.listen(8080,()=>{
//     console.log('server is listening')})
