/*
|--------------------------------------------------------------------------
| Bouncer abilities
|--------------------------------------------------------------------------
|
| You may export multiple abilities from this file and pre-register them
| when creating the Bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

import User from '#models/user'
import { AuthorizationResponse, Bouncer } from '@adonisjs/bouncer'

/**
 * Delete the following ability to start from
 * scratch
 */
export const editUser = Bouncer.ability({ allowGuest: true }, (user: User | null, toEdit: User | null) => {
  return true
  // return AuthorizationResponse.deny('Guest can\'t edit user ' + toEdit?.fullName, 403)
})
