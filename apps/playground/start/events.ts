const ServerStarted = () => import('#listeners/server_started')
import emitter from '@adonisjs/core/services/emitter'

emitter.on('http:server_ready', [ServerStarted, 'handle'])
emitter.on('db:query', [ServerStarted, 'query'])
