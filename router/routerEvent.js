import { Router } from 'express';
import { EventController } from "../controllers/eventController.js";
import { UserController } from '../controllers/userController.js';
import User from "../models/modelUser.js";
import Event from '../models/modelEvent.js';

const eventRouter = Router()


//-------------------------------------listEvent
eventRouter.get('/listeEvenement/:id', async (req, res) => {
    const user = await UserController.isConnected(req.session.userId)
    const listUser = await User.find()
    if (user) {
        res.render('./template/event/listEvent.html.twig', {
            events: listUser,
            user:user
        })
    } else {
        res.redirect('/connexion')
    }
})

//-------------------------------------newEvent
eventRouter.get('/nouvelleEvenement/:id', async (req, res) => {
    const user = await UserController.isConnected(req.session.userId)
    if (user) {
        res.render('./template/event/newEvent.html.twig', {
            user: user
        })
    } else {
        res.redirect('/connexion')
    }

})

eventRouter.post('/nouvelleEvenement/:id', async (req, res) => {
    const user = await UserController.isConnected(req.session.userId)
    const newEvent = await EventController.newEvent(req.body, user)
    if (newEvent.errors) {
        res.render('./template/event/newEvent.html.twig', {
            errors: newEvent.errors,
            user: user
        })
    } else {
        res.redirect('/profil/' + user._id)
    }
})

//-------------------------------------UpdateEvent
eventRouter.get('/modifierEvenement/:id', async (req, res) => {
    let user = await UserController.isConnected(req.session.userId)
    const index = user.eventUser.findIndex(eventUser => eventUser._id == req.params.id) // methode js qui permet de recuperer l'index de l'event que l'on veut
    let event = user.eventUser[index]// recupere l'event que l'on veut grace à son index
    if (user) {
        res.render('./template/event/updateEvent.html.twig', {
            user: user,
            event:event,
        })
    } else {
        res.redirect('/connexion');
    }
})

eventRouter.post('/modifierEvenement', async (req, res) => {
    if (!update.errors) {
        res.redirect('/listeEvenement/' + user._id)
    } else {
        res.render('./template/event/updateEvent.html.twig', {
            user: user,
            errors: update.errors
        })
    }
})

//-------------------------------------deleteEvent
eventRouter.get('/supprimerEvenement/:id', async (req, res) => {
    const user = await UserController.isConnected(req.session.userId)
    const deleteUser = await EventController.deleteEvent(req.session.userId, req.params.id)
    res.redirect('/profil/' + user._id)
})












export default eventRouter //pourquoi export default
