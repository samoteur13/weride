import { Router } from 'express';
import { EventController } from "../controllers/eventController.js";
import { UserController } from '../controllers/userController.js';
import ifConnected from '../customDependences/ifConnected.js';
import User from '../models/modelUser.js';
import Moto from '../models/modelMoto.js';
import {MotoController} from "../controllers/motoController.js";

const motoRouter = Router()


//-------------------------------------newMoto
motoRouter.get('/nouvelleMoto', ifConnected, async (req, res) => {
    res.render('./template/moto/newMoto.html.twig', {
        user: req.session.user
    })
})

motoRouter.post('/nouvelleMoto', ifConnected, async (req, res) => {
    const newMoto = await MotoController.newMoto(req.body, req.session.user)
    if (newMoto.errors) {
        res.render('./template/moto/newMoto.html.twig', {
            errors: newMoto.errors,
            user: req.session.user
        })
    } else {
        res.redirect('/profil')
    }
})



//-------------------------------------deleteEvent
motoRouter.get('/supprimerMoto/:id',ifConnected, async (req, res) => {
    const deleteMoto = await MotoController.deleteMoto(req.session.user._id, req.params.id)
    res.redirect('/profil')
})


export default motoRouter //pourquoi export default
