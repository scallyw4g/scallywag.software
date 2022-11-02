function MakeRoute(DomRef) {
  Assert(DomRef instanceof HTMLElement);

  this.Name = DomRef.dataset.route;
  this.Url = DomRef.dataset.url;

  this.InitialDom = DomRef.cloneNode(true);
  SetDisplay(this.InitialDom, DISPLAY_BLOCK);

  this.Main = null;
  this.Callbacks = null;
  this.RemoteDocument = null;
  this.AnimationStatus = new AnimationStatus();
}

function RunInitAndMain(State, Route)
{
  Assert(State instanceof AppState);
  Assert(Route instanceof MakeRoute);

  if (Route.Init) {
    console.log(Route.Name, " Running Init");
    Route.Init(State, Route);
  }

  if (Route.Main) {
      console.log(Route.Name, " Running Main");
      Route.Main(State);
  }

}

function HTMLElementFromString(HTMLString)
{
  Assert(typeof HTMLString === "string");

  const domParser = new DOMParser();

  let RemoteDocument = domParser.parseFromString(HTMLString, 'text/html');
  console.log('-- RemoteDocument', RemoteDocument);

  // let RemoteDocument = doc.body.children[0];
  // RemoteDocument.PatchedStyles = doc.styleSheets;

  return RemoteDocument;
}

function LookupRoute(Router, RouteNameOrUrl)
{
  Assert(Router instanceof MakeRouter);
  Assert(typeof RouteNameOrUrl === "string");

  let RouteName = RouteNameOrUrl;
  if (RouteNameOrUrl[0] === "/") {
    RouteName = RouteNameOrUrl.substring(1);
  }

  let ResolvedRoute = Router.ResolveRootUrlAlias(RouteName);
  let Path = ResolvedRoute.split("/");

  let Result = null;
  let Table = Router.routes;
  for ( let PathIndex = 0;
        PathIndex < Path.length;
        ++PathIndex )
  {
    let PathSeg = Path[PathIndex];
    Result = Table[PathSeg];

    if (Result) {
      Table = Result;
      continue;
    } else {
      Result = Router.routes[ROUTE_404];
      break;
    }
  }

  Assert(Result);
  return Result;
}

document.addEventListener( USER_CALLBACKS_COMPLETE, (Event) => {
  // Replace the navigate function once the framework is loaded and perform
  // all pending navigations.
  console.log("overriding router.navigate");

  const State = Event.detail;
  const Router = State.Router;

  Assert(State instanceof AppState);

  Router.navigate = (url) => {
    console.log("router.navigate", url);
    document.body.onclick = null;

    if (this.Current) {
      // this.Current.AnimationStatus.cancelled = true;
      // history.pushState({}, "", this.Current.Name);
    }

    const UrlRootResolved = Router.ResolveRootUrlAlias(url);
    const TargetRoute = LookupRoute(Router, UrlRootResolved)
    Assert(TargetRoute);
    Assert(TargetRoute.AnimationStatus instanceof AnimationStatus);

    // if (TargetRoute.Name === "/404")
    //   Router.UpdateBrowserUrl("/404");
    // else
    //   Router.UpdateBrowserUrl(UrlRootResolved);

    if (this.Current) { console.log("Navigating from %s to %s", this.Current.Name, TargetRoute.Name); }

    this.Current = TargetRoute;
    // this.Current.AnimationStatus.cancelled = false;

    // It's important to render the route initially before firing the Routes
    // Main() because then the route can query the rendered Dom

    Render(TargetRoute.Name, Router);

    if (TargetRoute.Url && TargetRoute.RemoteDocument == null)
    {
      fetch(TargetRoute.Url)
        .then( r => r.text() )
        .then( html => {
          TargetRoute.RemoteDocument = HTMLElementFromString(html);
          Render(TargetRoute.Name, Router);
          RunInitAndMain(State, TargetRoute)
        });
    }
    else
    {
      RunInitAndMain(State, TargetRoute)
    }

  }


  Router.navigate(Router.cachedNav);
  delete Router.cachedNav;
});

function MakeRouter(Root, mountPoint) {

  /* Data Properties
   * **********************************************************************/

  // Before the framework is initialized, Router.navigate overwrites this, then
  // once the framework is initialized we actually perform the nav and delete this.
  this.cachedNav = "/";

  this.mountPoint = mountPoint;
  this.root = Root;

  this.Current = null;

  this.routes = {};

  /* Namespaced Functions
   * **********************************************************************/

  this.ResolveRootUrlAlias = function(Route) {
    let Lookup = Route;

    if (Lookup.startsWith(this.mountPoint))
    {
      Lookup = Lookup.slice(this.mountPoint.length)
    }

    if (Lookup === "/") Lookup = this.root;

    return Lookup;
  }

  this.UpdateBrowserUrl = (url) => {
    history.replaceState({}, "", `${this.mountPoint}${url}`);
  }

  this.PullUrlFromDocument = () => {
    if (document.location.pathname.length > 0)
    {
      Route = document.location.pathname;
    }
    else
    {
      Route = "/";
    }

    return Route;
  }

  // Stub method to cache navigations before the framework is fully loaded
  this.navigate = function(targetRoute) {
    console.log("Caching nav to ", targetRoute);
    this.cachedNav = targetRoute;
  }

  this.OnNavEvent = (e) => {
    let url = this.PullUrlFromDocument();
    this.navigate(url);
  }


  /* Initialization
   * **********************************************************************/
  {
    console.log("Router.Initialize");

    document.body.onpopstate = this.OnNavEvent;

    // Init Route Dom objects
    let DomElements = Array.from(document.getElementsByClassName("route"));
    let RouteElements = DomElements.map( (Dom) => {

      let Route = new MakeRoute(Dom);

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

    this.OnNavEvent();
  }
}
