const minimatch = require('minimatch');
const HTMLAsset = parseInt(process.versions.node, 10) < 8
  ? require('parcel/lib/assets/HTMLAsset')
  : require('parcel/src/assets/HTMLAsset');

class HTMLExternalsAsset extends HTMLAsset {
  async collectDependencies() {
    const pkg = await this.getPackage();
    if (pkg && pkg.externals) {
      this.ast = new Proxy(this.ast, {
        get(target, key) {
          if (key === 'walk') {
            return _walk.call(target, target[key], pkg.externals);
          }
          return target[key];
        }
      });
    }

    return HTMLAsset.prototype.collectDependencies.call(this);
  }
}

function _walk(walk, externals) {
  return htmlWalkFn => walk.call(this, node => {
    const src = node.attrs && (
      (node.tag === 'script' && node.attrs.src) ||
      (node.tag === 'link' && node.attrs.rel === 'stylesheet' && node.attrs.href)
    );

    if (src && Object.keys(externals).find(external =>
      externals[external] === false && minimatch(src, external)
    )) {
      return node;
    }
    return htmlWalkFn(node);
  });
}

module.exports = HTMLExternalsAsset;
