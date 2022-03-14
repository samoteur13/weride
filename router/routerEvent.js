import { Router } from 'express';
import { EventController } from "../controllers/eventController.js";
import { UserController } from '../controllers/userController.js';


const eventRouter = Router()


//-------------------------------------listEvent
eventRouter.get('/listeEvenement/:id', async (req, res) => {
    const user = await UserController.isConnected(req.session.userId)
    if (user) {
        res.render('./template/event/listEvent.html.twig', {
            user: user
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
        res.redirect('/listeEvenement/' + user._id)
    }
})

//-------------------------------------UpdateEvent
eventRouter.get('/modifierEvenement', async (req, res) => {
    res.render('./template/event/updateEvent.html.twig', {
    })
})

eventRouter.post('/modifierEvenement', async (req, res) => {
    res.redirect('./listEvent', {
    })
})

//-------------------------------------UpdateEvent
eventRouter.get('/supprimerEvenement', async (req, res) => {
    res.render('./template/event/updateEvent.html.twig', {
    })
})


export default eventRouter //pourquoi export default
