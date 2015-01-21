/*
 * json formated information
 */
var bio = {
  'name'    : 'Jared Rickert',
  'role'    : 'Computer Engineering Student',
  'contacts'  : {
    'mobile'  : '320-630-6739',
    'email'   : 'jaredrickert52@gmail.com',
    'office'  : '',
    'twitter' : '',
    'github'  : 'jlrickert',
    'blog'    : '',
    'location': 'Little Falls, MN'
  },
  'skills'     : ['linux', 'c/c++', 'rails'],
  'picture'    : 'images/2015-01-19-173938.jpg',
  'welcomeMsg' : 'Wassup!',
  'display'    : function (){}
}

var education = {
  'schools' : [{
    'name'     : 'Central Lakes College',
    'url'      : 'http://www.clcmn.edu/',
    'location' : 'CLC, Brainerd, MN',
    'degree'   : 'Engineering A.S.',
    'majors'   : ['Engineering'],
    'date'     : '2014',
  }, {
    'name'     : 'St. Cloud State University',
    'location' : 'SCSU, St. Cloud, MN',
    'degree'   : '',
    'majors'   : ['Computer Engineering'],
    'date'     : 'current',
    'url'      : 'http://www.stcloudstate.edu/',
  }],
  'onlineCourses' : [{
    'title'  : 'Try jquery',
    'school' : 'Codeschool',
    'date'   : '01-24-2015',
    'url'    : 'http://try.jquery.com/levels/6/challenges/1',
  }],
  'display': function (){}
}

var work = {
  'jobs': [{
    'employer'    : 'WCO',
    'title'       : 'labourer',
    'location'    : 'Little Falls, MN',
    'dates'       : '2013',
    'description' : 'Sorted junk mail'
  }],
  'display': function (){}
}

var projects = {
  'project': [{
    'title': 'Arduino Audio recorder',
    'dates': 'Dec 2014',
    'description': 'Created an arduino based sound recorder to be used for sound expiremts with a high altitude balloon.',
    'images': ["http://arduino.cc/en/uploads/Main/ArduinoUno_r2_front450px.jpg"]
  }],
  'display': function () {}
}
/*
 * end json formated information
 */

/*
The next few lines about clicks are for the Collecting Click Locations quiz in Lesson 2.
*/
clickLocations = [];

function logClicks(x,y) {
  clickLocations.push(
    {
      x: x,
      y: y
    }
  );
  console.log('x location: ' + x + '; y location: ' + y);
}

$(document).click(function(loc) {
  logClicks(loc.clientX, loc.clientY);
});

/*
This is the fun part. Here's where we generate the custom Google Map for the website.
See the documentation below for more details.
https://developers.google.com/maps/documentation/javascript/reference
*/
var map;    // declares a global map variable

