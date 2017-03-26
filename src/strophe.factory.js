import { Strophe } from 'strophe';

// TODO: The below is the problem. The register plugin requires strophe to be
// defined before it runs any of its hooks to Strophe's code. How do we get it
// to work?
// import 'strophe-register';

// Since Strophe attaches itself to `window`, use this factory to dependency
// inject the Strophe window object into any Angular module
const StropheFactory = ($window) => {
  // if($window.strophe) {

  // }

  return $window.Strophe;
}

StropheFactory.$inject = ['$window'];

export default StropheFactory;
