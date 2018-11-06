const rp = require('request-promise');
const baseUrl = process.env.BASEURL || 'https://cogs.10pearls.com/cogsapi/api';

module.exports = {
  auth,
  lunch,
  lunchToday,
  notify
}

function auth(username, password) {
  return rp.post(`${baseUrl}/auth/login`, {
    body: `{"data":{"type":"auths","attributes":{"userName":"${username}","password":"${password}","keepMeLoggedIn":true}},"included":[]}`,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(JSON.parse)
  .then(res => res.data.attributes['access-token']);
}

function lunch(token, date) {
  return rp.get(`${baseUrl}/Lunches/Weekly`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then(JSON.parse)
  .then(res => res.data.map(d => d.attributes))
  .then(lunches => {
    return lunches.find(lunch => new Date(lunch['lunch-date']).getDay() === date.getDay())
  });
}

function lunchToday(token) {
  const offset = process.env.OFFSET || 0;
  const queryDate = new Date().getTime() + offset;
  return lunch(token, new Date(queryDate));
}

function notify(message) {
  return rp.post('https://api.pushover.net/1/messages.json', {
    formData: {
      token: process.env.TOKEN,
      user: process.env.USER,
      message: message
    }
  })
}
