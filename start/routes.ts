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
import { Role } from '../app/helpers/enums.js'

const HealthChecksController = () => import('#controllers/health_checks_controller')
const HomeController = () => import('#controllers/home_controller')
const InstitutesController = () => import('#controllers/institutes_controller')
const OwnersController = () => import('#controllers/owners_controller')
const ClassesController = () => import('#controllers/classes_controller')
const TeachersController = () => import('#controllers/teachers_controller')
const SubjectsController = () => import('#controllers/subjects_controller')

router.post('login', [HomeController, 'login'])
router.get('profile', [HomeController, 'profile']).use(middleware.auth({ guards: ['api'] }))

router
  .group(() => {
    router.post('create', [InstitutesController, 'create'])
    router.get('list', [InstitutesController, 'list'])
    router.get('show/:id', [InstitutesController, 'show'])
    router.post('update/:id', [InstitutesController, 'update'])
    router.post('delete/:id', [InstitutesController, 'delete'])
  })
  .prefix('/institute')
  .use([
    middleware.auth({ guards: ['api'] }),
    middleware.checkPermission({ allowedRoles: [Role.admin] }),
  ])

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
    middleware.checkPermission({ allowedRoles: [Role.admin] }),
  ])

router
  .group(() => {
    router.post('create', [ClassesController, 'create'])
    router.get('list', [ClassesController, 'list'])
    router.get('show/:id', [ClassesController, 'show'])
    router.post('update/:id', [ClassesController, 'update'])
    router.post('delete/:id', [ClassesController, 'delete'])
  })
  .prefix('/class')
  .use([
    middleware.auth({ guards: ['api'] }),
    middleware.checkPermission({ allowedRoles: [Role.admin, Role.owner] }),
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
    middleware.checkPermission({ allowedRoles: [Role.admin, Role.owner] }),
  ])

router
  .group(() => {
    router.post('create', [SubjectsController, 'create'])
    router.get('list', [SubjectsController, 'list'])
    router.get('show/:id', [SubjectsController, 'show'])
    router.post('update/:id', [SubjectsController, 'update'])
    router.post('delete/:id', [SubjectsController, 'delete'])
  })
  .prefix('/subject')
  .use([
    middleware.auth({ guards: ['api'] }),
    middleware.checkPermission({ allowedRoles: [Role.admin, Role.owner] }),
  ])

router.post('logout', [HomeController, 'logout']).use(middleware.auth({ guards: ['api'] }))
router.get('/health', [HealthChecksController])
