// Abertura "capa de revista": toca uma vez por sessão (por aba).
const INTRO_STORAGE_KEY = "fda-intro-vista";

// Roda no <head> antes da primeira pintura. Se a abertura já tocou nesta
// sessão, marca o <html> e o CSS esconde a capa sem piscar na tela.
// Aba aberta em segundo plano: a abertura fica pausada até a aba aparecer.
export const INTRO_SCRIPT = `try{var h=document.documentElement,k="${INTRO_STORAGE_KEY}";if(sessionStorage.getItem(k))h.dataset.intro="vista";else{sessionStorage.setItem(k,"1");if(document.hidden){h.dataset.intro="pausa";document.addEventListener("visibilitychange",function f(){if(document.hidden)return;h.removeAttribute("data-intro");document.removeEventListener("visibilitychange",f)})}}}catch(e){}`;
