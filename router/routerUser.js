import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
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
        disconnect: true
    })
})

userRouter.post('/inscription', async (req, res) => {
    let user = await UserController.subscribe(req)
    if (user && !user.errors) {
        res.redirect('/connexion')
    } else {
        res.render('./template/authentification/registration.html.twig', {
            errors: user.errors
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
    const eventJoined = await UserController.eventJoined(req.session.user)
    const listUsers = await User.find({ _id: { $ne: req.session.user._id } }) //permet de retiré un élément $ne === ! 
    console.log(eventJoined);

    res.render('./template/user/profil.html.twig', {
        user: req.session.user,
        listUsers: listUsers,
        eventJoined: eventJoined,
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
            errors: update.errors
        })
    }
})

export default userRouter



