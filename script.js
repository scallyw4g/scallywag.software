"use strict";

let globalElem = null;

let InvalidCodePath = () => { Assert(!"InvalidCodePath"); }

let Assert = ( expression ) => {
  if (!(expression))
    throw "Failed Assertion";
}

let PageLoaded = () => {
  let Result = document.readyState === 'complete';
  return Result;
}

let WaitTillLoaded = setInterval( () => {
  if ( PageLoaded() ) {
    clearInterval(WaitTillLoaded);
    Main();
  }
}, 5);

// let BindCallback = (id, event, callback) => {
//   Assert( typeof(id) === "string" );
//   Assert( typeof(event) === "string" );
//   Assert( typeof(callback) === "function" );

//   let Elem = document.getElementById(id);
//   console.log(Elem);
//   Elem['on' + event] = callback;
// }


let ToggleVisible = (element) => {
  let display = window.getComputedStyle(element).display;

  if (display === "block") {
    element.style.display = "none";

  } else if (display === "none") {
    element.style.display = "block";

  } else { InvalidCodePath() }

}

let Main = () => {

  let headings = Array.from(document.getElementsByClassName("heading"));

  headings.forEach( (elem) => {
    globalElem = elem;
    elem.onclick = (event) => {
      ToggleVisible(event.target.nextElementSibling);

    }
  });

}
