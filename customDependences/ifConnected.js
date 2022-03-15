import { UserController } from "../controllers/userController.js";


let ifConnected = async (req, res, next) => {

    if (req.session.user) {
        let updateUser = await UserController.getUser(req.session.user._id, { password: 0 })// {password: 0} récupère tout les éléments sauf le password
        // la variable updateUser correspond à l'objet utilisateur 
        req.session.user = updateUser
        next() // permet de passer au middleware suivant. en l'occurence dans ce projet, le corps de la route (middleware final)

    } else {
        res.redirect('/connexion')
    }

}

export default ifConnected