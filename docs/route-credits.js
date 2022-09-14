MainCallback( ROUTE_VIM_CREDITS, (State, Route) => {
  Assert(State instanceof AppState);
  Assert(Route instanceof MakeRoute);

  BindBottomBarCallbacks(State);
  FitBottomBar();
});

