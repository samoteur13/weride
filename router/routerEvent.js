import { Router } from 'express';
import { EventController } from "../controllers/eventController.js";
import { UserController } from '../controllers/userController.js';
import ifConnected from '../customDependences/ifConnected.js';
import User from '../models/modelUser.js';

const eventRouter = Router()


//-------------------------------------listEvent
eventRouter.get('/listeEvenement', ifConnected, async (req, res) => {
    const user = await User.findOne({ _id: req.session.user._id })
    const listUser = await User.find({ _id: { $ne: req.session.user._id } }) //permet de retiré un élément $ne === ! 
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

    //récupérera les informations de la base de données et les retournera sous forme de tables.
    const mySteps = await  EventController.mySteps(req.body)
    // if (mySteps === "false") {
    //     res.render('./template/event/newEvent.html.twig', {
    //         user: req.session.user,
    //         event: req.body
    //     })
    // }
    const newEvent = await EventController.newEvent(req.body, req.session.user, mySteps)

    if (newEvent.error) {
        res.render('./template/event/newEvent.html.twig', {
            errors: newEvent,
            user: req.session.user,
            event: req.body
        })
    } else {
        res.redirect('/profil')
    }
})

//-------------------------------------UpdateEvent
eventRouter.get('/modifierEvenement/:eventId/:userEventId', ifConnected, async (req, res) => {
    let userEvent = await User.findOne({ _id: req.params.userEventId })
    const index = userEvent.eventUser.findIndex(eventUser => eventUser._id == req.params.eventId) // methode js qui permet de recuperer l'index de l'event que l'on veut
    let event = userEvent.eventUser[index]// recupere l'event que l'on veut grace à son index
    if (userEvent) {
        res.render('./template/event/updateEvent.html.twig', {
            user: req.session.user,
            userEvent: userEvent,
            event: event
        })
    }
})

eventRouter.post('/modifierEvenement/:eventId/:userEventId', ifConnected, async (req, res) => {
    let userEvent = await User.findOne({ _id: req.params.userEventId })
    const eventModify = await EventController.updateEvent(userEvent, req.params.eventId, req.body)
    if (eventModify && eventModify.error) {
        const index = userEvent.eventUser.findIndex(eventUser => eventUser._id == req.params.eventId) // methode js qui permet de recuperer l'index de l'event que l'on veut
        let event = userEvent.eventUser[index]// recupere l'event que l'on veut grace à son index
        res.render('./template/event/updateEvent.html.twig', {
            errors: eventModify,
            user: req.session.user,
            userEvent: userEvent,
            event: event
        })
    } else {
        res.redirect('/profil')
    }
})

//-------------------------------------Event
eventRouter.get('/evenement/:eventId/:userId', ifConnected, async (req, res) => {

    let userEvent = await User.findOne({ _id: req.params.userId })
    const index = userEvent.eventUser.findIndex(eventUser => eventUser._id == req.params.eventId) // methode js qui permet de recuperer l'index de l'event que l'on veut
    let event = userEvent.eventUser[index]// recupere l'event que l'on veut grace à son index
    res.render('./template/event/event.html.twig', {
        userEvent: userEvent,
        event: event,
        user: req.session.user
    })
})

//-------------------------------------deleteEvent
eventRouter.get('/supprimerEvenement/:eventId/:userEventId', ifConnected, async (req, res) => {
    const deleteUser = await EventController.deleteEvent(req.params.userEventId, req.params.eventId)
    res.redirect('/profil')
})

//-------------------------------------joinEvent
eventRouter.get('/rejoindreEvenement/:idEvent/:idUserEvent/:idUser', ifConnected, async (req, res) => {
    const eventJoin = await EventController.eventJoin(req.params.idEvent, req.params.idUserEvent, req.params.idUser)
    res.redirect(req.get('referer') + '#' + req.params.idEvent); // (referer) page d 'ou l'on vient
})

//-------------------------------------anullingParticipation
eventRouter.get('/annulerParticipation/:idEvent/:idUserEvent/:idUser', ifConnected, async (req, res) => {
    const eventJoin = await EventController.anullingParticipation(req.params.idEvent, req.params.idUserEvent, req.params.idUser)
    res.redirect(req.get('referer') + '#' + req.params.idEvent);
})


export default eventRouter //pourquoi export default
