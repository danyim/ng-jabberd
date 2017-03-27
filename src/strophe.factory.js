// import { Strophe } from 'strophe';

// Since Strophe attaches itself to `window`, use this factory to dependency
// inject the Strophe window object into any Angular module
const StropheFactory = ($window) => {
  // if($window.strophe) {

  // }
  return $window.Strophe;
}

StropheFactory.$inject = ['$window'];

export default StropheFactory;
