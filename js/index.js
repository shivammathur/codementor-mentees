let COLORS = [
"#1abc9c" , "#2ecc71" , "#3498db"
, "#9b59b6" , "#34495e" , "#16a085"
, "#27ae60" , "#2980b9" , "#8e44ad"
, "#2c3e50" , "#f1c40f" , "#e67e22"
, "#e74c3c" , "#ecf0f1" , "#95a5a6"
, "#f39c12" , "#d35400" , "#c0392b"
, "#bdc3c7" , "#7f8c8d"
];

let fills = {
  defaultFill: '#777'
};

threeLeterCountryCodes.forEach(function (c, i) {
  fills[c] = COLORS[i % COLORS.length];
});

function createMap(id, data) {
  let map = new Datamap({
    element: document.getElementById(id),
    geographyConfig: {
      popupOnHover: true,
      highlightOnHover: false,
      borderColor: 'rgba(0,0,0,0.1)'
    },
    bubblesConfig: {
      animate: false,
      fillOpacity: 0.85,
      borderColor: 'rgba(0,0,0,0.1)',
      highlightBorderColor: 'rgba(0,0,0,0.1)'
    },
    fills: fills
  });
  map.bubbles(data, {
    'popupTemplate': function(data) {
      return '<div class="hoverinfo">Country: <strong>' + data.country + '</strong><br>Sessions & Projects: <strong>' + data.sessions + '</strong><br>Mentees: <strong>' + data.user_count + '</strong></div>';
    }
  });

  return map;
}

let countries = {};
let cNames = {};
let maxSessions = -Infinity;
let maxUsers = -Infinity;
let allUniqueUsers = {};

DATA.users.forEach(c => {
  allUniqueUsers[c.user] = 1;
  if (c.country === "N/A") { console.log(c.user);return; }
  c.countryCode = getCountryCode(c.country);
  cNames[c.countryCode] = c.country;
  let arr = countries[c.countryCode] = countries[c.countryCode] || [];
  arr.push(c);
  if (arr.length > maxSessions) {
    maxSessions = arr.length;
  }
});

let maxRadius = 100;
if($(window).width() <= 768)
  maxRadius = 15;

let sessionsData = Object.keys(countries).map(c => {
  let country = countries[c];
  let sessions = country.length;
  let r = maxRadius * sessions / maxSessions;
  let uniqueUsers = {};
  country.forEach(function (c) {
    uniqueUsers[c.user] = 1;
  });
  uniqueUsers = Object.keys(uniqueUsers).length;
  if (uniqueUsers > maxUsers) {
    maxUsers = uniqueUsers;
  }

  return {
    radius: r > 60 ? 60 : r < 10 ? 10 : r
    , centered: c
    , sessions: sessions
    , country: cNames[country[0].countryCode]
    , fillKey: c
    , user_count: uniqueUsers
  }
});

sessionsData.sort(function(a, b){
  if (a.radius < b.radius) {
    return 1;
  }
  if (a.radius > b.radius) {
    return -1;

  }
  return 0;
});

document.getElementById("happy-people-count").innerHTML = Object.keys(allUniqueUsers).length.toString();
document.getElementById("sessions").innerHTML = DATA.users.length.toString();
map = createMap("sessions-map", sessionsData);


$(window).resize(function(){
  let maxRadius = 100;
  if($(window).width() <= 768)
    maxRadius = 15;

  sessionsData.forEach(function(object){
    let r = maxRadius * object.sessions / maxSessions;
    object.radius = r > 60 ? 60 : r < 10 ? 10 : r
  });

  sessionsData.sort(function(a, b){
    if (a.radius < b.radius) {
      return 1;
    }
    if (a.radius > b.radius) {
      return -1;
    }
    return 0;
  });

  $('.map svg').remove();
  createMap("sessions-map", sessionsData);
});
