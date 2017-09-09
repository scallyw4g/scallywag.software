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
    Init().then ( (data) => Main(data.mainElements, data.Cursor) );
  }
}, 5);

function MakeCursor(Elem) {
  this.Target = null;
  this.DomElem = Elem;
}

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
    SetVisibility(Cursor.DomElem, VISIBILITY_OFF);

    setTimeout( () => {
      SetVisibility(Cursor.DomElem, VISIBILITY_ON);
    }, blinkTick );

    setTimeout( () => {
      resolve();
    }, blinkTick*3 );
  });
}

let blinkCursor = (Cursor, count) => {
  Assert(Cursor instanceof MakeCursor);

  let promise = new Promise( (resolve) => { resolve() } );

  while (--count >= 0) {
    promise = promise.then( () => {
      return blink(Cursor);
    });
  }

  return promise;
}

let SetCursorDim = (Cursor, {width, height}) => {
  Assert(Cursor instanceof MakeCursor);

  Cursor.DomElem.style.width = width + "px";
  Cursor.DomElem.style.height = height + "px";

  return;
}

let SetCursorP = (Cursor, {x, y}) => {
  Assert(Cursor instanceof MakeCursor);

  Cursor.DomElem.style.display = "fixed";
  Cursor.DomElem.style.left = x;
  Cursor.DomElem.style.top = y;

  return;
}

let UpdateCursorP = (Cursor, Elem) => {
  Assert(Cursor instanceof MakeCursor);
  Assert(Elem instanceof TypedElement);

  let bounds = Elem.DomElem.getBoundingClientRect();

  let height = bounds.bottom - bounds.top;
  let width = 0.35 * height;

  let x = bounds.left + Elem.DomElem.offsetWidth;
  let y = bounds.top + Elem.DomElem.offsetHeight - height;

  SetCursorP(Cursor, {x,y} );
  SetCursorDim(Cursor, {width, height});

  return;
}

let typeText = (Elem, Cursor, finalDelay = 500) => {
  Assert(Cursor instanceof MakeCursor);
  Assert(Elem instanceof TypedElement);
  let charInterval = 50;

  return new Promise( (resolve, reject) => {

      PrepareToType(Cursor, Elem);
      setTimeout( () => { resolve(); }, charInterval );

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
          UpdateCursorP(Cursor, Elem);
        }

      }, charInterval );
    });

  });
}

let RewindCursor = (Cursor, Elem) => {
  Assert(Elem instanceof TypedElement);
  let bounds = Elem.DomElem.getBoundingClientRect();

  let x = bounds.left;
  let y = Cursor.DomElem.style.top;

  SetCursorP(Cursor, {x,y} );
}

let SetHeight = (DomElem, Bounds) => {
  Assert(DomElem instanceof HTMLElement);
  DomElem.style.height = Bounds.bottom - Bounds.top;;
}

let PrepareToType = (Cursor, Elem) => {
  Assert(Cursor instanceof MakeCursor);
  Assert(Elem instanceof TypedElement);

  Cursor.Target = Elem;

  // Set the height of the elem so it doesn't flicker the rest when setting
  // display: none
  SetHeight(Elem.DomElem, Elem.FinalBounds);

  SetDisplay(Elem.DomElem, DISPLAY_INLINE_BLOCK);
  SetVisibility(Elem.DomElem, VISIBILITY_OFF);

  // TODO(Jesse): Calling these together is inefficient.. should they be a
  // single call or something?
  UpdateCursorP(Cursor, Elem);
  RewindCursor(Cursor, Elem);
}

let Init = () => {
  return new Promise ( (resolve) => {

    let typedElements = Array.from(document.getElementsByClassName("gets-typed"));

    let content = Array.from(document.getElementsByClassName("content"));
    let Cursor = new MakeCursor(document.getElementById("cursor"));
    Assert(Cursor instanceof MakeCursor);

    document.body.onresize = () => UpdateCursorP(Cursor, Elem);

    let mainElements = [];

    // Hack to initialize the cursor
      let firstElem = new TypedElement(typedElements[0]);
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

    resolve({mainElements, Cursor});
  });
}

let Main = (elements, Cursor) => {

  Assert(elements);
  Assert(Cursor instanceof MakeCursor);

  blinkCursor(Cursor, 3).then( () => {
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
    return typeText(elements[4], Cursor);
  }).then ( () => {
    return typeText(elements[6], Cursor, 0);
  }).then ( () => {
    return blinkCursor(Cursor, 3);
  }).then ( () => {
    SetDisplay(Cursor.DomElem, DISPLAY_NONE);
    // return typeText(elements[7], Cursor, 300);
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