/*
Start here! initializeMap() is called when page is loaded.
*/
function initializeMap() {

  var locations;

  var mapOptions = {
    disableDefaultUI: true
  };

  // This next line makes `map` a new Google Map JavaScript Object and attaches it to
  // <div id="map">, which is appended as part of an exercise late in the course.
  map = new google.maps.Map(document.querySelector('#map'), mapOptions);


  /*
  locationFinder() returns an array of every location string from the JSONs
  written for bio, education, and work.
  */
  function locationFinder() {

    // initializes an empty array
    var locations = [];

    // adds the single location property from bio to the locations array
    locations.push(bio.contacts.location);

    // iterates through school locations and appends each location to
    // the locations array
    for (var school in education.schools) {
      locations.push(education.schools[school].location);
    }

    // iterates through work locations and appends each location to
    // the locations array
    for (var job in work.jobs) {
      locations.push(work.jobs[job].location);
    }

    return locations;
  }

  /*
  createMapMarker(placeData) reads Google Places search results to create map pins.
  placeData is the object returned from search results containing information
  about a single location.
  */
  function createMapMarker(placeData) {

    // The next lines save location data from the search result object to local variables
    var lat = placeData.geometry.location.lat();  // latitude from the place service
    var lon = placeData.geometry.location.lng();  // longitude from the place service
    var name = placeData.formatted_address;   // name of the place from the place service
    var bounds = window.mapBounds;            // current boundaries of the map window

    // marker is an object with additional data about the pin for a single location
    var marker = new google.maps.Marker({
      map: map,
      position: placeData.geometry.location,
      title: name
    });

    // infoWindows are the little helper windows that open when you click
    // or hover over a pin on a map. They usually contain more information
    // about a location.
    var infoWindow = new google.maps.InfoWindow({
      content: name
    });

    // hmmmm, I wonder what this is about...
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.open(map ,marker);
    });

    // this is where the pin actually gets added to the map.
    // bounds.extend() takes in a map location object
    bounds.extend(new google.maps.LatLng(lat, lon));
    // fit the map to the new marker
    map.fitBounds(bounds);
    // center the map
    map.setCenter(bounds.getCenter());
  }

  /*
  callback(results, status) makes sure the search returned results for a location.
  If so, it creates a new map marker for that location.
  */
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMapMarker(results[0]);
    }
  }

  /*
  pinPoster(locations) takes in the array of locations created by locationFinder()
  and fires off Google place searches for each location
  */
  function pinPoster(locations) {

    // creates a Google place search service object. PlacesService does the work of
    // actually searching for location data.
    var service = new google.maps.places.PlacesService(map);

    // Iterates through the array of locations, creates a search object for each location
    for (var place in locations) {

      // the search request object
      var request = {
        query: locations[place]
      };

      // Actually searches the Google Maps API for location data and runs the callback
      // function with the search results after each search.
      service.textSearch(request, callback);
    }
  }

  // Sets the boundaries of the map based on pin locations
  window.mapBounds = new google.maps.LatLngBounds();

  // locations is an array of location strings returned from locationFinder()
  locations = locationFinder();

  // pinPoster(locations) creates pins on the map for each location in
  // the locations array
  pinPoster(locations);

}

// Calls the initializeMap() function when the page loads
$(window).on('load', initializeMap);

// Vanilla JS way to listen for resizing of the window
// and adjust map bounds
$(window).on('resize', function(e) {
  // Make sure the map bounds get updated on page resize
  map.fitBounds(mapBounds);
});

