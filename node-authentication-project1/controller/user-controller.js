const userModel = require('../model/user-model');
const customError = require('../error/errorHandler');
const {genratesToken} = require('../middleware/auth')

exports.createUser = async (req, res, next) =>{
     try {
            const {email, password} = req.body;
            if(!email || !password){
            res.status(404).json({message:"please enter your email or password"});
            }
            const isEmailExist =   await userModel.findOne({email});
            if (isEmailExist) {
            return res.status(400).json({ message: "Email already exists" });
            }
            const user = new userModel(req.body);
            const savedUser = await user.save();
            return res.status(200).json({ data: savedUser });
     } catch (error) {
         res.status(500).json({ message:error.message})
         
       }
     
       

}
 exports.getProfile = (req, res, next) =>{
     const users = req.profile;
      if(!users) return res.status(404).json({ message:"user not found"}   );
       return res.status(200).json({message:"user found", users})
    

 }
 exports.updateUser = async (req, res)=>  {
    try {
        const user = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({message: "User updated", user})
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.deleteUserById  = async (req, res) => {

    try {
        const user = await userModel.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


  exports.getAllUsers = async (req, res, next) =>{
     try{
        const users =  await userModel.find().lean()
        if(!users) return res.status(404).json({message:"user not found"}); 
        return res.status(200).json({message:"user fetch successful",users});
     } catch (error) {
        return  res.status(500).json({ message:error.message})
     }

}
      exports.login = async (req, res, next) =>{
         try {
                const {email, password} = req.body;
                if(!email || !password){
                res.status(404).json({message:"please enter your email address or password"}); }

                const findUser = await userModel.findOne({email}); 
                if(!findUser) return res.status(404).json({message:"user not found"});
                let result = await findUser.comparePassword( password) ;
                if(!result)  return res.status(404).json({message:"password does not match"});
                let token =  genratesToken(findUser._id);
                 
                return res.status(200).json({message:"login successful", token: token});
         } catch (error) {
             return  res.status(500).json({ message:error.message})
           
         }
    
       
    
       
       
    }