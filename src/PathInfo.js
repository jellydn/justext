/**
 *
 * list of triples (tag name, order, children)
 * @class PathInfo
 */
class PathInfo {

  constructor() {
    this.elements = [];
  }

  dom() {
    const html = [];
    // base on tag name
    for (const item of this.elements) {
      html.push(item[0]);
    }
    return html.join('.');
  }

  xpath() {
    let path = '';
    // path base on tag name and order
    if (this.elements.length) {
      for (const item of this.elements) {
        path += `/${item[0]}[${item[1]}]`;
      }
    } else {
      path = '/';
    }
    return path;
  }

  append(tagName) {
    const children = this.getChildren();
    const order = children[tagName] + 1 || 1;
    children[tagName] = order;
    this.elements.push([tagName, order, {}]);
    return this;
  }

  getChildren() {
    if (this.elements.length) {
      return this.elements[this.elements.length - 1][2];
    }
    return {};
  }

  pop() {
    this.elements.pop();
    return this;
  }

}

export default PathInfo;
