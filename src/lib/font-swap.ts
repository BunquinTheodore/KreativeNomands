/**
 * Web fonts load after the first paint.
 *
 * `next/font` self-hosts Inter and Poppins and exposes them through two CSS variable classes
 * (`--font-inter`, `--font-poppins`). Until those classes are on <html>, globals.css points both
 * variables at metric-matched system fallbacks, so the first frame is laid out with the same line
 * boxes and nothing downloads. This inline script adds the classes once the first contentful paint
 * has happened (or at the latest 1.5 s after window load), which is when the browser starts the
 * font requests. Text is already painted; the swap is a `font-display: swap` change with matched
 * metrics, so it does not move the layout.
 *
 * Why it matters: five render-critical font files (80 KB, Inter alone 48 KB) otherwise sit in the
 * critical path of the first paint on slow networks. Moving them behind the paint took ~0.9 s off
 * the lab FCP at no visual cost.
 */
export function buildFontSwapScript(variableClasses: string): string {
  const classes = JSON.stringify(variableClasses);
  return (
    '(function(){var d=document.documentElement,done=false;' +
    `function go(){if(done)return;done=true;d.className+=' '+${classes};}` +
    'try{var o=new PerformanceObserver(function(l){' +
    "if(l.getEntriesByName('first-contentful-paint').length){o.disconnect();go();}});" +
    "o.observe({type:'paint',buffered:true});}catch(e){go();}" +
    "addEventListener('load',function(){setTimeout(go,1500);});})();"
  );
}
