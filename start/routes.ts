/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import type { HttpContext } from '@adonisjs/core/http'
import { randomInt } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import env from './env.js'

router
  .get('/:id', async ({ params, request, view, response }: HttpContext) => {
    const lang = request.language(['en', 'fr']) ?? 'en'
    const type = request.accepts(['json', 'html']) ?? 'html'

    const file = await readFile(`${env.get('LANG_FOLDER')}/${lang}`, 'utf8')
    const message = file.split('\n')[params.id]

    response.header('Cache-Control', 'public, max-age=1296000')

    if (type === 'json') {
      return { message }
    }
    return view.render('message', { message, lang })
  })
  .where('id', router.matchers.number())

router.on('/').setHandler((ctx: HttpContext) => {
  ctx.response.status(307).header('location', `/${randomInt(95)}`)
})
