const {APP_PORT} = require('../config/default.config')
const app = require('./app/index')

app.listen(APP_PORT, () => {
  console.log(`正在监听${APP_PORT}`);
})
