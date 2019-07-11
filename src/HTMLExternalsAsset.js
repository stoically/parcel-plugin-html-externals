const minimatch = require('minimatch');
const HTMLAsset = parseInt(process.versions.node, 10) < 8
  ? require('parcel-bundler/lib/assets/HTMLAsset')
  : require('parcel-bundler/src/assets/HTMLAsset');

let externals;
class HTMLExternalsAsset extends HTMLAsset {
  async collectDependencies() {
    if (!externals) {
      const pkg = await this.getPackage();
      if (!pkg.externals) {
        return HTMLAsset.prototype.collectDependencies.call(this);
      }
      // eslint-disable-next-line require-atomic-updates
      externals = pkg.externals;
    }

    const _walk = function(walk) {
      return fn => {
        if (!externals) {
          return walk(fn);
        }

        walk.call(this, node => {
          let src;
          if (node.tag === 'script' && node.attrs && node.attrs.src) {
            src = node.attrs.src;
          }
          if (node.tag === 'link' && node.attrs &&
            node.attrs.rel === 'stylesheet' && node.attrs.href) {
            src = node.attrs.href;
          }

          if (src && Object.keys(externals).find(external => {
            if (externals[external]) {
              return false;
            }
            return minimatch(src, external);
          })) {
            return node;
          } else {
            return fn(node);
          }
        });
      };
    };

    this.ast = new Proxy(this.ast, {
      get(target, key) {
        if (key === 'walk') {
          return _walk.call(target, target[key]);
        }
        return target[key];
      }
    });

    return HTMLAsset.prototype.collectDependencies.call(this);
  }
}

module.exports = HTMLExternalsAsset;