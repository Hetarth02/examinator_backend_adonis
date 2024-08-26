/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const HealthChecksController = () => import('#controllers/health_checks_controller')

const OwnersController = () => import('#controllers/owners_controller')
const TeachersController = () => import('#controllers/teachers_controller')
const HomeController = () => import('#controllers/home_controller')

router.post('login', [HomeController, 'login'])
router.get('profile', [HomeController, 'profile']).use(middleware.auth({ guards: ['api'] }))

router
  .group(() => {
    router.post('create', [OwnersController, 'create'])
    router.get('list', [OwnersController, 'list'])
    router.get('show/:id', [OwnersController, 'show'])
    router.post('update/:id', [OwnersController, 'update'])
    router.post('delete/:id', [OwnersController, 'delete'])
  })
  .prefix('/owner')
  .use([
    middleware.auth({ guards: ['api'] }),
    middleware.checkPermission({ allowedRoles: ['admin'] }),
  ])

router
  .group(() => {
    router.post('create', [TeachersController, 'create'])
    router.get('list', [TeachersController, 'list'])
    router.get('show/:id', [TeachersController, 'show'])
    router.post('update/:id', [TeachersController, 'update'])
    router.post('delete/:id', [TeachersController, 'delete'])
  })
  .prefix('/teacher')
  .use([
    middleware.auth({ guards: ['api'] }),
    middleware.checkPermission({ allowedRoles: ['admin', 'owner'] }),
  ])

router.post('logout', [HomeController, 'logout']).use(middleware.auth({ guards: ['api'] }))

router.get('/health', [HealthChecksController])
