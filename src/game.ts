import { initApi } from "./api/initApi";

// ===================================================
//                      RMMZ

let injectedScripts = false;
/**
 * - on program startup this will inject the Rmmz scripts
 *    into the dom, this is to avoid script load order.
 * - it will check if the scripts have already been added
 *    in case of vite hot reloading.
 */
const injectRmmzScripts = () => {
  const isScriptLoaded = document.getElementById("RmmzMain");

  if (!isScriptLoaded) {
    const externalScript = document.createElement("script");
    externalScript.setAttribute("src", "./js/main.js");
    externalScript.setAttribute("type", "text/javascript");
    externalScript.setAttribute("id", "RmmzMain");
    document.body.appendChild(externalScript);
  }

  injectedScripts = true;
};

if (!injectedScripts) {
  injectRmmzScripts();
}

const makeErrorHtml = (name: string, message: string) => {
  const nameDiv = document.createElement("div");
  const messageDiv = document.createElement("div");
  nameDiv.id = "errorName";
  messageDiv.id = "errorMessage";
  nameDiv.innerHTML = name;
  messageDiv.innerHTML = message;
  return nameDiv.outerHTML + messageDiv.outerHTML;
};

/**
 * Make an errorPrinter if Rmmz hasn't loaded yet.
 * In most cases this would be an error in a script
 * before the Core loading.
 * @param message
 */
window.onerror = (message) => {
  if (DdmApi.rmmzInit) return;
  if (!document.getElementById("errorPrinter")) {
    const loadingSpinner = document.getElementById("loadingSpinner");
    if (loadingSpinner) document.body.removeChild(loadingSpinner);
    const errorPrinter = document.createElement("div");
    errorPrinter.id = "errorPrinter";
    errorPrinter.innerHTML = makeErrorHtml(
      "An Error has occurred: ",
      `${message}`
    );
    document.body.appendChild(errorPrinter);
  }
};

// ===================================================
//                      INIT API

const title = document.getElementById("title")?.innerText;
export const TITLE = title ? title : "Ddm Draegonis";

window.DdmApi = window.DdmApi || {};
DdmApi.rmmzInit = false;
DdmApi.init = initApi;

// ===================================================
//                   EVENT LISENERS

let winFocsed = false;

export const isWinFocus = () => winFocsed;

const setWindowTickState = (state: boolean) =>
  DdmApi.NM ? DdmApi.NM.windowTickState(state) : undefined;

window.addEventListener("load", () => {
  winFocsed = true;
});

window.addEventListener("focus", () => {
  winFocsed = true;
  setWindowTickState(winFocsed);
});

window.addEventListener("blur", () => {
  winFocsed = false;
  setWindowTickState(winFocsed);
});