$(document).ready(function () {
  /*
  * show formated html
  */
  // header
  var headerQuery = $("#header");
  var name        = HTMLheaderName.replace(/%data%/g, bio.name);
  var role        = HTMLheaderRole.replace(/%data%/g, bio.role);
  var picture     = HTMLbioPic.replace(/%data%/g    , bio.picture);
  var welcomeMsg  = HTMLWelcomeMsg.replace(/%data%/g, bio.welcomeMsg);
  var title       = bio.name + '\'s Resume';
  $('title').text(title);
  headerQuery.prepend(name, role);
  headerQuery.append(picture, welcomeMsg, HTMLskillsStart);

  // skills
  for (skill in bio.skills) {
    var formatedSkill = HTMLskills.replace(/%data%/g, bio.skills[skill]);
    $("#header").append(formatedSkill)
  }

  // contacts
  var contactMethods = ['mobile', 'email', 'office', 'twitter', 'github', 'blog', 'location']
  for (method in contactMethods) {
    if (!(bio.contacts[contactMethods[method]] === '')) {
    var contact = HTMLcontactGeneric.replace(
      /%contact%/g, contactMethods[method]).replace(
      /%data%/g, bio.contacts[contactMethods[method]]);
    $("#topContacts").append(contact);
    $("#footerContacts").append(contact);
    }
  }

  // work
  $("#workExperience").append(HTMLworkStart);
  var workDiv = $('#workExperience').find('.work-entry');
  for (i in work.jobs) {
    var job      = work.jobs[i];
    var employer = HTMLworkEmployer.replace(/%data%/g, job['employer']);
    var title    = HTMLworkTitle.replace(/%data%/g, job['title']);
    var dates    = HTMLworkDates.replace(/%data%/g, job['dates']);
    var location = HTMLworkLocation.replace(/%data%/g, job['location']);
    var desc     = HTMLworkDescription.replace(/%data%/g, job['description']);

    // work around from jquery adding a </a> tag on variable title
    var qf = employer + title;
    workDiv.append(qf, dates, location, desc);
  }

  // projects
  $("#projects").append(HTMLprojectStart);
  var projectDiv = $('#projects').find('.project-entry');
  for (i in projects['project']) {
    var project = projects['project'][i];
    var title  = HTMLprojectTitle.replace(/%data%/g, project['title']);
    var dates  = HTMLprojectDates.replace(/%data%/g, project['dates']);
    var desc   = HTMLprojectDescription.replace(/%data%/g, project['description']);
    var images = HTMLprojectImage.replace(/%data%/g, project['images']);

    projectDiv.append(title, dates, desc, images);
  }

  // education
  $(HTMLschoolStart).appendTo('#education');
  var eduDiv =  $('#education').find('.education-entry');
  for (i in education.schools) {
    var school   = education.schools[i];
    var name     = HTMLschoolName.replace(
      /%data%/g, school.name).replace(
      /%url%/g, school.url);
    var location = HTMLschoolLocation.replace(/%data%/g, school.location);
    var degree   = HTMLschoolDegree.replace(/%data%/g, school.degree);
    var majors   = HTMLschoolMajor.replace(/%data%/g, school.majors);
    var date     = HTMLschoolDates.replace(/%data%/g, school.date);

    eduDiv.append(name, date, location, majors);
  }

  // online courses
  eduDiv.append(HTMLonlineClasses);
  for (i in education.onlineCourses) {
    var title  = HTMLonlineTitle.replace(/%data%/g, education.onlineCourses[i].title);
    var school = HTMLonlineSchool.replace(/%data%/g, education.onlineCourses[i].school);
    var date   = HTMLonlineDates.replace(/%data%/g, education.onlineCourses[i].date);
    var url    = HTMLonlineURL.replace(/%data%/g, education.onlineCourses[i].url);

    // work around from jquery adding a </a> tag on variable title
    var qf = title + school;
    eduDiv.append(qf, date, url);
  }

  // display google stuff
  $("#mapDiv").append(googleMap);

  /* {{{ hides elements not preset */
  if($('.flex-item').length === 0) {
    // document.getElementById('topContacts').style.display = 'none';
    $('#topContacts').hide();
  }
  if($('#header').find('h1').length === 0) {
    // document.getElementById('header').style.display = 'none';
    $('#header').hide();
  }
  if($('.work-entry').length === 0) {
    // document.getElementById('workExperience').style.display = 'none';
    $('#workExperience').hide();
  }
  if($('.project-entry').length === 0) {
    // document.getElementById('projects').style.display = 'none';
    $('#projects').hide();
  }
  if($('.education-entry').length === 0) {
    // document.getElementById('education').style.display = 'none';
    $('#education').hide();
  }
  if($('.flex-item').length === 0) {
    // document.getElementById('letsConnect').style.display = 'none';
    $('#letsConnect').hide();
  }
  if($('#map').length === 0) {
    // document.getElementById('mapDiv').style.display = 'none';
    $('#mapDiv').hide();
  }

  var contactMe = $("#contactMe");

  // contactMe.on('mouseenter', function () {
  //   contactMe.slideUp();
  // });
  //
  // contactMe.on('mouseleave', function () {
  //   contactMe.slideDown();
  // });

  contactMe.on('click' , function () {
    var mailto = 'mailto:' + bio.contacts['email'];
    document.location.href = mailto;
  });
});
