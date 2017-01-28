# twobrain.io
**Welcome traveler!**

## Features
This repository also features a number of great software (in the words of their creators):
- [Browsersync](https://www.browsersync.io/) - time-saving synchronised browser testing (once you go live-reload, you'll never come back)
- [Sass](http://sass-lang.com/) - CSS with superpowers
- [PostCSS](https://github.com/postcss/postcss) - a tool for transforming styles with JS plugins
- [Autoprefixer](https://github.com/postcss/autoprefixer) - adding vendor prefixes by the rules of [Can I Use](http://caniuse.com/)
- [Webpack](https://webpack.github.io/) - a bundler for javascript and friends
- [ESLint](http://eslint.org/) - the pluggable linting utility for JavaScript and JSX (with preconfigured ruleset by [Google](https://github.com/google/eslint-config-google))

## Getting started
Make sure [Node.js](http://nodejs.org/) is installed on your system (or even better, use [Yarn](https://yarnpkg.com/en/docs/install)), then clone this repository and install its dependencies:

```
$ git clone https://github.com/two-brain/twobrain.io.git
$ cd twobrain.io
$ npm install // (or simply `yarn`)
$ mv secrets.json.example secrets.json // contains example configuration for file sync via rsync
$ npm run assets // (or `yarn run assets`) - generates static assets (only needed once), later on you go straight to ..
$ npm start // (or `yarn run start`)
```

## Special Thanks
I'd like to thank everybody that's making great software - you people are awesome.


### ToDo
- [x] responsive images (bonus points for pixel-loading effect)
- [ ] custom 404
