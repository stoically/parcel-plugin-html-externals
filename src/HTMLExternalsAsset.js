const minimatch = require('minimatch');
const HTMLAsset = parseInt(process.versions.node, 10) < 8
  ? require('parcel-bundler/lib/assets/HTMLAsset')
  : require('parcel-bundler/src/assets/HTMLAsset');

class HTMLExternalsAsset extends HTMLAsset {
  async collectDependencies() {
    const pkg = await this.getPackage();
    if (pkg && pkg.externals) {
      _proxy.call(this, pkg.externals);
    }

    return HTMLAsset.prototype.collectDependencies.call(this);
  }
}

function _proxy(externals) {
  this.ast = new Proxy(this.ast, {
    get(target, key) {
      if (key === 'walk') {
        return _walk.call(target, target[key], externals);
      }
      return target[key];
    }
  });
}

function _walk(walk, externals) {
  return htmlWalkFn => walk.call(this, node => {
    const src = node.attrs && (
      (node.tag === 'script' && node.attrs.src) ||
      (node.tag === 'link' && node.attrs.rel === 'stylesheet' && node.attrs.href)
    );

    if (src && Object.keys(externals).find(external => {
      return !externals[external] && minimatch(src, external);
    })) {
      return node;
    }
    return htmlWalkFn(node);
  });
}

module.exports = HTMLExternalsAsset;