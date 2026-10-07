/**
 * Everything the browser does not need to paint the first frame is started right after it:
 *
 *  1. Web fonts. `next/font` self-hosts Inter and Poppins and exposes them through two CSS variable
 *     classes (`--font-inter`, `--font-poppins`). Until those classes are on <html>, globals.css points
 *     both variables at metric-matched system fallbacks, so the first frame is laid out with the same
 *     line boxes and nothing downloads. The script adds the classes once the first contentful paint
 *     has happened; text is already painted, so the swap is an ordinary `font-display: swap` change
 *     with matched metrics and does not move the layout. Five render-critical font files (80 KB,
 *     Inter alone 48 KB) otherwise sit in the critical path of the first paint on slow networks.
 *  2. The web app manifest, which is not render-related either.
 *
 * It is a ~0.8 KB inline script (no extra request) with a 1.5 s-after-load safety net for browsers or
 * states in which no paint is ever reported (hidden tab). URLs with a hash (deep links) run it at once.
 */
interface PostPaintOptions {
  /** next/font variable classes that activate the real fonts. */
  fontClasses: string;
  manifestHref: string;
}

export function buildPostPaintScript({ fontClasses, manifestHref }: PostPaintOptions): string {
  const classes = JSON.stringify(fontClasses);
  const manifest = JSON.stringify(manifestHref);
  return (
    '(function(){var d=document.documentElement,done=false;' +
    'function go(){if(done)return;done=true;' +
    `d.className+=' '+${classes};` +
    `var l=document.createElement('link');l.rel='manifest';l.href=${manifest};` +
    "l.crossOrigin='use-credentials';document.head.appendChild(l);}" +
    // A deep link (/#contact) shows a section straight away: swap the fonts at once, before that
    // section's first paint, instead of re-flowing its text a moment later.
    'if(location.hash.length>1){go();return;}' +
    'try{var o=new PerformanceObserver(function(l){' +
    "if(l.getEntriesByName('first-contentful-paint').length){o.disconnect();go();}});" +
    "o.observe({type:'paint',buffered:true});}catch(e){go();}" +
    "addEventListener('load',function(){setTimeout(go,1500);});})();"
  );
}
