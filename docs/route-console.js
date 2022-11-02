MainCallback(ROUTE_INTRO, (State, Route) => {
  Assert(State instanceof AppState);
  Assert(Route instanceof MakeRoute);

  let ElementsToType = Array.from(document.body.getElementsByClassName("gets-typed"))
    .map((Dom) => { return new TypedElement(Dom); });

  PurgeCursors(document.body);
  InitCursor(ElementsToType[0]);

  blinkCursor(Route, 2)
    .then(() => { return typeText(ElementsToType[0], Route) }, ChainRejection)
    .then(() => { return typeText(ElementsToType[1], Route) }, ChainRejection)
    .then(() => { return wait(60, Route)                    }, ChainRejection)
    .then(() => { return blinkCursor(Route, 1)              }, ChainRejection)
    .then(() => { return wait(60, Route)                    }, ChainRejection)
    .then(() => { return new Promise( (resolve) => {
      PurgeCursors(document.body);
      InitCursor(ElementsToType[2]);
      resolve();
    })                                                      }, ChainRejection)
    .then(() => { return wait(140, Route)                   }, ChainRejection)
    .then(() => {
      CompleteAnimation(Route, INTRO_ANIM_COMPLETE);
      State.Router.navigate(ROUTE_VIM_INDEX);
    }, ChainRejection)
    .catch( () => {
      CompleteAnimation(Route, INTRO_ANIM_COMPLETE);
      Route.AnimationStatus.cancelled = false;
      State.Router.navigate(ROUTE_VIM_INDEX);
    })

    Assert(Route.AnimationStatus.cancelled == false);

    document.body.onclick = e => {
      document.body.onclick = null;
      e.stopPropagation();
      Route.AnimationStatus.cancelled = true;
    }

});
