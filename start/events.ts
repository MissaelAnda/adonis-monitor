import emitter from '@adonisjs/core/services/emitter'
import ServerStarted from '#listeners/server_started'
// const ServerStarted = () => import('#listeners/server_started')

emitter.on('http:server_ready', [ServerStarted, 'handle'])