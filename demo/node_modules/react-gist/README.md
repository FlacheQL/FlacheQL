# react-gist

[![NPM](https://nodei.co/npm/react-gist.png)](https://nodei.co/npm/react-gist/)

Use this component to add a github gist on your website.

Get the id from the gist url `https://gist.github.com/{your_name}/{id}` and set it as a property of the component.

## Example

Single-file gist:

```js
var React = require('react');
var Gist = require('react-gist');

React.render(
    <Gist id='5104372' />,
    document.body
);
```

Multi-file gist:

```js
var React = require('react');
var Gist = require('react-gist');

React.render(
    <Gist id='5995ea726914f280afb3' file='Chef-Dockerfile' />,
    document.body
);
```

## Usage

### `<Gist id={string} file={string} />`

- `id` {string} Id of the gist
- `file` {string} Name of a specific file in a multi-file gist

## License

MIT, see [LICENSE.md](http://github.com/tleunen/react-gist/blob/master/LICENSE.md) for details.
