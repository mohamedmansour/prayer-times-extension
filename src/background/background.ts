
try {
  require('./alarms')
  require('./startup')
} catch (e) {
  console.error(e)
}
