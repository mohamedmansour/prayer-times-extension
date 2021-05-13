import * as alarms from './alarms'
import * as startup from './startup'

try {
  startup.init()
  alarms.init()
} catch (e) {
  console.error(e)
}
