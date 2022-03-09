import { Router } from 'express';
import { UserController } from '../controllers/userController.js';

const userRouter = Router()

// -----------------------------------------home page
userRouter.get('/', async (req, res) => {
    res.render('./template/home/home.html.twig', {
    })
})


//-------------------------------------inscription
userRouter.get('/inscription', async (req, res) => {

    res.render('./template/inscription/inscription.html.twig', {
    })
})

userRouter.post('/inscription', async (req, res) => {
    let user = await UserController.subscribe(req.body)
    if (user && !user.errors) {
        res.redirect('/connexion')
    } else {
        res.render('./template/inscription/inscription.html.twig', {
            errors: user.errors
        })
    }


})

//-------------------------------------connexion
userRouter.get('/connexion',  (req, res) => {
    res.render('./template/inscription/connexion.html.twig', {
    })
})

userRouter.post('/connexion', async (req, res) => {

    res.redirect('/profil')
})

//-------------------------------------profil
userRouter.get('/profil', async (req, res) => {
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



