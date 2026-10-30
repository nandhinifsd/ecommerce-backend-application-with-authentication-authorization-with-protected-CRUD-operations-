const customerModel=require("../model/customer.model");

const getAllCustomers = async (req,res) =>
{
    try{
        const customers= await customerModel.find();
                if(!customers || customers.length<=0)
                {
                    return res.status(404).json({success:false,message:"Customers is empty"})
                }
                //console.log(customers);
                return res.status(200).json({success:true,message:"Customers loaded successfully",customers});
        
    }
    catch(err)
    {
            return res.status(500).json({success:false,message:"Customers loading unsuccessful"});
    }
}

const getCustomerById = async (req,res) =>
{
    try{
        const customerid=req.params.id;
        const customer= await customerModel.findById( customerid );
        if(!customer || customer =={})
        {
            return res.status(404).json({success:false, message:"Customer not found"});
        }
        return res.status(200).json({success:true, message:`Customer found with ${customerid}`, customer})
    }
    catch(err)
    {
        return res.status(500).json({success:false,message:"Error occured while customer fetching"});
    }

    }

const addCustomer = async (customerDetails) =>
{
    
    let customer = await customerModel.findOne({ phone:customerDetails.phone });

    if(!customer)
    {
        customer= await customerModel.create(customerDetails);
        
    }
    if(customer.name!=customerDetails.name)
    {
        throw new error("Customer details mismatch");
    }
    return customer._id;
}







module.exports={ getAllCustomers, getCustomerById, addCustomer };