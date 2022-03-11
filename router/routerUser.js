import { Router } from 'express';
import { UserController } from '../controllers/userController.js';

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
    let user = await UserController.subscribe(req.body)
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
        req.session.userId = login
        console.log(req.session.userId)
        // req.session.destroy()
        res.redirect('/profil/'+ req.session.userId )
    } else {
        res.render('./template/authentification/login.html.twig', {
            errors: login.errors
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
userRouter.get('/profil/:id', async (req, res) => {
    // let user = await User.findOne({_id: req.params.id})
    // console.log(user)
    res.render('./template/user/profil.html.twig', {
    })
})

//-------------------------------------updateprofil
userRouter.get('/updateProfil', async (req, res) => {
    res.render('./template/user/updateProfil.html.twig', {
    })
})

//-------------------------------------listEvent
userRouter.get('/listEvent', async (req, res) => {
    res.render('./template/event/listEvent.html.twig', {
    })
})

//-------------------------------------newEvent
userRouter.get('/newEvent', async (req, res) => {
    res.render('./template/event/newEvent.html.twig', {
    })
})

userRouter.post('/newEvent', async (req, res) => {
    res.redirect('./listEvent', {
    })
})

//-------------------------------------UpdateEvent
userRouter.get('/updateEvent', async (req, res) => {
    res.render('./template/event/updateEvent.html.twig', {
    })
})

userRouter.post('/updateEvent', async (req, res) => {
    res.redirect('./listEvent', {
    })
})



export default userRouter



