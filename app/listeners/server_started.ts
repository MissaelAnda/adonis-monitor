import { DbQueryEventNode } from "@adonisjs/lucid/types/database"

export default class ServerStarted {
  handle(payload: { port: number, host: string, duration: [number, number] }) {
    const a = 'a'
  }

  query(payload: DbQueryEventNode) {
    const a = 'a'
  }
}