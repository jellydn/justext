/* eslint-disable */

// define
var JustextItemComponent = Vue.extend({
  template: `<p v-if='isBoiler || class !== "bad"' v-on:mouseenter="isShow=true;" v-on:mouseleave="isShow=false;" class={{class}}>{{text}}</p>
            <div class="paragraph_details {{class}}">
            <table v-if=isShow>
            <tbody><tr class="odd"><td class="attr">final class</td><td class="value">{{class}}</td></tr>
            <tr class="even"><td class="attr">cotext-free class</td><td class="value">{{cfclass}}</td></tr>
            <tr class="odd"><td class="attr">heading</td><td class="value">{{heading}}</td></tr>
            <tr class="even"><td class="attr">length (in characters)</td><td class="value">{{length}}</td></tr>
            <tr class="odd"><td class="attr">number of characters within links</td><td class="value">{{charsCountInLinks}}</td></tr>
            <tr class="even"><td class="attr">link density</td><td class="value">{{linksDesity}}</td></tr>
            <tr class="odd"><td class="attr">number of words</td><td class="value">{{wordsCount}}</td></tr>
            <tr class="even"><td class="attr">number of stopwords</td><td class="value">{{stopwordsCount}}</td></tr>
            <tr class="odd"><td class="attr">stopword density</td><td class="value">{{stopwordDesity}}</td></tr>
            <tr class="even"><td colspan="2" class="value">{{xpath}}</td></tr>
            </tbody></table>
            </div>`,
  props: ['item', 'isBoiler'],
  data: function () {
    return {
      isShow: false,
      text: '',
      class: '',
      cfclass: '',
      heading: false,
      xpath: '',
      length: 0,
      charsCountInLinks: 0,
      linksDesity: 0,
      wordsCount: 0,
      stopwordDesity: 0,
      stopwordsCount: 0,
    }
  },
  activate: function (done) {
    var self = this;
    var reg = RegExp(/(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/gi);
    var textPos = self.item.lastIndexOf('>');
    var attrs = self.item.match(reg);
    if (attrs && attrs.length > 0) {
      for (var index = 0; index < attrs.length; index++) {
        var prop = attrs[index].split('=');
        self[prop[0]] = prop[1].substr(1, prop[1].length - 2);
      }
    } else {
      console.log('self', self);
      console.warn('text', self.text);
      console.warn('item', self.item);
    }

    self.heading = Number(self.heading) > 0;
    self.text = self.item.substr(textPos + 1);
    if (self.class === 'good' && self.heading) {
      self.class = 'heading';
    }

    done();
  }
});

var JustextResultComponent = Vue.extend({
  template: '<div v-for="item in items"><justext-item :is-boiler=isBoiler :item=item></justext-item>',
  components: {
    'justext-item': JustextItemComponent
  },
  props: ['items', 'isBoiler'],
});

// register
Vue.component('justext-result', JustextResultComponent);

var app = new Vue({
  el: '#app',
  data: {
    name: 'jusText demo!',
    url: '',
    content: '',
    language: '',
    // advance option
    isShow: false,
    isShowBoiler: false,
    // justext options
    options: {
      noHeadings: false,
      maxHeadingDistance: 200,
      lengthHigh: 200,
      lengthLow: 70,
      stopwordsHigh: 0.32,
      stopwordsLow: 0.3,
      maxLinkDesity: 0.2,
    },
    // output
    output: [],
  },
  methods: {
    toggleShow: function () {
      this.isShow = !this.isShow;
    },
    toggleShowBoiler: function () {
      this.isShowBoiler = !this.isShowBoiler;
    },
    parseText: function () {
      this.output = [];
      if (this.content === '' && this.url === '') {
        alert('Please enter url or your HTML content in text area');
      } else {
        if (this.url !== '') {
          this.output = justext.url(this.url, this.language, 'detailed', this.options);
        }
        else {
          this.output = justext.rawHtml(this.content, this.language, 'detailed', this.options);
        }

        if (this.output) {
          this.output = this.output.split('\r\n');
        } else {
          this.output = [];
        }
      }
    }
  }
});
