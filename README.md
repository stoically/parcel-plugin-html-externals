ParcelJS plugin to ignore certain script and stylesheet link tags in html files marked as externals.

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

will ignore all script / stylesheet link tags whose src / href attribute starts with `vendor/`, e.g

```html
<script src="vendor/thirdparty.min.js"></script>
```

The externals key can be a string or any glob accepted by [minimatch](https://github.com/isaacs/minimatch),
the value must be `false` to trigger ignoring.


### Caveats

The plugin monkey patches Parcel internals by extending the HTMLAsset class and proxying its ast walker, so it might just break in an upcoming version.


### License

MIT