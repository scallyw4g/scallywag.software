UserCallback( (State) => {
  console.log("binding vim callback");

  let Route = State.Router.routes["/vim"];

  Route.Main = (State) => {

    console.log("vim callback firing");

    let MainBounds = document.querySelector("#vim-inner").getBoundingClientRect();
    let width = MainBounds.right - MainBounds.left;

    let BottomBar = Route.Dom.querySelector("#bottom-bar");
    BottomBar.style.width = width;
    console.log(width);


    let Router = State.Router;
    Assert(Router instanceof MakeRouter);

    let ElementsToType = Array.from(Route.Dom.getElementsByClassName("gets-typed"))
      .map((Dom) => { return new TypedElement(Dom); });

    InitCursor(ElementsToType[0]);
    Render(Route.Dom);

    wait(200)
      .then( blinkCursor.bind(this, Route.Dom, 1) )
      .then( wait.bind(this, 100) )
      .then( typeText.bind(this, ElementsToType[0], Route.Dom, 150) )
      .then( typeText.bind(this, ElementsToType[1], Route.Dom) )
      .then( typeText.bind(this, ElementsToType[2], Route.Dom) )
      .then( typeText.bind(this, ElementsToType[3], Route.Dom) )
      .then( typeText.bind(this, ElementsToType[4], Route.Dom) )
      .then( typeText.bind(this, ElementsToType[5], Route.Dom) )
      .then( typeText.bind(this, ElementsToType[6], Route.Dom) )
      .then( typeText.bind(this, ElementsToType[7], Route.Dom) )
      .then( typeText.bind(this, ElementsToType[8], Route.Dom, 0) )
      .then( wait.bind(this, 200) )
      .then( blinkCursor.bind(this, Route.Dom, 2) )
      .then(() => {
        PurgeCursors(Route.Dom);
        Render(Route.Dom);
    });
  }

});

