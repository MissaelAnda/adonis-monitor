/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import TestController from '#controllers/test_controller'
import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home')
router.get('/test', [TestController])
router.get('/test/2', [TestController, 'post'])
router.post('/api/test/:param', ({ request }) => {
    const data = request.body()
    return data
})