document.addEventListener( USER_CALLBACKS_COMPLETE, (Event) => {
  console.log("overriding router.navigate");

  let State = Event.detail;
  let Router = State.Router;

  // JANKY(Jesse): Replace the navigate function once the framework is loaded
  // and perform all pending navigations.
  Router.navigate = (url) => {
    console.log("Navigating from %s to %s", Router.currentRoute, url);

    let currentLookup = Router.CheckRootAlias(Router.currentRoute);
    let Current = Router.routes[currentLookup];

    if (Current) {
      Current.AnimationStatus.cancelled = true;
      if (Current.UserData.Animation && Current.Teardown) {
        Current.UserData.Animation.then( () => {
          Current.Teardown(Current);
        });
      }

      if (Router.routingMode === RoutingMode_PushState)
        history.pushState({}, "", Router.currentRoute);
    }

    let targetLookup = Router.CheckRootAlias(url);
    let TargetRoute = Router.routes[targetLookup];
    if (TargetRoute) {

      TargetRoute.AnimationStatus.cancelled = false;
      Router.currentRoute = url;
      if (Router.routingMode === RoutingMode_PushState)
        history.replaceState({}, "", url);
      else
      {
        document.body.onhashchange = null;
        document.location.hash = url;
        document.body.onhashchange = this.OnHashChange;
      }

      // It's important to render the route initially before firing the Routes
      // Main() because then the route can query the rendered Dom
      PurgeCursors(TargetRoute.Dom);
      Render(TargetRoute.Dom);

      if (TargetRoute.Main) console.log(TargetRoute.Name, " Running Main"); TargetRoute.Main(State);

      Assert(TargetRoute.AnimationStatus instanceof AnimationStatus);

    } else { // Invalid route passed in
      Router.navigate("/404");
    }
  }


  Router.pendingNavigations.forEach( (Nav) => {
    Router.navigate(Nav);
  });

  delete Router.pendingNavigations;
});

function MakeRouter(Root) {

  /* Data Properties
   * **********************************************************************/

  // Before the framework is initialized, Router.navigate pushes stuff into
  // this array.  Once the framework loads it is flushed and deleted.
  this.pendingNavigations = [];

  this.root = Root;

  this.currentRoute = null;
  this.routingMode = RoutingMode_Undefined;

  this.routes = {};

  /* Namespaced Functions
   * **********************************************************************/

  this.CheckRootAlias = function(Route) {
    let Lookup = Route;
    if (Lookup === "/") Lookup = this.root;
    return Lookup;
  }


  this.GetUrl = function() {
    let Url = null;

    if ( this.routingMode === RoutingMode_Hash &&
         document.location.hash.length > 0)
    {
      const DocHash = document.location.hash;
      if (DocHash.length > 0) {
        Assert(DocHash[0] === '#');
        Url = DocHash.substring(1);;
      }
    }
    else if ( this.routingMode === RoutingMode_PushState &&
              document.location.pathname.length > 0)
    {
      Url = document.location.pathname;
    }
    else
    {
      Url = "/";
    }

    return Url;
  }

  // Stub method to cache navigations before the framework is fully loaded
  this.navigate = function(targetRoute) {
    console.log("Caching nav to ", targetRoute);
    this.pendingNavigations.push(targetRoute);
  }

  this.OnHashChange = function() {
    let Url = this.GetUrl();
    this.navigate(Url, State);
  }



  /* Initialization
   * **********************************************************************/
  console.log("Router.Initialize");

  if ( history.pushState && document.location.protocol != "file:") {
    this.routingMode = RoutingMode_PushState;
  } else {
    this.routingMode = RoutingMode_Hash;
    document.body.onhashchange = this.OnHashChange;
  }

  // Init Route Dom objects
  let RouteElements = Array.from(document.getElementsByClassName("route"))
    .map( (Dom) => {
      let Route = new MakeRoute(Dom.cloneNode(true));
      this.routes[Route.Name] = Route;
      SetDisplay(Route.Dom, DISPLAY_BLOCK);
    });

  let Url = this.GetUrl();
  this.navigate(Url);


}
