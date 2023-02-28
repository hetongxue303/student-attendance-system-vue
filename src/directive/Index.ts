import { App, ObjectDirective } from 'vue'
import { permission, role } from './permission'

const directives = { permission, role }

export default {
  install(app: App) {
    Object.keys(directives).forEach((item) => {
      app.directive(
        item,
        (directives as { [key: string]: ObjectDirective })[item]
      )
    })
  }
}
