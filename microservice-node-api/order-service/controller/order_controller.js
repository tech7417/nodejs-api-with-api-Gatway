const orderModal = require('../model/order_model');
const bcrypt = require('bcrypt')

class OrderController {
     constructor(){}

    /**
         * getAllOrders:  admin can see all orders 
         * @param {*} req 
         * @param {*} res 
         * @returns 
         */
        async getAllOrders(req, res) {
            try {
                const orders = await orderModal.find().lean();
                if (orders) {
                    return res.status(200).json(orders);
                }
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
        }
    
        /**
         * getSingleOrder: get single  order from the database and return a single  of order that        
         * @param {*} req 
         * @param {*} res 
         * @returns 
         */
    
        async getSingleOrder(req, res) {
            try {
                const singleOrder = await orderModal.findById(req.params.id)
                .populate('products._id') 
                .exec(); 
                 console.log(singleOrder);
                if (!singleOrder) {
                    return res.status(404).json({ message: "order details not found" });
                }
                return res.status(200).json(singleOrder);
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
        }
    
        /**
         * createNewOrder:  create new order by user  
         * @param {*} req 
         * @param {*} res 
         * @returns 
         */
    
         async createNewOrder(req, res) {
             try {
                const createNewOrders = new orderModal({userId: req.user.id, ...req.body});
               
                await createNewOrders.save();
                return res.status(200).json(createNewOrders);
             } catch (error) {
                return res.status(500).json({ message: error.message });
             }
        }
    
    /**
     * updateProduct: update product by admin 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    
        async updateOrder(req, res) {

            try {
                 const{status} = req.body;
                  const validatedStaus = ['pending', 'shipped', 'delivered', 'cancelled'];
                   if(!validatedStaus.includes(status)){
                    return res.status(400).json({ message: "invalid status value" });
                   }
                    const findOrderId = await orderModal.findById(req.params.id);
                     if(!findOrderId){
                        return res.status(400).json({message: "order not found"});
                     }
                     findOrderId.status = status;
                      await findOrderId.save();
                
            
                return res.status(200).json({message: "order status has benn  updated successfully", findOrderId});
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
        }
    
    
        
      
    
    
    }
    




 module.exports =  new OrderController();