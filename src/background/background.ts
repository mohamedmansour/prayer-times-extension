import * as startup from './startup'

try {
  startup.init()
} catch (e) {
  console.error(e)
}
