
BindBottomBarCallbacks = (State) => {
  Assert(State instanceof AppState);

  let Home = document.querySelector("#home-link");
  Home.onclick = e => {State.Router.navigate("/");}

  let Credits = document.querySelector("#credits-link");
  Credits.onclick = e => {State.Router.navigate(ROUTE_VIM_CREDITS);}

  let Blog = document.querySelector("#blog-link");
  Blog.onclick = e => {State.Router.navigate(ROUTE_VIM_BLOG);}

  let Intro = document.querySelector("#intro-link");
  Intro.onclick = e => {ClearAllCookies(); State.Router.navigate(ROUTE_INTRO);}
}

function ToggleClass(element, class1, class2)
{
  if (element.classList.contains(class1)) {
    element.classList.remove(class1);
    element.classList.add(class2);
  } else {
    element.classList.add(class1);
    element.classList.remove(class2);
  }
}


InitCallback( ROUTE_VIM, (State, Route) => {
  console.log(Route);
  BindBottomBarCallbacks(State);
});


MainCallback(ROUTE_VIM_INDEX, (State, Route) => {
  Assert(State instanceof AppState);
  Assert(Route instanceof MakeRoute);

  let headings = Array.from(document.body.getElementsByClassName("click-expand"));
  headings.forEach( (Elem) => {
    Elem.addEventListener('click', (event) => {
      let sibling = event.target.nextElementSibling;
      if (sibling) { ToggleClass(sibling, 'slide-down', 'slide-up') }
    });
  });

  if (!ReadCookie(INDEX_ANIM_COMPLETE)) {

    let ElementsToType = Array.from(document.body.getElementsByClassName("gets-typed"))
      .map((Dom) => { return new TypedElement(Dom); });

    InitCursor(ElementsToType[0]);

    let CompleteAnimation = () => {
      document.body.onclick = null;
      SetCookie({name: INDEX_ANIM_COMPLETE, value: true});
    }

    console.log('ELEMENTSTOTYPE        ', ElementsToType);

    wait(200, Route)
      .then( () => { return blinkCursor(Route, 1)                      }, ChainRejection )
      .then( () => { return wait(100, Route)                           }, ChainRejection )
      .then( () => { return typeText(ElementsToType[0], Route, 150)    }, ChainRejection )
      .then( () => { return typeText(ElementsToType[1], Route)         }, ChainRejection )
      .then( () => { return typeText(ElementsToType[2], Route)         }, ChainRejection )
      .then( () => { return typeText(ElementsToType[3], Route)         }, ChainRejection )
      .then( () => { return typeText(ElementsToType[4], Route)         }, ChainRejection )
      .then( () => { return typeText(ElementsToType[5], Route)         }, ChainRejection )
      .then( () => { return typeText(ElementsToType[6], Route)         }, ChainRejection )
      .then( () => { return typeText(ElementsToType[7], Route)         }, ChainRejection )
      .then( () => { return typeText(ElementsToType[8], Route)         }, ChainRejection )
      .then( () => { return typeText(ElementsToType[9], Route, 0)      }, ChainRejection )
      .then( () => { return wait(200, Route)                           }, ChainRejection )
      .then( () => { return blinkCursor(Route, 2)                      }, ChainRejection )
      .then( () => { PurgeCursors(document.body); CompleteAnimation(); }, ChainRejection )
      .catch(() => { console.log("Animation Cancelled"); CompleteAnimation(); });

    document.body.onclick = e => {
      Route.AnimationStatus.cancelled = true;
      Render(ROUTE_VIM_INDEX, State.Router);
      Route.Init(State, Route);
    }
  }
});

