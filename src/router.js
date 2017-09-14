document.addEventListener( USER_CALLBACKS_COMPLETE, (Event) => {
  console.log("overriding router.navigate");

  let State = Event.detail;
  let Router = State.Router;

  // JANKY(Jesse): Replace the navigate function once the framework is loaded
  // and perform all pending navigations.
  Router.navigate = (url) => {

    let routeToLookup = url;
    let alias = Router.aliases[url];
    if (alias) {
      console.log("Route %s aliased to %s", url, routeToLookup);
      routeToLookup = alias;
    }

    console.log("Navigating from %s to %s", Router.currentRoute, url);

    let Current = Router.routes[Router.currentRoute];
    if (Current) {
      SetDisplay(Current.Dom, DISPLAY_NONE);
      if (Router.routingMode === RoutingMode_PushState)
        history.pushState({}, "", Router.currentRoute);
    }

    let TargetRoute = Router.routes[routeToLookup];
    if (TargetRoute) {
      Router.currentRoute = url;
      if (Router.routingMode === RoutingMode_PushState)
        history.replaceState({}, "", url);
      else
        document.location.hash = url;

      // It's important to render the route initially before firing the Routes
      // Main() because then the route can query the rendered Dom
      SetDisplay(TargetRoute.Dom, DISPLAY_BLOCK);
      Render(TargetRoute.Dom);

      if (TargetRoute.Main) TargetRoute.Main(State);

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

  this.aliases = {};

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
    let RouteElements = Array.from(document.getElementsByClassName("route"))
      .map( (Dom) => {
        let Route = new MakeRoute(Dom.cloneNode(true));
        this.routes[Route.Name] = Route;
        SetDisplay(Route.Dom, DISPLAY_NONE);
      });

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

  this.alias = function(targetRoute, aliasName) {
    this.aliases[targetRoute] = aliasName;
  }

}
