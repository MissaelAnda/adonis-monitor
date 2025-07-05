import { Request } from '@adonisjs/core/http'

Request.macro('has', function (this: Request, name: string): boolean {
  return name in this.body()
})

Request.macro('filled', function (this: Request, name: string): boolean {
  return this.input(name) != null
})

Request.macro('boolean', function (this: Request, name: string): boolean {
  const val = this.input(name)

  return val == true || val == 'true' || val == 'yes'
})

declare module '@adonisjs/core/http' {
  interface Request {
    has(name: string): boolean
    filled(name: string): boolean
    boolean(name: string): boolean
  }
}