import { Router } from 'express';
import { EventController } from "../controllers/eventController.js";
import { UserController } from '../controllers/userController.js';
import ifConnected from '../customDependences/ifConnected.js';
import User from '../models/modelUser.js';

const eventRouter = Router()


//-------------------------------------listEvent
eventRouter.get('/listeEvenement', ifConnected, async (req, res) => {
    const user = await User.findOne({_id : req.session.user._id})
    const listUser = await User.find( { _id: { $ne: req.session.user._id } } ) //permet de retiré un élément $ne === ! 
    res.render('./template/event/listEvent.html.twig', {
        listUser: listUser,
        user: req.session.user,
        route: 'listEvent',
    })
})

//-------------------------------------newEvent
eventRouter.get('/nouvelleEvenement', ifConnected, async (req, res) => {
    res.render('./template/event/newEvent.html.twig', {
        user: req.session.user
    })
})

eventRouter.post('/nouvelleEvenement', ifConnected, async (req, res) => {
    const newEvent = await EventController.newEvent(req.body, req.session.user)
    if (newEvent.errors) {
        res.render('./template/event/newEvent.html.twig', {
            errors: newEvent.errors,
            user: req.session.user
        })
    } else {
        res.redirect('/profil')
    }
})

//-------------------------------------UpdateEvent
eventRouter.get('/modifierEvenement/:id', ifConnected, async (req, res) => {
    let user = req.session.user
    const index = user.eventUser.findIndex(eventUser => eventUser._id == req.params.id) // methode js qui permet de recuperer l'index de l'event que l'on veut
    let event = user.eventUser[index]// recupere l'event que l'on veut grace à son index
    if (user) {
        res.render('./template/event/updateEvent.html.twig', {
            user: user,
            event: event
        })
    }
})

eventRouter.post('/modifierEvenement/:id', ifConnected, async (req, res) => {
    const user = req.session.user
    const eventModify = await EventController.updateEvent(user, req.params.id, req.body)
    res.redirect('/profil')
})

//-------------------------------------Event
eventRouter.get('/evenement/:eventId/:userId', ifConnected, async (req, res) => {

    let userEvent = await User.findOne({_id: req.params.userId })
    const index = userEvent.eventUser.findIndex(eventUser => eventUser._id == req.params.eventId) // methode js qui permet de recuperer l'index de l'event que l'on veut
    let event = userEvent.eventUser[index]// recupere l'event que l'on veut grace à son index
    res.render('./template/event/event.html.twig', {
        userEvent: userEvent,
        event: event,
        user: req.session.user
    })
})

//-------------------------------------deleteEvent
eventRouter.get('/supprimerEvenement/:id', ifConnected, async (req, res) => {

    const deleteUser = await EventController.deleteEvent(req.session.user._id, req.params.id)
    res.redirect('/profil')
})

//-------------------------------------joinEvent
eventRouter.get('/rejoindreEvenement/:idEvent/:idUserEvent/:idUser', ifConnected, async (req, res) => {
    const eventJoin = await EventController.eventJoin(req.params.idEvent, req.params.idUserEvent, req.params.idUser)
    res.redirect('/listeEvenement')
})

//-------------------------------------anullingParticipation
eventRouter.get('/annulerParticipation/:idEvent/:idUserEvent/:idUser', ifConnected, async (req, res) => {
    const eventJoin = await EventController.anullingParticipation(req.params.idEvent, req.params.idUserEvent,req.params.idUser )
    res.redirect('/listeEvenement')
})


export default eventRouter //pourquoi export default
