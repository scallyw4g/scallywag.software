
function MakeRoute(DomElem) {
  Assert(DomElem instanceof HTMLElement);

  this.DomElem = DomElem
}

function MakeRouter(initialRoute) {

  this.currentRoute = initialRoute;

  this.routes = {};

  this.navigate = (targetRoute, State) => {

    let Current = this.routes[this.currentRoute];
    let Target = this.routes[targetRoute];

    if (Current) {
      SetVisibility(Current.DomElem, VISIBILITY_OFF);
    }

    if ( Target ) {

      SetVisibility(Target.DomElem, VISIBILITY_ON);

      if (Target.Main) {
        Target.Main(State);
      }

      // TODO(Jesse): This is fucking us somehow?
      history.pushState({}, "", this.currentRoute);
      history.replaceState({}, "", targetRoute);

    } else {
      Assert(!"Invalid route passed");
    }
  }
}
