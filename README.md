# packer
A simple no configuration module bundler. 

## Supported Features

- Support js, css, image and font files.
- Dynamically loading the js and css.
- Code splitting.
- Default support for jsx syntax.
- Bundle name with bundle hash to support caching.
- Minified js files.

## Install

```
npm install -g @itsprakash87/packer
```

## Use

```
packer ./main.js -o ./build
```

## CLI Options
<table>
  <tr><td width="150"><b>Options</b></td><td><b>Use</b></td></tr>
  <tr><td>--output or -o</td><td>Output directory.</td></tr>
  <tr><td>--publicPath</td><td>Public path of bundled assets.</td></tr>
  <tr><td>--babelrc</td><td>Path to custom babel configuration file. Packer will use that config to parse js files.</td></tr>
  <tr><td>--template</td><td>Path to HTML template. Packer will inject the js and css bundle urls and create a new HTML file in output directory.</td></tr>
  <tr><td>--nominify</td><td>Skip minifying js files.</td></tr>
</table>

## Example

#### Command line example
![Command line](./example/gifs/cli.gif)

#### Lazy loading example
![Lazy loading](./example/gifs/lazy_loading.gif)
