
import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import ifConnected from '../customDependences/ifConnected.js';
import ifIsAdmin from '../customDependences/ifIsAdmin.js';
import Moto from '../models/modelMoto.js';
import User from '../models/modelUser.js';

const adminRouter = Router()


//-------------------------------------liste des utilisateurs
adminRouter.get('/listeUtilisateurs', ifConnected, ifIsAdmin, async (req, res) => {
    const users = await User.find({ _id: { $ne: req.session.user._id } }) //$ne permet de retiré un élément (sauf)
    res.render('./template/admin/listUsers.html.twig', {
        users: users,
        user: req.session.user,
        route: 'listUsers'
    })


})

//-----------------------------profil des autres utilisateurs
adminRouter.get('/profil/:id', ifConnected, async (req, res) => {
    let inspectedUser = await User.findOne({_id: req.params.id})
    const authorsEvent = await UserController.eventJoined(inspectedUser)
    res.render('./template/user/profil.html.twig', {
        inspectedUser: inspectedUser,
        authorsEvent: authorsEvent,
        user: req.session.user
    })
})

//-----------------------------Supprimer un utilisateur
adminRouter.get('/supprimerUtilisateur/:id', ifConnected, async (req, res) => {
    const deleteUser = await User.deleteOne({_id: req.params.id})
    res.redirect('/listeUtilisateurs')
})

export default adminRouter



