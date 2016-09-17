# SliceJS

A tool to generate a program slice of your JavaScript code

**It's definitely a work in progress!**

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![Dependencies][dependencyci-badge]][dependencyci]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npm-stat]
[![MIT License][license-badge]][LICENSE]

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Donate][donate-badge]][donate]
[![Code of Conduct][coc-badge]][coc]
[![Roadmap][roadmap-badge]][roadmap]
[![Examples][examples-badge]][examples]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

## The problem

Familiarizing yourself with a codebase is hard. Learn more about program slicing [here][slicing-wikipedia]

## This solution

This will generate a program slice for the given files and tests.

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and should
be installed as one of your project's `devDependencies`:

```
npm install --save-dev slice-js
```

## Usage

```
const sliceJS = require('slice-js')
sliceJS()
```

## Inspiration

A talk by [@inconshreveable](https://github.com/inconshreveable) at The Strange Loop 2016 called
["Idealized Commit Logs: Code Simplification via Program Slicing"](https://youtu.be/dSqLt8BgbRQ)
about the amazing tools that can be built with program slicing.

## Other Solutions

The only other solution I'm aware of is not open source AFAIK: [JSSlicer](http://www.scientific.net/AMM.241-244.2690)

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;"/><br /><sub>Kent C. Dodds</sub>](https://kentcdodds.com)<br />[💻](https://github.com/kentcdodds/slice-js/commits?author=kentcdodds) [⚠️](https://github.com/kentcdodds/slice-js/commits?author=kentcdodds) |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->
Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification. Contributions of any kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/kentcdodds/slice-js.svg?style=flat-square
[build]: https://travis-ci.org/kentcdodds/slice-js
[coverage-badge]: https://img.shields.io/codecov/c/github/kentcdodds/slice-js.svg?style=flat-square
[coverage]: https://codecov.io/github/kentcdodds/slice-js
[dependencyci-badge]: https://dependencyci.com/github/kentcdodds/slice-js/badge?style=flat-square
[dependencyci]: https://dependencyci.com/github/kentcdodds/slice-js
[version-badge]: https://img.shields.io/npm/v/slice-js.svg?style=flat-square
[package]: https://www.npmjs.com/package/slice-js
[downloads-badge]: https://img.shields.io/npm/dm/slice-js.svg?style=flat-square
[npm-stat]: http://npm-stat.com/charts.html?package=slice-js&from=2016-04-01
[license-badge]: https://img.shields.io/npm/l/slice-js.svg?style=flat-square
[license]: https://github.com/kentcdodds/slice-js/blob/master/other/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[donate]: http://kcd.im/donate
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/kentcdodds/slice-js/blob/master/other/CODE_OF_CONDUCT.md
[roadmap-badge]: https://img.shields.io/badge/%F0%9F%93%94-roadmap-CD9523.svg?style=flat-square
[roadmap]: https://github.com/kentcdodds/slice-js/blob/master/other/ROADMAP.md
[examples-badge]: https://img.shields.io/badge/%F0%9F%92%A1-examples-8C8E93.svg?style=flat-square
[examples]: https://github.com/kentcdodds/slice-js/blob/master/other/EXAMPLES.md
[github-watch-badge]: https://img.shields.io/github/watchers/kentcdodds/slice-js.svg?style=social
[github-watch]: https://github.com/kentcdodds/slice-js/watchers
[github-star-badge]: https://img.shields.io/github/stars/kentcdodds/slice-js.svg?style=social
[github-star]: https://github.com/kentcdodds/slice-js/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20slice-js!%20https://github.com/kentcdodds/slice-js%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/kentcdodds/slice-js.svg?style=social
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[slicing-wikipedia]: https://en.wikipedia.org/wiki/Program_slicing
