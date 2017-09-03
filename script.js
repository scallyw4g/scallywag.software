"use strict";

let VISIBILITY_OFF = "hidden";
let VISIBILITY_ON = "visible";

let DISPLAY_INLINE_BLOCK = "inline-block";
let DISPLAY_BLOCK = "block";
let DISPLAY_NONE = "none";

let TypingElement = null;

let InvalidCodePath = () => { Assert(!"InvalidCodePath"); }

let Assert = ( expression ) => {
  if (!(expression)) {
    throw new Error("Failed Assertion").stack;

  }
}

let PageLoaded = () => {
  let Result = document.readyState === 'complete';
  return Result;
}

let WaitTillLoaded = setInterval( () => {
  document.body.style.visibility = VISIBILITY_OFF;
  if ( PageLoaded() ) {
    clearInterval(WaitTillLoaded);
    Init().then ( (typedElements) => Main(typedElements) );
  }
}, 5);

function TypedElement(Elem) {
  this.Content = Elem.innerHTML.split("");
  this.FinalBounds = Elem.getBoundingClientRect();

  this.DomElem = Elem;
}

let SetVisibility = (element, vis) => {
  Assert(element instanceof HTMLElement);
  element.style.visibility = vis;
}

let ToggleDisplay = (element, d1, d2) => {
  Assert(element instanceof HTMLElement);
  let display = window.getComputedStyle(element).display;

  if (display === d1) {
    element.style.display = d2;

  } else if (display === d2) {
    element.style.display = d1;

  } else { InvalidCodePath() }
}

let SetDisplay = (element, display) => {
  Assert(element instanceof HTMLElement);
  element.style.display = display;
}

let blink = (Cursor) => {
  let blinkTime = 750;
  let blinkTick = blinkTime/3;

  return new Promise( (resolve, reject) => {
    SetVisibility(Cursor, VISIBILITY_ON);

    setTimeout( () => {
      SetVisibility(Cursor, VISIBILITY_OFF);
    }, blinkTick );

    setTimeout( () => {
      SetVisibility(Cursor, VISIBILITY_ON);
    }, blinkTick*2 );

    setTimeout( () => {
      resolve();
    }, blinkTick*3 );
  });
}

let blinkCursor = (Cursor, count) => {

  let promise = new Promise( (resolve) => { resolve() } );

  while (--count >= 0) {
    promise = promise.then( () => {
      return blink(Cursor);
    });
  }

  return promise;
}

let setCursorDim = (Cursor, {width, height}) => {
  Cursor.style.width = width + "px";
  Cursor.style.height = height + "px";
}

let setCursorP = (Cursor, {x, y}) => {
  Cursor.style.position = "fixed";
  Cursor.style.left = x;
  Cursor.style.top = y;

  return;
}

let UpdateCursor = (Cursor, Elem) => {
  Assert(Elem instanceof TypedElement);
  let bounds = Elem.DomElem.getBoundingClientRect();

  let height = bounds.bottom - bounds.top;
  let width = 0.35 * height;

  let x = bounds.left + Elem.DomElem.offsetWidth;
  let y = bounds.top + Elem.DomElem.offsetHeight - height;

  setCursorP(Cursor, {x,y} );
  setCursorDim(Cursor, {width, height});

  return;
}

let typeText = (Elem, Cursor, finalDelay = 500) => {
  Assert(Elem instanceof TypedElement);
  let charInterval = 50;

  return new Promise( (resolve, reject) => {
      PrepareToType(Cursor, Elem);
      setTimeout( () => {
        resolve();
      }, charInterval );

  }).then( () => {

    return new Promise( (resolve, reject) => {

      SetVisibility(Elem.DomElem, VISIBILITY_ON);

      let text = Elem.Content;
      Elem.DomElem.innerHTML = "";

      let anim = setInterval( () => {

        if (text.length == 0) {
          setTimeout( () => { clearInterval(anim); resolve(); }, finalDelay );

        } else {
          Elem.DomElem.innerHTML += text.shift();
          UpdateCursor(Cursor, Elem);
        }

      }, charInterval );
    });

  });
}

let RewindCursor = (Cursor, Elem) => {
  Assert(Elem instanceof TypedElement);
  let bounds = Elem.DomElem.getBoundingClientRect();

  let x = bounds.left;
  let y = Cursor.style.top;

  setCursorP(Cursor, {x,y} );
}

let SetHeight = (DomElem, Bounds) => {
  Assert(DomElem instanceof HTMLElement);
  DomElem.style.height = Bounds.bottom - Bounds.top;;
}

let PrepareToType = (Cursor, Elem) => {
  Assert(Elem instanceof TypedElement);

  SetHeight(Elem.DomElem, Elem.FinalBounds);

  SetDisplay(Elem.DomElem, DISPLAY_INLINE_BLOCK);
  SetVisibility(Elem.DomElem, VISIBILITY_OFF);

  UpdateCursor(Cursor, Elem);
  RewindCursor(Cursor, Elem);
}

let Init = () => {
  return new Promise ( (resolve) => {

    let typedElements = Array.from(document.getElementsByClassName("gets-typed"));

    let content = Array.from(document.getElementsByClassName("content"));
    let Cursor = document.getElementById("cursor");

    let firstElem = new TypedElement(typedElements[0]);

    let mainElements = [];

    PrepareToType(Cursor, firstElem);

    for ( let Index = 0;
          Index < typedElements.length;
          ++Index)
    {
      let Elem = typedElements[Index];
      mainElements.push(new TypedElement(Elem));

      SetDisplay(Elem, DISPLAY_NONE);
    }

    for ( let Index = 0;
          Index < content.length;
          ++Index)
    {
      let Elem = content[Index];
      SetDisplay(Elem, DISPLAY_NONE);
    }

    document.body.style.visibility = VISIBILITY_ON;

    resolve(mainElements);
  });
}

let Main = (elements) => {

  let Cursor = document.getElementById("cursor");

  blinkCursor(Cursor, 1).then( () => {
    return typeText(elements[0], Cursor);
  }).then ( () => {
    return typeText(elements[5], Cursor, 500);
  }).then( () => {
    return typeText(elements[1], Cursor);
  }).then( () => {
    return typeText(elements[2], Cursor);
  }).then ( () => {
    return typeText(elements[3], Cursor);
  }).then ( () => {
    return typeText(elements[4], Cursor, 0);
  }).then ( () => {
    return blinkCursor(Cursor, 1);
  }).then ( () => {
    return typeText(elements[6], Cursor, 0);
  }).then ( () => {
    return blinkCursor(Cursor, 1);
  }).then ( () => {
    return typeText(elements[7], Cursor, 300);
  })



  let headings = Array.from(document.getElementsByClassName("heading"));

  for ( let headingIndex = 0;
        headingIndex < headings.length;
        ++headingIndex )
  {
    let Elem = headings[headingIndex];

    Elem.onclick = (event) => {
      let sibling = event.target.nextElementSibling;
      ToggleDisplay(sibling, DISPLAY_NONE, DISPLAY_BLOCK);
    }

  }

  let count = 0;

}
