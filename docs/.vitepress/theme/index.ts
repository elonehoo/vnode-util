import type { App } from 'vue'
import Theme from 'vitepress/theme'
import '../style/vars.css'
import '../style/main.css'
import 'uno.css'
import LiveExample from '../components/LiveExample.vue'

export default {
  ...Theme,
  enhanceApp({ app }: { app: App }) {
    app.component('live-example', LiveExample)
  }
}
