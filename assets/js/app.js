/* ABC Tutoring — shared site logic: availability, bookings, rendering. */
(function () {
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var HORIZON = 21;              // how many days ahead the calendar shows
  var STORE = 'abc_bookings_v1';

  /* ---------- small helpers ---------- */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function gradeLabel(n) {
    if (n === 0) return 'K';
    var s = ['th','st','nd','rd'][(n % 100 - 20) % 10] || ['th','st','nd','rd'][n % 100] || 'th';
    return n + s;
  }
  function gradeRange(lo, hi) { return gradeLabel(lo) + '–' + gradeLabel(hi); }

  function timeLabel(t) {
    var h = parseInt(t.split(':')[0], 10), m = t.split(':')[1];
    var ap = h >= 12 ? 'pm' : 'am', h12 = h % 12 || 12;
    return h12 + (m === '00' ? '' : ':' + m) + ap;
  }
  function dateLabel(d) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var diff = Math.round((d - today) / 86400000);
    var base = DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate();
    if (diff === 0) return 'Today · ' + base;
    if (diff === 1) return 'Tomorrow · ' + base;
    return base;
  }

  /* ---------- bookings (stored in this browser) ---------- */
  function getBookings() {
    try { return JSON.parse(localStorage.getItem(STORE) || '[]'); } catch (e) { return []; }
  }
  function addBooking(b) {
    var all = getBookings(); all.push(b);
    try { localStorage.setItem(STORE, JSON.stringify(all)); } catch (e) {}
  }
  function bookedKeys() {
    return getBookings().map(function (b) { return b.tutorId + '|' + b.iso; });
  }

  /* ---------- turn a weekly schedule into real dated slots ---------- */
  function openSlots(tutor) {
    var taken = bookedKeys(), out = [], now = new Date();
    var start = new Date(); start.setHours(0, 0, 0, 0);

    for (var i = 0; i < HORIZON; i++) {
      var d = new Date(start.getTime() + i * 86400000);
      var rule = (tutor.availability || []).filter(function (a) { return a.day === DAYS[d.getDay()]; })[0];
      if (!rule) continue;

      rule.times.forEach(function (t) {
        var hh = parseInt(t.split(':')[0], 10), mm = parseInt(t.split(':')[1], 10);
        var when = new Date(d); when.setHours(hh, mm, 0, 0);
        if (when <= now) return;                                   // no booking the past
        var iso = when.getFullYear() + '-' + pad(when.getMonth() + 1) + '-' + pad(when.getDate()) + 'T' + t;
        if (taken.indexOf(tutor.id + '|' + iso) > -1) return;      // already booked
        out.push({
          iso: iso, date: when, day: DAYS[when.getDay()], time: t,
          dateLabel: dateLabel(d), timeLabel: timeLabel(t)
        });
      });
    }
    return out;
  }

  function tutorById(id) {
    return window.ABC_DATA.tutors.filter(function (t) { return t.id === id; })[0] || null;
  }

  /* ---------- shared bits of markup ---------- */
  function avatar(t, size) {
    size = size || 60;
    return '<div class="avatar" style="background:' + t.color + ';width:' + size + 'px;height:' + size +
           'px;flex-basis:' + size + 'px;font-size:' + Math.round(size / 3) + 'px" aria-hidden="true">' +
           t.initials + '</div>';
  }

  function navBar(current) {
    return '<header class="site-head"><div class="wrap">' +
      '<a class="logo" href="index.html"><span class="mark">ABC</span>ABC Tutoring</a>' +
      '<nav class="nav">' +
      '<a href="index.html" class="' + (current === 'home' ? 'on' : '') + '">Home</a>' +
      '<a href="tutors.html" class="' + (current === 'tutors' ? 'on' : '') + '">Our Tutors</a>' +
      '<a href="book.html" class="' + (current === 'book' ? 'on' : '') + '">Book a Session</a>' +
      '</nav></div></header>';
  }

  function footer() {
    return '<footer class="site-foot"><div class="wrap">' +
      'ABC Tutoring — local tutoring in our suburb, in person and online.<br>' +
      'Elementary math through Algebra II · Science · Elementary reading' +
      '</div></footer>';
  }

  window.ABC = {
    DAYS: DAYS, gradeLabel: gradeLabel, gradeRange: gradeRange,
    timeLabel: timeLabel, dateLabel: dateLabel,
    openSlots: openSlots, tutorById: tutorById,
    getBookings: getBookings, addBooking: addBooking,
    avatar: avatar, navBar: navBar, footer: footer
  };
})();
