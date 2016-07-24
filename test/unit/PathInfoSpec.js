import { expect } from 'chai';
import PathInfo from '../../src/PathInfo';

describe('PathInfo', () => {
  it('should return empty path when init', () => {
    const path = new PathInfo();
    expect(path.dom()).to.equal('');
    expect(path.xpath()).to.equal('/');
  });

  it('should return html if only has root document', () => {
    const path = new PathInfo();
    path.append('html');
    expect(path.dom()).to.equal('html');
    expect(path.xpath()).to.equal('/html[1]');
  });

  it('should return html,body,header and h1', () => {
    const path = new PathInfo();
    path.append('html')
      .append('body')
      .append('header')
      .append('h1');
    expect(path.dom()).to.equal('html.body.header.h1');
    expect(path.xpath()).to.equal('/html[1]/body[1]/header[1]/h1[1]');
  });

  it('should support multi tags name', () => {
    const path = new PathInfo();
    path.append('html')
      .append('body')
      .append('div');
    expect(path.dom()).to.equal('html.body.div');
    expect(path.xpath()).to.equal('/html[1]/body[1]/div[1]');

    path.pop().append('div');
    expect(path.dom()).to.equal('html.body.div');
    expect(path.xpath()).to.equal('/html[1]/body[1]/div[2]');
  });

  it('should support multi tags and elements', () => {
    const path = new PathInfo();
    path.append('html')
      .append('body')
      .append('div');
    expect(path.dom()).to.equal('html.body.div');
    expect(path.xpath()).to.equal('/html[1]/body[1]/div[1]');

    path.pop();
    expect(path.dom()).to.equal('html.body');
    expect(path.xpath()).to.equal('/html[1]/body[1]');

    path.append('span');
    expect(path.dom()).to.equal('html.body.span');
    expect(path.xpath()).to.equal('/html[1]/body[1]/span[1]');

    path.pop();
    expect(path.dom()).to.equal('html.body');
    expect(path.xpath()).to.equal('/html[1]/body[1]');

    path.append('pre');
    expect(path.dom()).to.equal('html.body.pre');
    expect(path.xpath()).to.equal('/html[1]/body[1]/pre[1]');
  });

  it('should support remove tags', () => {
    const path = new PathInfo();
    path.append('html')
      .append('body')
      .append('div')
      .append('a')
      .pop();
    expect(path.dom()).to.equal('html.body.div');
    expect(path.xpath()).to.equal('/html[1]/body[1]/div[1]');

    path.pop();
    expect(path.dom()).to.equal('html.body');
    expect(path.xpath()).to.equal('/html[1]/body[1]');
  });
});
