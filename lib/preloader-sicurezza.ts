export const ATTRIBUTO_PRELOADER = "data-preloader-attivo";
export const ATTRIBUTO_PRELOADER_SCADUTO = "data-preloader-scaduto";
export const EVENTO_PRELOADER_SCADUTO = "delsigel:preloader-scaduto";

/** Eseguito dall'HTML, prima dei bundle: il timeout funziona anche se React
 * non arriva. Senza script la porta resta nascosta e la pagina è in flusso. */
export const SCRIPT_SICUREZZA_PRELOADER = `(function(){
  var d=document.documentElement;
  if(d.hasAttribute("data-porta-di-ritorno"))return;
  d.setAttribute("${ATTRIBUTO_PRELOADER}","");
  setTimeout(function(){
    if(!d.hasAttribute("${ATTRIBUTO_PRELOADER}"))return;
    d.removeAttribute("${ATTRIBUTO_PRELOADER}");
    d.setAttribute("${ATTRIBUTO_PRELOADER_SCADUTO}","");
    window.dispatchEvent(new Event("${EVENTO_PRELOADER_SCADUTO}"));
  },10000);
})()`;
