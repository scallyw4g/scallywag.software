function LookupRoute(Router, RouteName)
{
  Assert(Router instanceof MakeRouter);
  Assert(typeof RouteName === "string");

  Assert(RouteName[0] !== "/");

  let Lookup = Router.ResolveRootRouteAlias(RouteName);
  let LookupPath = Lookup.split("/");

  for ( let PathIndex = 0; PathIndex < Lookup.length; ++ PathIndex )
  {
    let PathSeg = LookupPath[PathIndex];
  }

  let Route = Router.routes[Lookup];

  return Route;
}

document.addEventListener( USER_CALLBACKS_COMPLETE, (Event) => {
  // Replace the navigate function once the framework is loaded and perform
  // all pending navigations.
  console.log("overriding router.navigate");

  let State = Event.detail;
  let Router = State.Router;

  Router.navigate = (url) => {


    if ( Router.currentRoute ) {

      let Current = LookupRoute(Router, Router.currentRoute);

      if (Current) {
        Current.AnimationStatus.cancelled = true;
        if (Router.routingMode === RoutingMode_PushState)
          history.pushState({}, "", Router.currentRoute);
      }
    }

    let RouteName = Router.ParseRouteFromUrl(url);
    console.log("Navigating from %s to %s", Router.currentRoute, RouteName);
    let targetLookup = Router.ResolveRootRouteAlias(RouteName);
    let TargetRoute = Router.routes[targetLookup];
    if (TargetRoute) {
      Assert(TargetRoute.AnimationStatus instanceof AnimationStatus);

      TargetRoute.AnimationStatus.cancelled = false;
      Router.UpdateBrowserUrl(RouteName);
      // It's important to render the route initially before firing the Routes
      // Main() because then the route can query the rendered Dom

      delete TargetRoute.Dom;
      TargetRoute.Dom = TargetRoute.InitialDom.cloneNode(true);
      Render(TargetRoute.Dom);

      if (TargetRoute.Init) {
        console.log(TargetRoute.Name, " Running Init");
        TargetRoute.Init();
      }

      if (TargetRoute.Main) {
          console.log(TargetRoute.Name, " Running Main");
          TargetRoute.Main(State);
      }
    }

    if (!TargetRoute)
      Router.navigate(ROUTE_404);
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

  this.ResolveRootRouteAlias = function(Route) {
    let Lookup = Route;
    if (Lookup === "") Lookup = this.root;
    return Lookup;
  }

  this.UpdateBrowserUrl = (url) => {
    this.currentRoute = url;
    if (this.routingMode === RoutingMode_PushState)
      history.replaceState({}, "", `/${url}`);
    else
    {
      document.body.onhashchange = null;
      document.location.hash = `/${url}`;
      document.body.onhashchange = this.OnNavEvent;
    }
    return;
  }

  this.PullUrlFromDocument = () => {
    if ( this.routingMode === RoutingMode_Hash &&
         document.location.hash.length > 0)
    {
      let Hash = document.location.hash;
      if (Hash.length > 0) {
        Assert(Hash[0] === '#');
        Route = Hash.substring(1);
      }
    }
    else if ( this.routingMode === RoutingMode_PushState &&
              document.location.pathname.length > 0)
    {
      Route = document.location.pathname;
    }
    else
    {
      Route = "/";
    }

    return Route;
  }

  this.ParseRouteFromUrl = function(url) {
    Assert(url[0] === '/');
    let Route = url.substring(1);

    return Route;
  }

  // Stub method to cache navigations before the framework is fully loaded
  this.navigate = function(targetRoute) {
    console.log("Caching nav to ", targetRoute);
    this.pendingNavigations.push(targetRoute);
  }

  this.OnNavEvent = () => {
    let url = this.PullUrlFromDocument();
    this.navigate(url);
  }


  /* Initialization
   * **********************************************************************/
  {
    console.log("Router.Initialize");

    if ( history.pushState && document.location.protocol != "file:") {
      this.routingMode = RoutingMode_PushState;
      document.body.onpopstate = this.OnNavEvent;
    } else {
      this.routingMode = RoutingMode_Hash;
      document.body.onhashchange = this.OnNavEvent;
    }

    // Init Route Dom objects
    let DomElements = Array.from(document.getElementsByClassName("route"));
    let RouteElements = DomElements.map( (Dom) => {

      let Route = new MakeRoute(Dom);
      SetDisplay(Route.InitialDom, DISPLAY_BLOCK);

      let RoutePath = Dom.dataset.route.split("/");
      // Routes must begin with a / therefore the first element must be ""
      Assert(RoutePath[0] === "");
      Assert(RoutePath.length > 1);
      RoutePath.shift();

      let RoutePathRoot = RoutePath[0];

      let RouteTreeRef = this.routes;

      for ( let PathIndex = 0; PathIndex < RoutePath.length; ++ PathIndex )
      {
        let PathSeg = RoutePath[PathIndex];

        if ( PathIndex === RoutePath.length-1 )
          RouteTreeRef[PathSeg] = Route;

        else if (!RouteTreeRef[PathSeg])
          RouteTreeRef[PathSeg] = {}

        else
          RouteTreeRef = RouteTreeRef[PathSeg]
      }

    });

    console.log(this.routes);
    this.OnNavEvent();
  }
}
