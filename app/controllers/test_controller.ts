import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import cache from '@adonisjs/cache/services/main'

export default class TestController {
  async handle(_: HttpContext) {
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
}