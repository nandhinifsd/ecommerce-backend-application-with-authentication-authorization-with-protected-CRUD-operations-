const mongoose=require("mongoose");
const orderItemSchema=mongoose.Schema({

        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
            required:true
        },
        quantity:{
            type:String,
            required:true,
            min:1
        },
        price:{
            type:Number,
            required:true,
            min:0
        },
        designImage:
        {
            type:String,
            required:true
        },
        _id:false

});
const orderSchema=mongoose.Schema({
orderDate:{
    type:Date,
    default:Date.now()
},
customerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"customers",
    required:true
},
items:{
    type:[orderItemSchema],
    required:true,
    validate:{
        validator:(items)=>items.length>0,
        message:"The Order must have atleast 1 item"
    }
},
userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users",
    required:true

},
totalAmount:{
    type:Number,
    required:true,
    min:0
},
status:{
    type:String,
    enum:["Pending", "Processing", "Completed", "Cancelled"],
    default:"Pending"
},
paymentMode:{
    type:String,
    enum:["UPI","COD","Card","Net Banking"],
    required:true
},
paymentStatus: {
  type: String,
  enum: {
    values: ["While Ordering" , "After Delivery"],
    message: "Invalid payment status"
  }
},
refund:{
    type:Boolean,
    default:false
}

});

const orders=mongoose.model("Orders",orderSchema);
module.exports=orders;