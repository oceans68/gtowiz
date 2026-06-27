/**
 * GTO Drill Coach — App Router & Mount (Static Bundle)
 */
(function () {
  const VALID_ROUTES = ['dashboard', 'preflop', 'postflop', 'plo', 'missions', 'progress', 'review', 'library', 'settings', 'fair-play'];

  function getRouteFromHash() {
    const hash = window.location.hash.replace(/^#\/?/, '');
    return VALID_ROUTES.includes(hash) ? hash : 'dashboard';
  }

  function App() {
    const [route, setRoute] = React.useState(getRouteFromHash());

    React.useEffect(() => {
      const onHashChange = () => setRoute(getRouteFromHash());
      window.addEventListener('hashchange', onHashChange);
      return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    const navigate = React.useCallback((newRoute) => {
      if (!VALID_ROUTES.includes(newRoute)) newRoute = 'dashboard';
      window.location.hash = `/${newRoute}`;
      window.scrollTo(0, 0);
      setRoute(newRoute);
    }, []);

    // Ensure hash is set on first load
    React.useEffect(() => {
      if (!window.location.hash) {
        window.location.hash = '/dashboard';
      }
    }, []);

    const pages = window.GTOPages;

    switch (route) {
      case 'dashboard': return <pages.Dashboard navigate={navigate} />;
      case 'preflop': return <pages.Preflop navigate={navigate} />;
      case 'postflop': return <pages.Postflop navigate={navigate} />;
      case 'plo': return <window.GTOPagePLO key="plo" navigate={navigate} />;
      case 'missions': return <pages.Missions navigate={navigate} />;
      case 'progress': return <pages.Progress navigate={navigate} />;
      case 'review': return <pages.Review navigate={navigate} />;
      case 'library': return <pages.Library navigate={navigate} />;
      case 'settings': return <pages.Settings navigate={navigate} />;
      case 'fair-play': return <pages.FairPlay navigate={navigate} />;
      default: return <pages.Dashboard navigate={navigate} />;
    }
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);

  // Hide the initial loading indicator once React has mounted
  const loader = document.getElementById('initial-loader');
  if (loader) loader.remove();
})();
