const api = require('./api');


exports.handle = async function(e, ctx, cb) {
  const token = await api.auth(process.env.USERNAME, process.env.PASSWORD);
  const lunch = await api.lunchToday(token);
  console.log(lunch['menu-item'])
  api.notify(lunch['menu-item']);
  cb(null)
}
