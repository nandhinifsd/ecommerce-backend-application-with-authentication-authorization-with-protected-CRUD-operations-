const jwt=require("jsonwebtoken");
const orderModel=require("../model/order.model");
const customerController=require("../controller/customer.controller");

const createNewOrder=async (req,res) =>
{
    try{
       const decode=decodeToken(req);
        const { cartDetails, customerDetails, totalAmount, paymentMode, paymentStatus } = req.body;
        if(!cartDetails || cartDetails.length<=0)
        {
            return res.status(404).json({success:false, message: "Cannot Place order with empty cart"});
        }
        if(!customerDetails || !customerDetails.name || !customerDetails.email || !customerDetails.phone || !customerDetails.address)
        {
            return res.status(404).json({success:false, message: "Customer details are missing "});
        }
        
        const customerid= await customerController.addCustomer(customerDetails);

        const orderDate=Date.now();

        const newOrder=await orderModel.create({customerId:customerid, orderDate, items:cartDetails,
            userId:decode.userid, totalAmount, status:"Pending", paymentMode, paymentStatus,refund:false });

        return res.status(201).json({success: true,message: "Order placed successfully",newOrder});

        

    }
    catch (err) {
    console.error("Order creation error:", err);

    return res.status(500).json({
        success: false,
        message: err.message
    });
}

}

const cancelOrderById = async (req,res) =>
{
    try{
                const orderid=req.params.id;
                const order = await orderModel.findByIdAndUpdate(orderid,
                     { status:"Cancelled",refund:true }, { new : true });
                if(!order || order=={})
                {
                    return res.status(404).json({success:false,message:"The order is not available"});
                }

                return res.status(200).json({success:true,message:`The order with order id is cancelled and refund process initiated`})
    }
    catch(err)
    {
        console.error("Order creation error:", err);

    return res.status(500).json({
        success: false,
        message: err.message
    });
    }
}

const decodeToken=(req)=>
{
    const authHeader=req.headers.authorization;
            if(!authHeader || !authHeader.startsWith("Bearer"))
            {
                 return res.status(401).json({success:false,message:"Unauthenticated Token / Token not found"})
            }
            const token=authHeader.split(" ")[1];
            const decode=jwt.verify(token,process.env.secret_key);
            return decode;
}

const getOrdersbyUserId =async (req,res)=>
{
    try{
            const decode=decodeToken(req);

            const filteredorders=await orderModel.find({userId:decode.userid});
            if(!filteredorders || filteredorders.length<=0)
            {
                return res.status(404).json({success:false, message: "No Orders associated with User"});
            }
            return res.status(201).json({success:true,message:"Orders retrived",filteredorders});
    }
    catch(err)
    {
         console.error("Order creation error:", err);

    return res.status(500).json({
        success: false,
        message: err.message
    });

}
}

const getOrderById = async(req,res)=>
{
    try{
    const id=req.params.id;
    const order=await orderModel.findById(id);
    if(!order || order=={})
    {
        return res.status(404).json({success:false,message:`Order associated with ${id} is empty`});
    }
    return res.status(200).json({success:true,message:"Order Details fetched successfully",order});
    }
    catch(err)
    {
        console.error("Order fetching error:", err);
        return res.status(500).json({success:false, message:"Error in Order fetching operation"});
    }
}

const getAllOrders = async (req, res)=>
{
    try{
            const orders=await orderModel.find();
            if(!orders || orders.length<=0)
            {
                return res.status(404).json({success:false, message:"Orders is empty"});
            }
            return res.status(200).json({success:true, message:" the Orders are", orders});
    }
    catch(err)
    {
        return res.status(500).json({success:false, message:"Error in retriving Orders"});

    }
}

const deleteOrderById =async (req,res) =>
{
    try{

            const id=req.params.id;
            const deletedOrder=await orderModel.findByIdAndDelete(id);

            if(!deletedOrder || deletedOrder == {})
            {
                return res.status(404).json({success:false,message:`Order with ${id} is not found`});
            }

            return res.status(200).json({success:true,message:`Order with ${id} is deleted successfully`,deletedOrder});
            }

        
        catch(err)
        {

            return res.status(500).json({success:false, message:"Error occured while deleting Orders"});
        }
    }
   


const updateOrderById =async( req, res )=>
    {
        try{

            const id=req.params.id;
            const updatedOrder=await orderModel.findByIdAndUpdate(id,req.body,{ new: true });

            if(!updatedOrder || updatedOrder == {})
            {
                return res.status(404).json({success:false,message:`Order with ${id} is not found`});
            }

            return res.status(200).json({success:true,message:`Order with ${id} is updated successfully`,updatedOrder});
            }

        
        catch(err)
        {

            return res.status(500).json({success:false, message:"Error occured while updating Orders"});
        }
    }
   
   
   
   
   
   
    
    
    
    
    
    module.exports={ createNewOrder,cancelOrderById,
    getOrdersbyUserId,getOrderById,getAllOrders,
    updateOrderById,deleteOrderById
 };