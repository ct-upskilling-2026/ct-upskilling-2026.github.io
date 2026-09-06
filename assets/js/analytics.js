/* ABC Tutoring — PostHog analytics.
   Dana: your PostHog key goes on the next line. Nothing else here needs changing. */
window.ABC_POSTHOG_KEY  = 'phc_oi2XKMs7rbAQDKhV7aSSyDTqfHQFWHZtHA5L3SnfdgwN';
window.ABC_POSTHOG_HOST = 'https://us.i.posthog.com';

/* ---- PostHog loader (official snippet) ---- */
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){
function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}
(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,
p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",
(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);
var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},
o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

(function () {
  var ready = window.ABC_POSTHOG_KEY && window.ABC_POSTHOG_KEY.indexOf('PLACEHOLDER') === -1;
  if (ready) {
    posthog.init(window.ABC_POSTHOG_KEY, {
      api_host: window.ABC_POSTHOG_HOST,
      person_profiles: 'always',
      capture_pageview: true,
      capture_pageleave: true
    });
  } else {
    console.warn('[ABC] PostHog key not set — events will log to the console only.');
  }

  /* Where did this parent come from? ?src=facebook | flyer | word-of-mouth
     Falls back to the referring site, then "direct". Sticky for the whole visit. */
  function referralSource() {
    try {
      var q = new URLSearchParams(location.search).get('src');
      if (q) { sessionStorage.setItem('abc_src', q); return q; }
      var saved = sessionStorage.getItem('abc_src');
      if (saved) return saved;
      var src = 'direct';
      if (document.referrer) {
        var h = new URL(document.referrer).hostname.replace(/^www\./, '');
        if (h && h !== location.hostname) src = h.indexOf('facebook') > -1 ? 'facebook' : h;
      }
      sessionStorage.setItem('abc_src', src);
      return src;
    } catch (e) { return 'direct'; }
  }

  var SRC = referralSource();

  /* Single entry point for every event on the site. */
  window.abcTrack = function (event, props) {
    var payload = Object.assign({
      referral_source: SRC,
      is_simulated: false
    }, props || {});
    if (ready && window.posthog && posthog.capture) posthog.capture(event, payload);
    else console.log('[ABC event]', event, payload);
  };

  if (ready) posthog.register({ referral_source: SRC });

  /* Fire once per visit so "where do parents come from" is answerable. */
  if (!sessionStorage.getItem('abc_src_fired')) {
    try { sessionStorage.setItem('abc_src_fired', '1'); } catch (e) {}
    window.abcTrack('referral_source', { src: SRC, landing_page: location.pathname });
  }
})();
