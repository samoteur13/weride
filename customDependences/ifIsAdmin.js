import { UserController } from "../controllers/userController.js";


let ifIsAdmin = async (req, res, next) => {

    if (req.session.user) {
        let updateUser = await UserController.getUser(req.session.user._id, { password: 0 })// {password: 0} récupère tout les éléments sauf le password
        // la variable updateUser correspond à l'objet utilisateur 
        if (req.session.user.status == 2) {
            next() // permet de passer au middleware suivant. en l'occurence dans ce projet, le corps de la route (middleware final)
        }else {
        res.redirect('/profil')
        }  
    } 

}

export default ifIsAdmin