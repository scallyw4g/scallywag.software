UserCallback( (State) => {
  console.log("binding vim Dom Callbacks");

  let Route = State.Router.routes["/vim"];

  Route.Callbacks = () => {
    let Credits = State.Dom.querySelector("#credits-link");
    Credits.onclick = e => {State.Router.navigate("/credits");}

    let Intro = State.Dom.querySelector("#intro-link");
    Intro.onclick = e => {State.Router.navigate("/intro");}
  }
});

UserCallback( (State) => {
  console.log("binding vim Main");

  let Route = State.Router.routes["/vim"];
  Route.Main = (State) => {
    console.log("vim callback firing");

    let Vim = document.querySelector("#vim");

    let MainBounds = document.querySelector("#vim-inner").getBoundingClientRect();
    let width = MainBounds.right - MainBounds.left;

    let BottomBar = Route.Dom.querySelector("#bottom-bar");
    BottomBar.style.width = width;

    let Router = State.Router;
    Assert(Router instanceof MakeRouter);

    let ElementsToType = Array.from(Route.Dom.getElementsByClassName("gets-typed"))
      .map((Dom) => { return new TypedElement(Dom); });

    InitCursor(ElementsToType[0]);

    let ChainReject = (e) => {
      return new Promise( (_, reject) => { reject(e); });
    }

    wait(5000, Route)
      .then(() => { console.log("fulfilling1"); return blinkCursor(Route, 1)                    }, (e) => { console.log("rejected1",  e); return ChainReject(e) })
      .then(() => { console.log("fulfilling2"); return wait(100, Route)                         }, (e) => { console.log("rejected2",  e); return ChainReject(e) })
      .then(() => { console.log("fulfilling3"); return typeText(ElementsToType[0], Route, 150)  }, (e) => { console.log("rejected3",  e); return ChainReject(e) })
      .then(() => { console.log("fulfilling4"); return typeText(ElementsToType[1], Route)       }, (e) => { console.log("rejected4",  e); return ChainReject(e) })
      .then(() => { console.log("fulfilling5"); return typeText(ElementsToType[2], Route)       }, (e) => { console.log("rejected5",  e); return ChainReject(e) })
      .then(() => { console.log("fulfilling6"); return typeText(ElementsToType[3], Route)       }, (e) => { console.log("rejected6",  e); return ChainReject(e) })
      .then(() => { console.log("fulfilling7"); return typeText(ElementsToType[4], Route)       }, (e) => { console.log("rejected7",  e); return ChainReject(e) })
      .then(() => { console.log("fulfilling8"); return typeText(ElementsToType[5], Route)       }, (e) => { console.log("rejected8",  e); return ChainReject(e) })
      .then(() => { console.log("fulfilling9"); return typeText(ElementsToType[6], Route)       }, (e) => { console.log("rejected9",  e); return ChainReject(e) })
      .then(() => { console.log("fulfilling10"); return typeText(ElementsToType[7], Route)      }, (e) => { console.log("rejected10", e); return ChainReject(e) })
      .then(() => { console.log("fulfilling11"); return typeText(ElementsToType[8], Route, 0)   }, (e) => { console.log("rejected11", e); return ChainReject(e) })
      .then(() => { console.log("fulfilling12"); return wait(200, Route)                        }, (e) => { console.log("rejected12", e); return ChainReject(e) })
      .then(() => { console.log("fulfilling13"); return blinkCursor(Route, 2)                   }, (e) => { console.log("rejected13", e); return ChainReject(e) })
      .then(() => { console.log("fulfilling14"); PurgeCursors(Route.Dom);                       }, (e) => { console.log("rejected14", e); return ChainReject(e) })
      .catch((e) => { console.log("cancelled", e) })
  }
});

