"use strict";

let VISIBILITY_OFF = "hidden";
let VISIBILITY_ON = "visible";

let DISPLAY_INLINE_BLOCK = "inline-block";
let DISPLAY_BLOCK = "block";
let DISPLAY_NONE = "none";

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

let ToggleDisplay = (element, d1, d2) => {
  let display = window.getComputedStyle(element).display;

  if (display === d1) {
    element.style.display = d2;

  } else if (display === d2) {
    element.style.display = d1;

  } else { InvalidCodePath() }
}

let SetDisplay = (element, display) => {
  element.style.display = display;
}

let blink = (cursor) => {
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

let positionCursor = (cursor) => {

}

let blinkCursor = (cursor, count) => {

  let promise = new Promise( (resolve) => { resolve() } );

  while (--count >= 0) {
    promise = promise.then( () => {
      return blink(cursor);
    });
  }

  return promise;
}

let typeText = (elem, finalDelay = 80) => {

  return new Promise( (resolve, reject) => {
    let text = elem.innerHTML.split("");
    elem.innerHTML = "";

    SetDisplay(elem, DISPLAY_INLINE_BLOCK);

    let anim = setInterval( () => {
      if (text.length == 0) {
        setTimeout( () => {
          clearInterval(anim);
          resolve();
        }, finalDelay );

      } else {
        elem.innerHTML += text.shift();

        let bounds = elem.getBoundingClientRect();
        let x = bounds.left + elem.offsetWidth;
        let y = bounds.top + elem.offsetHeight;
        console.log({x,y});
        // setCursorP(cursor, {x,y} );
      }

    }, 0 );

  });
}

let Main = () => {

  let typedElements = Array.from(document.getElementsByClassName("gets-typed"));
  let cursor = document.getElementById("cursor");

  blinkCursor(cursor, 1).then( () => {
    return typeText(typedElements[0], 0);
  }).then ( () => {
    return typeText(typedElements[5], 500);
  }).then( () => {
    return typeText(typedElements[1]);
  }).then( () => {
    return typeText(typedElements[2]);
  }).then ( () => {
    return typeText(typedElements[3]);
  }).then ( () => {
    return typeText(typedElements[4], 1000);
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
      let sibling = event.target.nextElementSibling;
      ToggleDisplay(sibling, DISPLAY_NONE, DISPLAY_BLOCK);
    }

  }

  let count = 0;

}
