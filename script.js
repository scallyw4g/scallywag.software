"use strict";

let VISIBILITY_OFF = "hidden";
let VISIBILITY_ON = "visible";

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


let SetVisibility = (element, vis) => {
  element.style.visibility = vis;
}

let ToggleVisibility = (element) => {
  let visibility = window.getComputedStyle(element).visibility;

  if (visibility === VISIBILITY_ON) {
    element.style.visibility = VISIBILITY_OFF;

  } else if (visibility === VISIBILITY_OFF) {
    element.style.visibility = VISIBILITY_ON;

  } else { InvalidCodePath() }

}

let ToggleDisplay = (element) => {
  let display = window.getComputedStyle(element).display;

  if (display === "block") {
    element.style.display = "none";

  } else if (display === "none") {
    element.style.display = "block";

  } else { InvalidCodePath() }

}

let blink = () => {
  let blinkTime = 500;

  return new Promise( (resolve, reject) => {
    SetVisibility(cursor, VISIBILITY_ON);

    setTimeout( () => {
      SetVisibility(cursor, VISIBILITY_OFF);
    }, blinkTime );

    setTimeout( () => {
      resolve();
    }, blinkTime + 250 );
  });
}

let blinkCursor = (count) => {
  let cursor = document.getElementById("cursor");

  let promise = new Promise( (resolve) => { resolve() } );

  while (--count >= 0) {
    promise = promise.then( () => {
      return blink();
    });
  }

  return promise;
}

let typeText = (elem) => {

  return new Promise( (resolve, reject) => {
    let text = elem.innerHTML.split("");
    elem.innerHTML = "";

    ToggleDisplay(elem);

    let anim = setInterval( () => {
      if (text.length == 0) {
        setTimeout( () => {
          clearInterval(anim);
          resolve();
        }, 80 );

      } else {
        elem.innerHTML += text.shift();
      }

    }, 50 );

  });
}

let Main = () => {

  let typedElements = Array.from(document.getElementsByClassName("gets-typed"));

  blinkCursor(4).then( () => {
    return typeText(typedElements[0]);
  }).then ( () => {
    return typeText(typedElements[5]);
  }).then( () => {
    return typeText(typedElements[1]);
  }).then( () => {
    return typeText(typedElements[2]);
  }).then ( () => {
    return typeText(typedElements[3]);
  }).then ( () => {
    return typeText(typedElements[4]);
  }).then ( () => {
    return typeText(typedElements[6]);
  })



  let headings = Array.from(document.getElementsByClassName("heading"));

  for ( let headingIndex = 0;
        headingIndex < headings.length;
        ++headingIndex )
  {
    let elem = headings[headingIndex];

    elem.onclick = (event) => {
      ToggleDisplay(event.target.nextElementSibling);
    }

  }

  let count = 0;

}
