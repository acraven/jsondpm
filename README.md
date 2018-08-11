jsondpm
=======

[![Build Status](https://travis-ci.org/acraven/jsondpm.svg?branch=master)](https://travis-ci.org/acraven/jsondpm)
[![NPM version](https://badge.fury.io/js/jsondpm.svg)](https://www.npmjs.com/package/jsondpm)

Diff, patch and merge JavaScript objects

## Publishing

* Ensure the `master` branch build status [![Build Status](https://travis-ci.org/acraven/jsondpm.svg?branch=master)](https://travis-ci.org/acraven/jsondpm) is passing.

* Run `npm version (major|minor|patch) -m "Publish %s"` to increment the version in `package.json`, commit and tag the change.

* Run `git push origin master` to build and test the package using Travis CI.

* Run `git push --tags` to publish the package to NPM from Travis CI.

## Contributing

### Running tests

`npm test`
