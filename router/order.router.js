const express=require("express");
const orderRouter=express.Router();
const orderController=require("../controller/order.controller");
const authMiddleWare=require("../middleware/auth.middleware");

orderRouter.get("/viewall",authMiddleWare("admin"),orderController.getAllOrders);
orderRouter.get("/myorders",authMiddleWare("user"),orderController.getOrdersbyUserId);
orderRouter.get("/view/:id",authMiddleWare(),orderController.getOrderById);
orderRouter.put("/cancel/:id",authMiddleWare("user"),orderController.cancelOrderById);
orderRouter.post("/create",authMiddleWare("user"),orderController.createNewOrder);
orderRouter.put("/update/:id",authMiddleWare("admin"),orderController.updateOrderById);
orderRouter.delete("/delete/:id",authMiddleWare("admin"),orderController.deleteOrderById);

module.exports=orderRouter;