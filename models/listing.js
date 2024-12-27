const mongoose=require("mongoose");

const Schema=mongoose.Schema;
const Review=require("./review")

const listingSchema=new Schema({
    title:{type:String,
        required:true,},
    description:String,
    image:{ filename: String,
        url: {type:String ,
            default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz0P7Hc-KEeZ2S6WC_INBHTHqmC83WAPBI5A&s"}
      },
    price:Number,
    location:String,
    country:String,
    categories: [String],
    reviews:[
        {type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],

    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
});







listingSchema.post("findOneAndDelete",async(listing)=>{
    if (listing){
    await Review.deleteMany({_id:{ $in :listing.reviews}})
    }
})


const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;