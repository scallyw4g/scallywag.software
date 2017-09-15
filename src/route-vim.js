UserCallback( (State) => {
  document.body.onclick = () => { console.log('hi') }
  document.onkeydown = () => { console.log('key') }
});

UserCallback( (State) => {
  console.log("binding vim callback");

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

    wait(200)
      .then(() => { return blinkCursor(Route.Dom, 1) })
      .then(() => { return wait(100) })
      .then(() => { return typeText(ElementsToType[0], Route.Dom, 150) })
      .then(() => { return typeText(ElementsToType[1], Route.Dom) })
      .then(() => { return typeText(ElementsToType[2], Route.Dom) })
      .then(() => { return typeText(ElementsToType[3], Route.Dom) })
      .then(() => { return typeText(ElementsToType[4], Route.Dom) })
      .then(() => { return typeText(ElementsToType[5], Route.Dom) })
      .then(() => { return typeText(ElementsToType[6], Route.Dom) })
      .then(() => { return typeText(ElementsToType[7], Route.Dom) })
      .then(() => { return typeText(ElementsToType[8], Route.Dom, 0) })
      .then(() => { return wait(200) })
      .then(() => { return blinkCursor(Route.Dom, 2) })
      .then(() => { PurgeCursors(Route.Dom); })
  }

});

