import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { EventController } from '../controllers/eventController.js';
import ifConnected from '../customDependences/ifConnected.js';
import User from '../models/modelUser.js';
import Moto from '../models/modelMoto.js';



const userRouter = Router()

// -----------------------------------------home page
userRouter.get('/', async (req, res) => {
    res.render('./template/home/home.html.twig', {
        disconnect: true
    })
})

//-------------------------------------inscription
userRouter.get('/inscription', async (req, res) => {
    res.render('./template/authentification/registration.html.twig', {
        disconnect: true,
    })
})

userRouter.post('/inscription', async (req, res) => {
    let user = await UserController.subscribe(req)
    if (user && !user.error) {
        req.session.user = user
        res.redirect('/profil')
    } else {
        console.log(req.body.password);
        res.render('./template/authentification/registration.html.twig', {
            errors: user,
            user:req.body,
            disconnect: true
        })
    }
})

//-------------------------------------connexion
userRouter.get('/connexion', (req, res) => {
    res.render('./template/authentification/login.html.twig', {
        disconnect: true
    })
})

userRouter.post('/connexion', async (req, res) => {
    let login = await UserController.login(req.body)

    if (login && !login.errors) {
        req.session.user = login //Ylies 
        res.redirect('/profil')
    } else {
        res.render('./template/authentification/login.html.twig', {
            errors: login.errors,
            disconnect: true
        })
    }
})

//-------------------------------------déconnexion
userRouter.get('/deconnexion', (req, res) => {
    req.session.destroy()
    res.render('./template/authentification/login.html.twig', {
        disconnect: true
    })
})

//-------------------------------------profil
userRouter.get('/profil', ifConnected, async (req, res) => {
    const authorsEvent = await UserController.eventJoined(req.session.user)
    res.render('./template/user/profil.html.twig', {
        user: req.session.user,
        authorsEvent: authorsEvent,
        route: 'profil'
    })

})

//-------------------------------------updateprofil
userRouter.get('/modifierProfil', ifConnected, async (req, res) => {
    res.render('./template/user/updateProfil.html.twig', {
        user: req.session.user
    })
})

userRouter.post('/modifierProfil', ifConnected, async (req, res) => {
    let update = await UserController.updateUser(req.session.user._id, req)
    if (!update.errors) {
        res.redirect('/profil')
    } else {
        res.render('./template/user/updateProfil.html.twig', {
            user: req.session.user,
            errors: update.errors,
            user:req.body
        })
    }
})

export default userRouter



