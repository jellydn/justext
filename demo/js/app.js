/* eslint-disable */
var app = new Vue({
  el: '#app',
  data: {
    name: 'jusText demo!',
    url: '',
    content: '',
    language: '',
    // advance option
    isShow: false,
    // justext options
    options: {
      noHeadings: false,
      maxHeadingDistance: 200,
      lengthHight: 200,
      lengthLow: 70,
      stopwordsHigh: 0.32,
      stopwordsLow: 0.3,
      maxLinkDesity: 0.2,
    },
    // output
    defaultFormatResult: '',
    defaultBoilerPlatFormatResult: '',
    detailedFormatResult: '',
    krdwrdFormatResult: '',
  },
  methods: {
    toggleShow: function () {
      this.isShow = !this.isShow;
    },
    parseText: function () {
      this.defaultFormatResult = '';
      this.defaultBoilerPlatFormatResult = '';
      this.detailedFormatResult = '';
      this.krdwrdFormatResult = '';
      if (this.content === '') {
        alert('Please enter the HTML content in text area');
      } else {
        this.defaultFormatResult = justext.default(this.content, this.language, 'default', this.options);
        this.defaultBoilerPlatFormatResult = justext.default(this.content, this.language, 'boilerplate', this.options);
        this.detailedFormatResult = justext.default(this.content, this.language, 'detailed', this.options);
        this.krdwrdFormatResult = justext.default(this.content, this.language, 'krdwrd', this.options);
      }
    }
  }
});
