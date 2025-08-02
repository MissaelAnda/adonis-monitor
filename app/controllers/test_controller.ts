import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import cache from '@adonisjs/cache/services/main'
import { editUser } from '#abilities/main'

export default class TestController {
  async handle({ bouncer }: HttpContext) {
    const user = await User.first()
    await bouncer.authorize('editUser', user)

    // throw new Error('Custom error')
    logger.trace('TRACE')
    logger.debug('DEBUG')
    logger.info('INFO')
    logger.warn('WARN')
    logger.error('ERROR')
    logger.fatal('FATAL')
    logger.silent('SILENT')

    cache.get({ key: 'cacheKey' })

    await User.query().select('error').first()
  }

  async post({ request }: HttpContext) {
    return { message: 'ok' }
  }
}