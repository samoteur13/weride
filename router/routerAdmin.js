import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import ifConnected from '../customDependences/ifConnected.js';
import Moto from '../models/modelMoto.js';
import User from '../models/modelUser.js';

const adminRouter = Router()


//-------------------------------------liste des utilisateurs
adminRouter.get('/listeUtilisateurs', ifConnected, async (req, res) => {
    const users = await User.find()

    res.render('./template/admin/listUsers.html.twig', {
        users: users
    })


})

export default adminRouter



