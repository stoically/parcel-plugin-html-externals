ParcelJS plugin to ignore certain script and style tags in html files marked as externals.

> Disclaimer: This plugin monkey patches Parcel internals by extending the HTMLAsset class and proxying its ast walker, so it might break things.
>
> Parcel will probably support externals out of the box in the future, [related issue here](https://github.com/parcel-bundler/parcel/issues/144).

### Install

```
npm install --save-dev parcel-plugin-html-externals
```

### Usage

Put an `externals` key into your `package.json`, e.g.

```json
{
  "externals": {
    "vendor/**/*": false
  }
}
```

will ignore all script / style tags whose src / href attribute starts with `vendor/`, e.g

```html
<script src="vendor/thirdparty.min.js"></script>
```

The externals key can be any glob accepted by [minimatch](https://github.com/isaacs/minimatch),
the value must be `false` to trigger ignoring.


### License

MIT