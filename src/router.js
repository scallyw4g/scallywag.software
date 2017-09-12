let RoutingMode_Undefined = 0;
let RoutingMode_PushState = 1;
let RoutingMode_Hash = 2;

function MakeRoute(DomElem) {
  Assert(DomElem instanceof HTMLElement);
  this.DomElem = DomElem
}

document.addEventListener( "framework-loaded", (Event) => {

  console.log("router framework-loaded");

  let State = Event.detail;
  let Router = State.Router;

  // JANKY(Jesse): Replace the navigate function once the framework is loaded
  // and perform all pending navigations.
  Router.navigate = (targetRoute) => {
    console.log("Navigating from %s to %s", Router.currentRoute, targetRoute);

    let Current = Router.routes[Router.currentRoute];
    if (Current) {
      SetDisplay(Current.DomElem, DISPLAY_NONE);
      if (Router.routingMode === RoutingMode_PushState)
        history.pushState({}, "", Router.currentRoute);
    }

    let Target = Router.routes[targetRoute];
    if (Target) {
      if (Router.routingMode === RoutingMode_PushState)
        history.replaceState({}, "", targetRoute);
      else
        document.location.hash = targetRoute;

      SetDisplay(Target.DomElem, DISPLAY_BLOCK);
      if (Target.Main) Target.Main(State);

    } else { // Invalid route passed in
      Router.navigate("/404", State);
    }
  }

  for ( let NavigationIndex = 0;
        NavigationIndex < Router.pendingNavigations.length;
        ++NavigationIndex)
  {
    let Nav = Router.pendingNavigations[NavigationIndex];
    Router.navigate(Nav, State);
  }

});

function MakeRouter() {

  this.currentRoute = '/';
  this.routingMode = RoutingMode_Undefined;

  this.routes = {};

  // Before the framework is initialized, Router.navigate pushes stuff into
  // this array.  Once the framework loads it is flushed and, at the time of
  // this writing, never used again.
  this.pendingNavigations = [];

  {
    let initialNav = null;

    if ( history.pushState && document.location.protocol != "file:") {
      this.routingMode = RoutingMode_PushState;
    } else {
      this.routingMode = RoutingMode_Hash;
    }
  }

  this.Initialize = function(State) {
    let RouteElements = Array.from(document.getElementsByClassName("route"));
    for ( let RouteIndex = 0;
          RouteIndex < RouteElements.length;
          ++RouteIndex)
    {
      let RouteElem = RouteElements[RouteIndex];
      this.routes[ RouteElem.dataset.route ] = new MakeRoute(RouteElem);
      SetDisplay(RouteElem, DISPLAY_NONE);
    }

    let initialNav = "/";

    if ( this.routingMode === RoutingMode_Hash &&
         document.location.hash.length > 0)
    {
      Assert(document.location.hash[0] === '#');
      initialNav = document.location.hash;
      initialNav = initialNav.substring(1);
    }
    else if ( this.routingMode === RoutingMode_PushState &&
              document.location.pathname.length > 0)
    {
      initialNav = document.location.pathname;
    }

    this.navigate(initialNav, State);

    return;
  }

  // Stub method to cache navigations before the framework is fully loaded
  this.navigate = function(targetRoute, State) {
    console.log("Caching nav to ", targetRoute);
    this.pendingNavigations.push(targetRoute);

    return;
  }

}
