import { UserController } from "../controllers/userController.js";


let ifConnected = async (req,res,next) => {
   if (req.session.user) {
        let userFinded = await UserController.getUser(req.session.user._id,{password: 0})
  
        if (userFinded){
            req.session.user = userFinded
            next()
        }
   }else {
    res.redirect('/connexion')
   }
   
}

export default ifConnected