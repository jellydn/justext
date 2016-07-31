(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["justext"] = factory();
	else
		root["justext"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = main;
	
	var _Core = __webpack_require__(1);
	
	var _Core2 = _interopRequireDefault(_Core);
	
	var _Presenter = __webpack_require__(10);
	
	var _Presenter2 = _interopRequireDefault(_Presenter);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var MAX_LINK_DENSITY_DEFAULT = 0.2;
	var LENGTH_LOW_DEFAULT = 70;
	var LENGTH_HIGH_DEFAULT = 200;
	var STOPWORDS_LOW_DEFAULT = 0.30;
	var STOPWORDS_HIGH_DEFAULT = 0.32;
	var NO_HEADINGS_DEFAULT = false;
	var MAX_HEADING_DISTANCE_DEFAULT = 200;
	
	function main(htmlText) {
	  var stoplist = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
	  var format = arguments.length <= 2 || arguments[2] === undefined ? 'default' : arguments[2];
	  var options = arguments.length <= 3 || arguments[3] === undefined ? {
	    lengthLow: LENGTH_LOW_DEFAULT, lengthHigh: LENGTH_HIGH_DEFAULT,
	    stopwordsLow: STOPWORDS_LOW_DEFAULT, stopwordsHigh: STOPWORDS_HIGH_DEFAULT,
	    maxLinkDensity: MAX_LINK_DENSITY_DEFAULT, maxHeadingDistance: MAX_HEADING_DISTANCE_DEFAULT,
	    noHeadings: NO_HEADINGS_DEFAULT
	  } : arguments[3];
	
	  var stopwordsLow = options.stopwordsLow;
	  var stopwordsHigh = options.stopwordsHigh;
	  if (stoplist.length === 0) {
	    // empty stoplist, switch to language-independent mode
	    console.warn('No stoplist specified.');
	    stopwordsHigh = 0;
	    stopwordsLow = 0;
	  }
	  var core = new _Core2.default();
	  var presenter = new _Presenter2.default();
	  var paragrahps = core.jusText(htmlText, stoplist, options.lengthLow, options.lengthHigh, stopwordsLow, stopwordsHigh, options.maxLinkDensity, options.maxHeadingDistance, options.noHeadings);
	  switch (format) {
	    case 'default':
	      return presenter.defaultOuptut(paragrahps);
	    case 'boilerplate':
	      return presenter.defaultOuptut(paragrahps, false);
	    case 'detailed':
	      return presenter.detailOuptut(paragrahps);
	    case 'krdwrd':
	      return presenter.krdwrdOuptut(paragrahps);
	    default:
	      throw new Error('Unknown format');
	  }
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _htmlparser = __webpack_require__(2);
	
	var _htmlparser2 = _interopRequireDefault(_htmlparser);
	
	var _htmlEntities = __webpack_require__(3);
	
	var _htmlEntities2 = _interopRequireDefault(_htmlEntities);
	
	var _ParagraphMaker = __webpack_require__(7);
	
	var _ParagraphMaker2 = _interopRequireDefault(_ParagraphMaker);
	
	var _Paragraph = __webpack_require__(9);
	
	var _Paragraph2 = _interopRequireDefault(_Paragraph);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Core = function () {
	  function Core() {
	    _classCallCheck(this, Core);
	  }
	
	  _createClass(Core, [{
	    key: 'jusText',
	
	    /**
	     * Converts an HTML page into a list of classified paragraphs. Each paragraph
	     * is represented as instance of class ˙˙justext.paragraph.Paragraph˙˙.
	     **/
	    value: function jusText(htmlText) {
	      var stoplist = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
	      var lengthLow = arguments[2];
	      var lengthHigh = arguments[3];
	      var stopwordsLow = arguments[4];
	      var stopwordsHigh = arguments[5];
	      var maxLinkDensity = arguments[6];
	      var maxHeadingDistance = arguments[7];
	      var noHeadings = arguments[8];
	
	      var cleanHtml = this.preprocessor(htmlText, {
	        head: true,
	        footer: true,
	        script: true,
	        iframe: true,
	        style: true,
	        comment: true
	      });
	      var htmlDocument = this.htmlToDom(cleanHtml);
	      var maker = new _ParagraphMaker2.default();
	      var paragraphs = maker.makeParagraphs(htmlDocument);
	      paragraphs = this.classifyParagraphs(paragraphs, stoplist, lengthLow, lengthHigh, stopwordsLow, stopwordsHigh, maxLinkDensity, noHeadings);
	      paragraphs = this.reviseParagraphClassification(paragraphs, maxHeadingDistance);
	
	      return paragraphs;
	    }
	
	    /**
	     * Context-free paragraph classification.
	     **/
	
	  }, {
	    key: 'classifyParagraphs',
	    value: function classifyParagraphs() {
	      var paragraphs = arguments.length <= 0 || arguments[0] === undefined ? [_Paragraph2.default] : arguments[0];
	      var stoplist = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
	      var lengthLow = arguments[2];
	      var lengthHigh = arguments[3];
	      var stopwordsLow = arguments[4];
	      var stopwordsHigh = arguments[5];
	      var maxLinkDensity = arguments[6];
	      var maxHeadingDistance = arguments[7];
	      var noHeadings = arguments[8];
	
	      // use cache some string function
	      var search = String.prototype.search;
	      var indexOf = String.prototype.indexOf;
	      var toLowerCase = String.prototype.toLowerCase;
	
	      var stopList = stoplist.map(function (item) {
	        return toLowerCase.call(item);
	      });
	      var result = [];
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = paragraphs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var paragraph = _step.value;
	
	          var text = paragraph.text();
	          var length = paragraph.len();
	          var stopwordDesity = paragraph.stopwordDesity(stopList);
	          var linksDesity = paragraph.linksDesity();
	          paragraph.heading = !noHeadings && paragraph.isHeading();
	
	          if (Number(linksDesity) > Number(maxLinkDensity)) {
	            paragraph.cfClass = 'bad';
	          } else if (indexOf.call(text, '\xa9') !== -1 || indexOf.call(this, '&copy') !== -1) {
	            paragraph.cfClass = 'bad';
	          } else if (search.call(paragraph.domPath, '^select|.select') !== -1) {
	            paragraph.cfClass = 'bad';
	          } else if (length < lengthLow) {
	            if (paragraph.charsCountInLinks > 0) {
	              paragraph.cfClass = 'bad';
	            } else {
	              paragraph.cfClass = 'short';
	            }
	          } else if (Number(stopwordDesity) >= Number(stopwordsHigh)) {
	            if (Number(length) > Number(lengthHigh)) {
	              paragraph.cfClass = 'good';
	            } else {
	              paragraph.cfClass = 'neargood';
	            }
	          } else if (Number(stopwordDesity) >= Number(stopwordsLow)) {
	            paragraph.cfClass = 'neargood';
	          } else {
	            paragraph.cfClass = 'bad';
	          }
	          result.push(paragraph);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	
	      return result;
	    }
	
	    /**
	     * Context-sensitive paragraph classification. Assumes that classify_pragraphs
	     * has already been called.
	     **/
	
	  }, {
	    key: 'reviseParagraphClassification',
	    value: function reviseParagraphClassification() {
	      var _this = this;
	
	      var paragraphs = arguments.length <= 0 || arguments[0] === undefined ? [_Paragraph2.default] : arguments[0];
	      var maxHeadingDistance = arguments[1];
	
	      var reviseParagraphs = [];
	      // copy classes
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;
	
	      try {
	        for (var _iterator2 = paragraphs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var paragraph = _step2.value;
	
	          paragraph.classType = paragraph.cfClass;
	          reviseParagraphs.push(paragraph);
	        }
	
	        // good headings
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	
	      reviseParagraphs.forEach(function (paragraph, index) {
	        if (paragraph.isHeading() && paragraph.classType === 'short') {
	          var counter = index + 1;
	          var distance = 0;
	          while (counter < reviseParagraphs.length && distance <= maxHeadingDistance) {
	            if (reviseParagraphs[counter].classType === 'good') {
	              reviseParagraphs[counter].classType = 'neargood';
	              break;
	            }
	            distance += reviseParagraphs[counter].text().length;
	            counter++;
	          }
	        }
	      });
	
	      // classify short
	      var newClassType = [];
	      reviseParagraphs.forEach(function (paragraph, index) {
	        if (paragraph.classType === 'short') {
	          var prevNeighbour = _this.getPrevNeighbour(index, reviseParagraphs, true);
	          var nextNeighbour = _this.getNextNeighbour(index, reviseParagraphs, true);
	          var neighbours = [prevNeighbour];
	          if (neighbours.indexOf(nextNeighbour) === -1) {
	            neighbours.push(nextNeighbour);
	          }
	
	          if (neighbours.length === 1 && neighbours[0] === 'good') {
	            newClassType[index] = 'good';
	          } else if (neighbours.length === 1 && neighbours[0] === 'bad') {
	            newClassType[index] = 'bad';
	          } else if (prevNeighbour === 'bad' && _this.getPrevNeighbour(index, reviseParagraphs, false) === 'neargood' || nextNeighbour === 'bad' && _this.getNextNeighbour(index, reviseParagraphs, false) === 'neargood') {
	            newClassType[index] = 'good';
	          } else {
	            newClassType[index] = 'bad';
	          }
	        }
	      });
	
	      newClassType.forEach(function (classType, index) {
	        reviseParagraphs[index].classType = classType;
	      });
	
	      // revise neargood
	      reviseParagraphs.forEach(function (paragraph, index) {
	        if (paragraph.classType === 'neargood') {
	          var prevNeighbour = _this.getPrevNeighbour(index, reviseParagraphs, true);
	          var nextNeighbour = _this.getNextNeighbour(index, reviseParagraphs, true);
	          if (prevNeighbour === 'bad' && nextNeighbour === 'bad') {
	            reviseParagraphs[index].classType = 'bad';
	          } else {
	            reviseParagraphs[index].classType = 'good';
	          }
	        }
	      });
	
	      // more good headings
	      reviseParagraphs.forEach(function (paragraph, index) {
	        if (paragraph.isHeading() && paragraph.classType === 'bad' && paragraph.cfClass !== 'bad') {
	          var counter = index + 1;
	          var distance = 0;
	          while (counter < reviseParagraphs.length && distance <= maxHeadingDistance) {
	            if (reviseParagraphs[counter].classType === 'good') {
	              reviseParagraphs[counter].classType = 'good';
	              break;
	            }
	            distance += reviseParagraphs[counter].text().length;
	            counter++;
	          }
	        }
	      });
	      return paragraphs;
	    }
	
	    /**
	     * Convert html string to HTML Document
	     * rawHtml: string
	     **/
	
	  }, {
	    key: 'htmlToDom',
	    value: function htmlToDom(rawHtml) {
	      // TODO: process encode for html string
	      var htmlHandler = new _htmlparser2.default.DefaultHandler();
	      var htmlParser = new _htmlparser2.default.Parser(htmlHandler);
	      htmlParser.parseComplete(rawHtml);
	      console.log('DOM', htmlHandler.dom);
	      return htmlHandler.dom;
	    }
	
	    /**
	     * Removes unwanted parts of HTML.
	     * rawHtml: string
	     **/
	
	  }, {
	    key: 'preprocessor',
	    value: function preprocessor(rawHtml) {
	      var options = arguments.length <= 1 || arguments[1] === undefined ? {
	        html: false,
	        head: false,
	        footer: false,
	        script: true,
	        iframe: true,
	        style: true,
	        comment: true
	      } : arguments[1];
	
	      // TODO: Process XML format
	      // removes script section entirely
	      var replace = String.prototype.replace;
	      var htmlDecoding = new _htmlEntities2.default.AllHtmlEntities();
	      var str = htmlDecoding.decode(rawHtml);
	      if (options.script) {
	        str = replace.call(str, /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
	      }
	
	      // removes iframe section entirely
	      if (options.iframe) {
	        str = replace.call(str, /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, ' ');
	      }
	
	      // removes head section entirely
	      if (options.head) {
	        str = replace.call(str, /<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, ' ');
	      }
	
	      // removes footer section entirely
	      if (options.footer) {
	        str = replace.call(str, /<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ');
	      }
	
	      // removes style section entirely and inline style
	      if (options.style) {
	        str = replace.call(str, /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
	        str = replace.call(str, /\s+style=["|'].*?["|']/gi, ' ');
	        str = replace.call(str, /\s+class=["|'].*?["|']/gi, ' ');
	      }
	
	      // remove comment
	      if (options.comment) {
	        str = replace.call(str, /<!--[^>]*-->/gi, ' ');
	      }
	
	      // remove all remaining tags
	      if (options.html) {
	        str = replace.call(str, /<\/?[a-z]+(?:\s[a-z0-9]+(\s*=\s*('.*?'|".*?"|\d+))?)*[\s\/]*>/gm, ' ');
	      }
	
	      // replace more than one space with a single space
	      str = replace.call(str, /\s{2,}/g, ' ');
	      // remove space between tags
	      str = replace.call(str, />\s</g, '><');
	      // remove lead space
	      str = replace.call(str, /^\s+/, '');
	      // remove trailing space
	      str = replace.call(str, /\s+$/, '');
	      return str;
	    }
	
	    /**
	     * Get neighbour class type of paragraphs
	     * */
	
	  }, {
	    key: 'getNeighbour',
	    value: function getNeighbour(index, paragraphs, ignoreNearGood, inc, boundary) {
	      var checkIndex = index;
	      while (Number(checkIndex + inc) !== Number(boundary)) {
	        checkIndex = Number(checkIndex + inc);
	        var classType = paragraphs[checkIndex].classType;
	        if (['good', 'bad'].indexOf(classType) !== -1) {
	          return classType;
	        }
	
	        if (classType === 'neargood' && !ignoreNearGood) {
	          return classType;
	        }
	      }
	
	      return 'bad';
	    }
	
	    /**
	     * Return the class of the paragraph at the top end of the short/neargood
	     * paragraphs block. If ignore_neargood is True, than only 'bad' or 'good'
	     * can be returned, otherwise 'neargood' can be returned, too.
	     * */
	
	  }, {
	    key: 'getPrevNeighbour',
	    value: function getPrevNeighbour(index, paragraphs, ignoreNearGood) {
	      return this.getNeighbour(index, paragraphs, ignoreNearGood, -1, -1);
	    }
	
	    /**
	     * Return the class of the paragraph at the bottom end of the short/neargood
	     * paragraphs block. If ignore_neargood is True, than only 'bad' or 'good'
	     * can be returned, otherwise 'neargood' can be returned, too.
	     * */
	
	  }, {
	    key: 'getNextNeighbour',
	    value: function getNextNeighbour(index, paragraphs, ignoreNearGood) {
	      return this.getNeighbour(index, paragraphs, ignoreNearGood, 1, paragraphs.length);
	    }
	  }]);
	
	  return Core;
	}();
	
	exports.default = Core;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__filename, __dirname) {/***********************************************
	Copyright 2010, 2011, Chris Winberry <chris@winberry.net>. All rights reserved.
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to
	deal in the Software without restriction, including without limitation the
	rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
	sell copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
	IN THE SOFTWARE.
	***********************************************/
	/* v1.7.6 */
	
	(function () {
	
	function runningInNode () {
		return(
			("function") == "function"
			&&
			(typeof exports) == "object"
			&&
			(typeof module) == "object"
			&&
			(typeof __filename) == "string"
			&&
			(typeof __dirname) == "string"
			);
	}
	
	if (!runningInNode()) {
		if (!this.Tautologistics)
			this.Tautologistics = {};
		else if (this.Tautologistics.NodeHtmlParser)
			return; //NodeHtmlParser already defined!
		this.Tautologistics.NodeHtmlParser = {};
		exports = this.Tautologistics.NodeHtmlParser;
	}
	
	//Types of elements found in the DOM
	var ElementType = {
		  Text: "text" //Plain text
		, Directive: "directive" //Special tag <!...>
		, Comment: "comment" //Special tag <!--...-->
		, Script: "script" //Special tag <script>...</script>
		, Style: "style" //Special tag <style>...</style>
		, Tag: "tag" //Any tag that isn't special
	}
	
	function Parser (handler, options) {
		this._options = options ? options : { };
		if (this._options.includeLocation == undefined) {
			this._options.includeLocation = false; //Do not track element position in document by default
		}
	
		this.validateHandler(handler);
		this._handler = handler;
		this.reset();
	}
	
		//**"Static"**//
		//Regular expressions used for cleaning up and parsing (stateless)
		Parser._reTrim = /(^\s+|\s+$)/g; //Trim leading/trailing whitespace
		Parser._reTrimComment = /(^\!--|--$)/g; //Remove comment tag markup from comment contents
		Parser._reWhitespace = /\s/g; //Used to find any whitespace to split on
		Parser._reTagName = /^\s*(\/?)\s*([^\s\/]+)/; //Used to find the tag name for an element
	
		//Regular expressions used for parsing (stateful)
		Parser._reAttrib = //Find attributes in a tag
			/([^=<>\"\'\s]+)\s*=\s*"([^"]*)"|([^=<>\"\'\s]+)\s*=\s*'([^']*)'|([^=<>\"\'\s]+)\s*=\s*([^'"\s]+)|([^=<>\"\'\s\/]+)/g;
		Parser._reTags = /[\<\>]/g; //Find tag markers
	
		//**Public**//
		//Methods//
		//Parses a complete HTML and pushes it to the handler
		Parser.prototype.parseComplete = function Parser$parseComplete (data) {
			this.reset();
			this.parseChunk(data);
			this.done();
		}
	
		//Parses a piece of an HTML document
		Parser.prototype.parseChunk = function Parser$parseChunk (data) {
			if (this._done)
				this.handleError(new Error("Attempted to parse chunk after parsing already done"));
			this._buffer += data; //FIXME: this can be a bottleneck
			this.parseTags();
		}
	
		//Tells the parser that the HTML being parsed is complete
		Parser.prototype.done = function Parser$done () {
			if (this._done)
				return;
			this._done = true;
		
			//Push any unparsed text into a final element in the element list
			if (this._buffer.length) {
				var rawData = this._buffer;
				this._buffer = "";
				var element = {
					  raw: rawData
					, data: (this._parseState == ElementType.Text) ? rawData : rawData.replace(Parser._reTrim, "")
					, type: this._parseState
					};
				if (this._parseState == ElementType.Tag || this._parseState == ElementType.Script || this._parseState == ElementType.Style)
					element.name = this.parseTagName(element.data);
				this.parseAttribs(element);
				this._elements.push(element);
			}
		
			this.writeHandler();
			this._handler.done();
		}
	
		//Resets the parser to a blank state, ready to parse a new HTML document
		Parser.prototype.reset = function Parser$reset () {
			this._buffer = "";
			this._done = false;
			this._elements = [];
			this._elementsCurrent = 0;
			this._current = 0;
			this._next = 0;
			this._location = {
				  row: 0
				, col: 0
				, charOffset: 0
				, inBuffer: 0
			};
			this._parseState = ElementType.Text;
			this._prevTagSep = '';
			this._tagStack = [];
			this._handler.reset();
		}
		
		//**Private**//
		//Properties//
		Parser.prototype._options = null; //Parser options for how to behave
		Parser.prototype._handler = null; //Handler for parsed elements
		Parser.prototype._buffer = null; //Buffer of unparsed data
		Parser.prototype._done = false; //Flag indicating whether parsing is done
		Parser.prototype._elements =  null; //Array of parsed elements
		Parser.prototype._elementsCurrent = 0; //Pointer to last element in _elements that has been processed
		Parser.prototype._current = 0; //Position in data that has already been parsed
		Parser.prototype._next = 0; //Position in data of the next tag marker (<>)
		Parser.prototype._location = null; //Position tracking for elements in a stream
		Parser.prototype._parseState = ElementType.Text; //Current type of element being parsed
		Parser.prototype._prevTagSep = ''; //Previous tag marker found
		//Stack of element types previously encountered; keeps track of when
		//parsing occurs inside a script/comment/style tag
		Parser.prototype._tagStack = null;
	
		//Methods//
		//Takes an array of elements and parses any found attributes
		Parser.prototype.parseTagAttribs = function Parser$parseTagAttribs (elements) {
			var idxEnd = elements.length;
			var idx = 0;
		
			while (idx < idxEnd) {
				var element = elements[idx++];
				if (element.type == ElementType.Tag || element.type == ElementType.Script || element.type == ElementType.style)
					this.parseAttribs(element);
			}
		
			return(elements);
		}
	
		//Takes an element and adds an "attribs" property for any element attributes found 
		Parser.prototype.parseAttribs = function Parser$parseAttribs (element) {
			//Only parse attributes for tags
			if (element.type != ElementType.Script && element.type != ElementType.Style && element.type != ElementType.Tag)
				return;
		
			var tagName = element.data.split(Parser._reWhitespace, 1)[0];
			var attribRaw = element.data.substring(tagName.length);
			if (attribRaw.length < 1)
				return;
		
			var match;
			Parser._reAttrib.lastIndex = 0;
			while (match = Parser._reAttrib.exec(attribRaw)) {
				if (element.attribs == undefined)
					element.attribs = {};
		
				if (typeof match[1] == "string" && match[1].length) {
					element.attribs[match[1]] = match[2];
				} else if (typeof match[3] == "string" && match[3].length) {
					element.attribs[match[3].toString()] = match[4].toString();
				} else if (typeof match[5] == "string" && match[5].length) {
					element.attribs[match[5]] = match[6];
				} else if (typeof match[7] == "string" && match[7].length) {
					element.attribs[match[7]] = match[7];
				}
			}
		}
	
		//Extracts the base tag name from the data value of an element
		Parser.prototype.parseTagName = function Parser$parseTagName (data) {
			if (data == null || data == "")
				return("");
			var match = Parser._reTagName.exec(data);
			if (!match)
				return("");
			return((match[1] ? "/" : "") + match[2]);
		}
	
		//Parses through HTML text and returns an array of found elements
		//I admit, this function is rather large but splitting up had an noticeable impact on speed
		Parser.prototype.parseTags = function Parser$parseTags () {
			var bufferEnd = this._buffer.length - 1;
			while (Parser._reTags.test(this._buffer)) {
				this._next = Parser._reTags.lastIndex - 1;
				var tagSep = this._buffer.charAt(this._next); //The currently found tag marker
				var rawData = this._buffer.substring(this._current, this._next); //The next chunk of data to parse
		
				//A new element to eventually be appended to the element list
				var element = {
					  raw: rawData
					, data: (this._parseState == ElementType.Text) ? rawData : rawData.replace(Parser._reTrim, "")
					, type: this._parseState
				};
		
				var elementName = this.parseTagName(element.data);
		
				//This section inspects the current tag stack and modifies the current
				//element if we're actually parsing a special area (script/comment/style tag)
				if (this._tagStack.length) { //We're parsing inside a script/comment/style tag
					if (this._tagStack[this._tagStack.length - 1] == ElementType.Script) { //We're currently in a script tag
						if (elementName.toLowerCase() == "/script") //Actually, we're no longer in a script tag, so pop it off the stack
							this._tagStack.pop();
						else { //Not a closing script tag
							if (element.raw.indexOf("!--") != 0) { //Make sure we're not in a comment
								//All data from here to script close is now a text element
								element.type = ElementType.Text;
								//If the previous element is text, append the current text to it
								if (this._elements.length && this._elements[this._elements.length - 1].type == ElementType.Text) {
									var prevElement = this._elements[this._elements.length - 1];
									prevElement.raw = prevElement.data = prevElement.raw + this._prevTagSep + element.raw;
									element.raw = element.data = ""; //This causes the current element to not be added to the element list
								}
							}
						}
					}
					else if (this._tagStack[this._tagStack.length - 1] == ElementType.Style) { //We're currently in a style tag
						if (elementName.toLowerCase() == "/style") //Actually, we're no longer in a style tag, so pop it off the stack
							this._tagStack.pop();
						else {
							if (element.raw.indexOf("!--") != 0) { //Make sure we're not in a comment
								//All data from here to style close is now a text element
								element.type = ElementType.Text;
								//If the previous element is text, append the current text to it
								if (this._elements.length && this._elements[this._elements.length - 1].type == ElementType.Text) {
									var prevElement = this._elements[this._elements.length - 1];
									if (element.raw != "") {
										prevElement.raw = prevElement.data = prevElement.raw + this._prevTagSep + element.raw;
										element.raw = element.data = ""; //This causes the current element to not be added to the element list
									} else { //Element is empty, so just append the last tag marker found
										prevElement.raw = prevElement.data = prevElement.raw + this._prevTagSep;
									}
								} else { //The previous element was not text
									if (element.raw != "") {
										element.raw = element.data = element.raw;
									}
								}
							}
						}
					}
					else if (this._tagStack[this._tagStack.length - 1] == ElementType.Comment) { //We're currently in a comment tag
						var rawLen = element.raw.length;
						if (element.raw.charAt(rawLen - 2) == "-" && element.raw.charAt(rawLen - 1) == "-" && tagSep == ">") {
							//Actually, we're no longer in a style tag, so pop it off the stack
							this._tagStack.pop();
							//If the previous element is a comment, append the current text to it
							if (this._elements.length && this._elements[this._elements.length - 1].type == ElementType.Comment) {
								var prevElement = this._elements[this._elements.length - 1];
								prevElement.raw = prevElement.data = (prevElement.raw + element.raw).replace(Parser._reTrimComment, "");
								element.raw = element.data = ""; //This causes the current element to not be added to the element list
								element.type = ElementType.Text;
							}
							else //Previous element not a comment
								element.type = ElementType.Comment; //Change the current element's type to a comment
						}
						else { //Still in a comment tag
							element.type = ElementType.Comment;
							//If the previous element is a comment, append the current text to it
							if (this._elements.length && this._elements[this._elements.length - 1].type == ElementType.Comment) {
								var prevElement = this._elements[this._elements.length - 1];
								prevElement.raw = prevElement.data = prevElement.raw + element.raw + tagSep;
								element.raw = element.data = ""; //This causes the current element to not be added to the element list
								element.type = ElementType.Text;
							}
							else
								element.raw = element.data = element.raw + tagSep;
						}
					}
				}
		
				//Processing of non-special tags
				if (element.type == ElementType.Tag) {
					element.name = elementName;
					var elementNameCI = elementName.toLowerCase();
					
					if (element.raw.indexOf("!--") == 0) { //This tag is really comment
						element.type = ElementType.Comment;
						delete element["name"];
						var rawLen = element.raw.length;
						//Check if the comment is terminated in the current element
						if (element.raw.charAt(rawLen - 1) == "-" && element.raw.charAt(rawLen - 2) == "-" && tagSep == ">")
							element.raw = element.data = element.raw.replace(Parser._reTrimComment, "");
						else { //It's not so push the comment onto the tag stack
							element.raw += tagSep;
							this._tagStack.push(ElementType.Comment);
						}
					}
					else if (element.raw.indexOf("!") == 0 || element.raw.indexOf("?") == 0) {
						element.type = ElementType.Directive;
						//TODO: what about CDATA?
					}
					else if (elementNameCI == "script") {
						element.type = ElementType.Script;
						//Special tag, push onto the tag stack if not terminated
						if (element.data.charAt(element.data.length - 1) != "/")
							this._tagStack.push(ElementType.Script);
					}
					else if (elementNameCI == "/script")
						element.type = ElementType.Script;
					else if (elementNameCI == "style") {
						element.type = ElementType.Style;
						//Special tag, push onto the tag stack if not terminated
						if (element.data.charAt(element.data.length - 1) != "/")
							this._tagStack.push(ElementType.Style);
					}
					else if (elementNameCI == "/style")
						element.type = ElementType.Style;
					if (element.name && element.name.charAt(0) == "/")
						element.data = element.name;
				}
		
				//Add all tags and non-empty text elements to the element list
				if (element.raw != "" || element.type != ElementType.Text) {
					if (this._options.includeLocation && !element.location) {
						element.location = this.getLocation(element.type == ElementType.Tag);
					}
					this.parseAttribs(element);
					this._elements.push(element);
					//If tag self-terminates, add an explicit, separate closing tag
					if (
						element.type != ElementType.Text
						&&
						element.type != ElementType.Comment
						&&
						element.type != ElementType.Directive
						&&
						element.data.charAt(element.data.length - 1) == "/"
						)
						this._elements.push({
							  raw: "/" + element.name
							, data: "/" + element.name
							, name: "/" + element.name
							, type: element.type
						});
				}
				this._parseState = (tagSep == "<") ? ElementType.Tag : ElementType.Text;
				this._current = this._next + 1;
				this._prevTagSep = tagSep;
			}
	
			if (this._options.includeLocation) {
				this.getLocation();
				this._location.row += this._location.inBuffer;
				this._location.inBuffer = 0;
				this._location.charOffset = 0;
			}
			this._buffer = (this._current <= bufferEnd) ? this._buffer.substring(this._current) : "";
			this._current = 0;
		
			this.writeHandler();
		}
	
		Parser.prototype.getLocation = function Parser$getLocation (startTag) {
			var c,
				l = this._location,
				end = this._current - (startTag ? 1 : 0),
				chunk = startTag && l.charOffset == 0 && this._current == 0;
			
			for (; l.charOffset < end; l.charOffset++) {
				c = this._buffer.charAt(l.charOffset);
				if (c == '\n') {
					l.inBuffer++;
					l.col = 0;
				} else if (c != '\r') {
					l.col++;
				}
			}
			return {
				  line: l.row + l.inBuffer + 1
				, col: l.col + (chunk ? 0: 1)
			};
		}
	
		//Checks the handler to make it is an object with the right "interface"
		Parser.prototype.validateHandler = function Parser$validateHandler (handler) {
			if ((typeof handler) != "object")
				throw new Error("Handler is not an object");
			if ((typeof handler.reset) != "function")
				throw new Error("Handler method 'reset' is invalid");
			if ((typeof handler.done) != "function")
				throw new Error("Handler method 'done' is invalid");
			if ((typeof handler.writeTag) != "function")
				throw new Error("Handler method 'writeTag' is invalid");
			if ((typeof handler.writeText) != "function")
				throw new Error("Handler method 'writeText' is invalid");
			if ((typeof handler.writeComment) != "function")
				throw new Error("Handler method 'writeComment' is invalid");
			if ((typeof handler.writeDirective) != "function")
				throw new Error("Handler method 'writeDirective' is invalid");
		}
	
		//Writes parsed elements out to the handler
		Parser.prototype.writeHandler = function Parser$writeHandler (forceFlush) {
			forceFlush = !!forceFlush;
			if (this._tagStack.length && !forceFlush)
				return;
			while (this._elements.length) {
				var element = this._elements.shift();
				switch (element.type) {
					case ElementType.Comment:
						this._handler.writeComment(element);
						break;
					case ElementType.Directive:
						this._handler.writeDirective(element);
						break;
					case ElementType.Text:
						this._handler.writeText(element);
						break;
					default:
						this._handler.writeTag(element);
						break;
				}
			}
		}
	
		Parser.prototype.handleError = function Parser$handleError (error) {
			if ((typeof this._handler.error) == "function")
				this._handler.error(error);
			else
				throw error;
		}
	
	//TODO: make this a trully streamable handler
	function RssHandler (callback) {
		RssHandler.super_.call(this, callback, { ignoreWhitespace: true, verbose: false, enforceEmptyTags: false });
	}
	inherits(RssHandler, DefaultHandler);
	
		RssHandler.prototype.done = function RssHandler$done () {
			var feed = { };
			var feedRoot;
	
			var found = DomUtils.getElementsByTagName(function (value) { return(value == "rss" || value == "feed"); }, this.dom, false);
			if (found.length) {
				feedRoot = found[0];
			}
			if (feedRoot) {
				if (feedRoot.name == "rss") {
					feed.type = "rss";
					feedRoot = feedRoot.children[0]; //<channel/>
					feed.id = "";
					try {
						feed.title = DomUtils.getElementsByTagName("title", feedRoot.children, false)[0].children[0].data;
					} catch (ex) { }
					try {
						feed.link = DomUtils.getElementsByTagName("link", feedRoot.children, false)[0].children[0].data;
					} catch (ex) { }
					try {
						feed.description = DomUtils.getElementsByTagName("description", feedRoot.children, false)[0].children[0].data;
					} catch (ex) { }
					try {
						feed.updated = new Date(DomUtils.getElementsByTagName("lastBuildDate", feedRoot.children, false)[0].children[0].data);
					} catch (ex) { }
					try {
						feed.author = DomUtils.getElementsByTagName("managingEditor", feedRoot.children, false)[0].children[0].data;
					} catch (ex) { }
					feed.items = [];
					DomUtils.getElementsByTagName("item", feedRoot.children).forEach(function (item, index, list) {
						var entry = {};
						try {
							entry.id = DomUtils.getElementsByTagName("guid", item.children, false)[0].children[0].data;
						} catch (ex) { }
						try {
							entry.title = DomUtils.getElementsByTagName("title", item.children, false)[0].children[0].data;
						} catch (ex) { }
						try {
							entry.link = DomUtils.getElementsByTagName("link", item.children, false)[0].children[0].data;
						} catch (ex) { }
						try {
							entry.description = DomUtils.getElementsByTagName("description", item.children, false)[0].children[0].data;
						} catch (ex) { }
						try {
							entry.pubDate = new Date(DomUtils.getElementsByTagName("pubDate", item.children, false)[0].children[0].data);
						} catch (ex) { }
						feed.items.push(entry);
					});
				} else {
					feed.type = "atom";
					try {
						feed.id = DomUtils.getElementsByTagName("id", feedRoot.children, false)[0].children[0].data;
					} catch (ex) { }
					try {
						feed.title = DomUtils.getElementsByTagName("title", feedRoot.children, false)[0].children[0].data;
					} catch (ex) { }
					try {
						feed.link = DomUtils.getElementsByTagName("link", feedRoot.children, false)[0].attribs.href;
					} catch (ex) { }
					try {
						feed.description = DomUtils.getElementsByTagName("subtitle", feedRoot.children, false)[0].children[0].data;
					} catch (ex) { }
					try {
						feed.updated = new Date(DomUtils.getElementsByTagName("updated", feedRoot.children, false)[0].children[0].data);
					} catch (ex) { }
					try {
						feed.author = DomUtils.getElementsByTagName("email", feedRoot.children, true)[0].children[0].data;
					} catch (ex) { }
					feed.items = [];
					DomUtils.getElementsByTagName("entry", feedRoot.children).forEach(function (item, index, list) {
						var entry = {};
						try {
							entry.id = DomUtils.getElementsByTagName("id", item.children, false)[0].children[0].data;
						} catch (ex) { }
						try {
							entry.title = DomUtils.getElementsByTagName("title", item.children, false)[0].children[0].data;
						} catch (ex) { }
						try {
							entry.link = DomUtils.getElementsByTagName("link", item.children, false)[0].attribs.href;
						} catch (ex) { }
						try {
							entry.description = DomUtils.getElementsByTagName("summary", item.children, false)[0].children[0].data;
						} catch (ex) { }
						try {
							entry.pubDate = new Date(DomUtils.getElementsByTagName("updated", item.children, false)[0].children[0].data);
						} catch (ex) { }
						feed.items.push(entry);
					});
				}
	
				this.dom = feed;
			}
			RssHandler.super_.prototype.done.call(this);
		}
	
	///////////////////////////////////////////////////
	
	function DefaultHandler (callback, options) {
		this.reset();
		this._options = options ? options : { };
		if (this._options.ignoreWhitespace == undefined)
			this._options.ignoreWhitespace = false; //Keep whitespace-only text nodes
		if (this._options.verbose == undefined)
			this._options.verbose = true; //Keep data property for tags and raw property for all
		if (this._options.enforceEmptyTags == undefined)
			this._options.enforceEmptyTags = true; //Don't allow children for HTML tags defined as empty in spec
		if ((typeof callback) == "function")
			this._callback = callback;
	}
	
		//**"Static"**//
		//HTML Tags that shouldn't contain child nodes
		DefaultHandler._emptyTags = {
			  area: 1
			, base: 1
			, basefont: 1
			, br: 1
			, col: 1
			, frame: 1
			, hr: 1
			, img: 1
			, input: 1
			, isindex: 1
			, link: 1
			, meta: 1
			, param: 1
			, embed: 1
		}
		//Regex to detect whitespace only text nodes
		DefaultHandler.reWhitespace = /^\s*$/;
	
		//**Public**//
		//Properties//
		DefaultHandler.prototype.dom = null; //The hierarchical object containing the parsed HTML
		//Methods//
		//Resets the handler back to starting state
		DefaultHandler.prototype.reset = function DefaultHandler$reset() {
			this.dom = [];
			this._done = false;
			this._tagStack = [];
			this._tagStack.last = function DefaultHandler$_tagStack$last () {
				return(this.length ? this[this.length - 1] : null);
			}
		}
		//Signals the handler that parsing is done
		DefaultHandler.prototype.done = function DefaultHandler$done () {
			this._done = true;
			this.handleCallback(null);
		}
		DefaultHandler.prototype.writeTag = function DefaultHandler$writeTag (element) {
			this.handleElement(element);
		} 
		DefaultHandler.prototype.writeText = function DefaultHandler$writeText (element) {
			if (this._options.ignoreWhitespace)
				if (DefaultHandler.reWhitespace.test(element.data))
					return;
			this.handleElement(element);
		} 
		DefaultHandler.prototype.writeComment = function DefaultHandler$writeComment (element) {
			this.handleElement(element);
		} 
		DefaultHandler.prototype.writeDirective = function DefaultHandler$writeDirective (element) {
			this.handleElement(element);
		}
		DefaultHandler.prototype.error = function DefaultHandler$error (error) {
			this.handleCallback(error);
		}
	
		//**Private**//
		//Properties//
		DefaultHandler.prototype._options = null; //Handler options for how to behave
		DefaultHandler.prototype._callback = null; //Callback to respond to when parsing done
		DefaultHandler.prototype._done = false; //Flag indicating whether handler has been notified of parsing completed
		DefaultHandler.prototype._tagStack = null; //List of parents to the currently element being processed
		//Methods//
		DefaultHandler.prototype.handleCallback = function DefaultHandler$handleCallback (error) {
				if ((typeof this._callback) != "function")
					if (error)
						throw error;
					else
						return;
				this._callback(error, this.dom);
		}
		
		DefaultHandler.prototype.isEmptyTag = function(element) {
			var name = element.name.toLowerCase();
			if (name.charAt(0) == '/') {
				name = name.substring(1);
			}
			return this._options.enforceEmptyTags && !!DefaultHandler._emptyTags[name];
		};
		
		DefaultHandler.prototype.handleElement = function DefaultHandler$handleElement (element) {
			if (this._done)
				this.handleCallback(new Error("Writing to the handler after done() called is not allowed without a reset()"));
			if (!this._options.verbose) {
	//			element.raw = null; //FIXME: Not clean
				//FIXME: Serious performance problem using delete
				delete element.raw;
				if (element.type == "tag" || element.type == "script" || element.type == "style")
					delete element.data;
			}
			if (!this._tagStack.last()) { //There are no parent elements
				//If the element can be a container, add it to the tag stack and the top level list
				if (element.type != ElementType.Text && element.type != ElementType.Comment && element.type != ElementType.Directive) {
					if (element.name.charAt(0) != "/") { //Ignore closing tags that obviously don't have an opening tag
						this.dom.push(element);
						if (!this.isEmptyTag(element)) { //Don't add tags to the tag stack that can't have children
							this._tagStack.push(element);
						}
					}
				}
				else //Otherwise just add to the top level list
					this.dom.push(element);
			}
			else { //There are parent elements
				//If the element can be a container, add it as a child of the element
				//on top of the tag stack and then add it to the tag stack
				if (element.type != ElementType.Text && element.type != ElementType.Comment && element.type != ElementType.Directive) {
					if (element.name.charAt(0) == "/") {
						//This is a closing tag, scan the tagStack to find the matching opening tag
						//and pop the stack up to the opening tag's parent
						var baseName = element.name.substring(1);
						if (!this.isEmptyTag(element)) {
							var pos = this._tagStack.length - 1;
							while (pos > -1 && this._tagStack[pos--].name != baseName) { }
							if (pos > -1 || this._tagStack[0].name == baseName)
								while (pos < this._tagStack.length - 1)
									this._tagStack.pop();
						}
					}
					else { //This is not a closing tag
						if (!this._tagStack.last().children)
							this._tagStack.last().children = [];
						this._tagStack.last().children.push(element);
						if (!this.isEmptyTag(element)) //Don't add tags to the tag stack that can't have children
							this._tagStack.push(element);
					}
				}
				else { //This is not a container element
					if (!this._tagStack.last().children)
						this._tagStack.last().children = [];
					this._tagStack.last().children.push(element);
				}
			}
		}
	
		var DomUtils = {
			  testElement: function DomUtils$testElement (options, element) {
				if (!element) {
					return false;
				}
		
				for (var key in options) {
					if (key == "tag_name") {
						if (element.type != "tag" && element.type != "script" && element.type != "style") {
							return false;
						}
						if (!options["tag_name"](element.name)) {
							return false;
						}
					} else if (key == "tag_type") {
						if (!options["tag_type"](element.type)) {
							return false;
						}
					} else if (key == "tag_contains") {
						if (element.type != "text" && element.type != "comment" && element.type != "directive") {
							return false;
						}
						if (!options["tag_contains"](element.data)) {
							return false;
						}
					} else {
						if (!element.attribs || !options[key](element.attribs[key])) {
							return false;
						}
					}
				}
			
				return true;
			}
		
			, getElements: function DomUtils$getElements (options, currentElement, recurse, limit) {
				recurse = (recurse === undefined || recurse === null) || !!recurse;
				limit = isNaN(parseInt(limit)) ? -1 : parseInt(limit);
	
				if (!currentElement) {
					return([]);
				}
		
				var found = [];
				var elementList;
	
				function getTest (checkVal) {
					return(function (value) { return(value == checkVal); });
				}
				for (var key in options) {
					if ((typeof options[key]) != "function") {
						options[key] = getTest(options[key]);
					}
				}
		
				if (DomUtils.testElement(options, currentElement)) {
					found.push(currentElement);
				}
	
				if (limit >= 0 && found.length >= limit) {
					return(found);
				}
	
				if (recurse && currentElement.children) {
					elementList = currentElement.children;
				} else if (currentElement instanceof Array) {
					elementList = currentElement;
				} else {
					return(found);
				}
		
				for (var i = 0; i < elementList.length; i++) {
					found = found.concat(DomUtils.getElements(options, elementList[i], recurse, limit));
					if (limit >= 0 && found.length >= limit) {
						break;
					}
				}
		
				return(found);
			}
			
			, getElementById: function DomUtils$getElementById (id, currentElement, recurse) {
				var result = DomUtils.getElements({ id: id }, currentElement, recurse, 1);
				return(result.length ? result[0] : null);
			}
			
			, getElementsByTagName: function DomUtils$getElementsByTagName (name, currentElement, recurse, limit) {
				return(DomUtils.getElements({ tag_name: name }, currentElement, recurse, limit));
			}
			
			, getElementsByTagType: function DomUtils$getElementsByTagType (type, currentElement, recurse, limit) {
				return(DomUtils.getElements({ tag_type: type }, currentElement, recurse, limit));
			}
		}
	
		function inherits (ctor, superCtor) {
			var tempCtor = function(){};
			tempCtor.prototype = superCtor.prototype;
			ctor.super_ = superCtor;
			ctor.prototype = new tempCtor();
			ctor.prototype.constructor = ctor;
		}
	
	exports.Parser = Parser;
	
	exports.DefaultHandler = DefaultHandler;
	
	exports.RssHandler = RssHandler;
	
	exports.ElementType = ElementType;
	
	exports.DomUtils = DomUtils;
	
	})();
	
	/* WEBPACK VAR INJECTION */}.call(exports, "/index.js", "/"))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  XmlEntities: __webpack_require__(4),
	  Html4Entities: __webpack_require__(5),
	  Html5Entities: __webpack_require__(6),
	  AllHtmlEntities: __webpack_require__(6)
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	var ALPHA_INDEX = {
	    '&lt': '<',
	    '&gt': '>',
	    '&quot': '"',
	    '&apos': '\'',
	    '&amp': '&',
	    '&lt;': '<',
	    '&gt;': '>',
	    '&quot;': '"',
	    '&apos;': '\'',
	    '&amp;': '&'
	};
	
	var CHAR_INDEX = {
	    60: 'lt',
	    62: 'gt',
	    34: 'quot',
	    39: 'apos',
	    38: 'amp'
	};
	
	var CHAR_S_INDEX = {
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    '\'': '&apos;',
	    '&': '&amp;'
	};
	
	/**
	 * @constructor
	 */
	function XmlEntities() {}
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	XmlEntities.prototype.encode = function(str) {
	    if (str.length === 0) {
	        return '';
	    }
	    return str.replace(/<|>|"|'|&/g, function(s) {
	        return CHAR_S_INDEX[s];
	    });
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 XmlEntities.encode = function(str) {
	    return new XmlEntities().encode(str);
	 };
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	XmlEntities.prototype.decode = function(str) {
	    if (str.length === 0) {
	        return '';
	    }
	    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
	        if (s.charAt(1) === '#') {
	            var code = s.charAt(2).toLowerCase() === 'x' ?
	                parseInt(s.substr(3), 16) :
	                parseInt(s.substr(2));
	
	            if (isNaN(code) || code < -32768 || code > 65535) {
	                return '';
	            }
	            return String.fromCharCode(code);
	        }
	        return ALPHA_INDEX[s] || s;
	    });
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 XmlEntities.decode = function(str) {
	    return new XmlEntities().decode(str);
	 };
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	XmlEntities.prototype.encodeNonUTF = function(str) {
	    var strLength = str.length;
	    if (strLength === 0) {
	        return '';
	    }
	    var result = '';
	    var i = 0;
	    while (i < strLength) {
	        var c = str.charCodeAt(i);
	        var alpha = CHAR_INDEX[c];
	        if (alpha) {
	            result += "&" + alpha + ";";
	            i++;
	            continue;
	        }
	        if (c < 32 || c > 126) {
	            result += '&#' + c + ';';
	        } else {
	            result += str.charAt(i);
	        }
	        i++;
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 XmlEntities.encodeNonUTF = function(str) {
	    return new XmlEntities().encodeNonUTF(str);
	 };
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	XmlEntities.prototype.encodeNonASCII = function(str) {
	    var strLenght = str.length;
	    if (strLenght === 0) {
	        return '';
	    }
	    var result = '';
	    var i = 0;
	    while (i < strLenght) {
	        var c = str.charCodeAt(i);
	        if (c <= 255) {
	            result += str[i++];
	            continue;
	        }
	        result += '&#' + c + ';';
	        i++;
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 XmlEntities.encodeNonASCII = function(str) {
	    return new XmlEntities().encodeNonASCII(str);
	 };
	
	module.exports = XmlEntities;


/***/ },
/* 5 */
/***/ function(module, exports) {

	var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'Oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'oelig', 'oelig', 'scaron', 'scaron', 'yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
	var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];
	
	var alphaIndex = {};
	var numIndex = {};
	
	var i = 0;
	var length = HTML_ALPHA.length;
	while (i < length) {
	    var a = HTML_ALPHA[i];
	    var c = HTML_CODES[i];
	    alphaIndex[a] = String.fromCharCode(c);
	    numIndex[c] = a;
	    i++;
	}
	
	/**
	 * @constructor
	 */
	function Html4Entities() {}
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.prototype.decode = function(str) {
	    if (str.length === 0) {
	        return '';
	    }
	    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
	        var chr;
	        if (entity.charAt(0) === "#") {
	            var code = entity.charAt(1).toLowerCase() === 'x' ?
	                parseInt(entity.substr(2), 16) :
	                parseInt(entity.substr(1));
	
	            if (!(isNaN(code) || code < -32768 || code > 65535)) {
	                chr = String.fromCharCode(code);
	            }
	        } else {
	            chr = alphaIndex[entity];
	        }
	        return chr || s;
	    });
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.decode = function(str) {
	    return new Html4Entities().decode(str);
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.prototype.encode = function(str) {
	    var strLength = str.length;
	    if (strLength === 0) {
	        return '';
	    }
	    var result = '';
	    var i = 0;
	    while (i < strLength) {
	        var alpha = numIndex[str.charCodeAt(i)];
	        result += alpha ? "&" + alpha + ";" : str.charAt(i);
	        i++;
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.encode = function(str) {
	    return new Html4Entities().encode(str);
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.prototype.encodeNonUTF = function(str) {
	    var strLength = str.length;
	    if (strLength === 0) {
	        return '';
	    }
	    var result = '';
	    var i = 0;
	    while (i < strLength) {
	        var cc = str.charCodeAt(i);
	        var alpha = numIndex[cc];
	        if (alpha) {
	            result += "&" + alpha + ";";
	        } else if (cc < 32 || cc > 126) {
	            result += "&#" + cc + ";";
	        } else {
	            result += str.charAt(i);
	        }
	        i++;
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.encodeNonUTF = function(str) {
	    return new Html4Entities().encodeNonUTF(str);
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.prototype.encodeNonASCII = function(str) {
	    var strLength = str.length;
	    if (strLength === 0) {
	        return '';
	    }
	    var result = '';
	    var i = 0;
	    while (i < strLength) {
	        var c = str.charCodeAt(i);
	        if (c <= 255) {
	            result += str[i++];
	            continue;
	        }
	        result += '&#' + c + ';';
	        i++;
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html4Entities.encodeNonASCII = function(str) {
	    return new Html4Entities().encodeNonASCII(str);
	};
	
	module.exports = Html4Entities;


/***/ },
/* 6 */
/***/ function(module, exports) {

	var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['CloseCurlyDoubleQuote', [8221]], ['CloseCurlyQuote', [8217]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];
	
	var alphaIndex = {};
	var charIndex = {};
	
	createIndexes(alphaIndex, charIndex);
	
	/**
	 * @constructor
	 */
	function Html5Entities() {}
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html5Entities.prototype.decode = function(str) {
	    if (str.length === 0) {
	        return '';
	    }
	    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
	        var chr;
	        if (entity.charAt(0) === "#") {
	            var code = entity.charAt(1) === 'x' ?
	                parseInt(entity.substr(2).toLowerCase(), 16) :
	                parseInt(entity.substr(1));
	
	            if (!(isNaN(code) || code < -32768 || code > 65535)) {
	                chr = String.fromCharCode(code);
	            }
	        } else {
	            chr = alphaIndex[entity];
	        }
	        return chr || s;
	    });
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 Html5Entities.decode = function(str) {
	    return new Html5Entities().decode(str);
	 };
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html5Entities.prototype.encode = function(str) {
	    var strLength = str.length;
	    if (strLength === 0) {
	        return '';
	    }
	    var result = '';
	    var i = 0;
	    while (i < strLength) {
	        var charInfo = charIndex[str.charCodeAt(i)];
	        if (charInfo) {
	            var alpha = charInfo[str.charCodeAt(i + 1)];
	            if (alpha) {
	                i++;
	            } else {
	                alpha = charInfo[''];
	            }
	            if (alpha) {
	                result += "&" + alpha + ";";
	                i++;
	                continue;
	            }
	        }
	        result += str.charAt(i);
	        i++;
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 Html5Entities.encode = function(str) {
	    return new Html5Entities().encode(str);
	 };
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html5Entities.prototype.encodeNonUTF = function(str) {
	    var strLength = str.length;
	    if (strLength === 0) {
	        return '';
	    }
	    var result = '';
	    var i = 0;
	    while (i < strLength) {
	        var c = str.charCodeAt(i);
	        var charInfo = charIndex[c];
	        if (charInfo) {
	            var alpha = charInfo[str.charCodeAt(i + 1)];
	            if (alpha) {
	                i++;
	            } else {
	                alpha = charInfo[''];
	            }
	            if (alpha) {
	                result += "&" + alpha + ";";
	                i++;
	                continue;
	            }
	        }
	        if (c < 32 || c > 126) {
	            result += '&#' + c + ';';
	        } else {
	            result += str.charAt(i);
	        }
	        i++;
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 Html5Entities.encodeNonUTF = function(str) {
	    return new Html5Entities().encodeNonUTF(str);
	 };
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	Html5Entities.prototype.encodeNonASCII = function(str) {
	    var strLength = str.length;
	    if (strLength === 0) {
	        return '';
	    }
	    var result = '';
	    var i = 0;
	    while (i < strLength) {
	        var c = str.charCodeAt(i);
	        if (c <= 255) {
	            result += str[i++];
	            continue;
	        }
	        result += '&#' + c + ';';
	        i++
	    }
	    return result;
	};
	
	/**
	 * @param {String} str
	 * @returns {String}
	 */
	 Html5Entities.encodeNonASCII = function(str) {
	    return new Html5Entities().encodeNonASCII(str);
	 };
	
	/**
	 * @param {Object} alphaIndex Passed by reference.
	 * @param {Object} charIndex Passed by reference.
	 */
	function createIndexes(alphaIndex, charIndex) {
	    var i = ENTITIES.length;
	    var _results = [];
	    while (i--) {
	        var e = ENTITIES[i];
	        var alpha = e[0];
	        var chars = e[1];
	        var chr = chars[0];
	        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
	        var charInfo;
	        if (addChar) {
	            charInfo = charIndex[chr] = charIndex[chr] || {};
	        }
	        if (chars[1]) {
	            var chr2 = chars[1];
	            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
	            _results.push(addChar && (charInfo[chr2] = alpha));
	        } else {
	            alphaIndex[alpha] = String.fromCharCode(chr);
	            _results.push(addChar && (charInfo[''] = alpha));
	        }
	    }
	}
	
	module.exports = Html5Entities;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _PathInfo = __webpack_require__(8);
	
	var _PathInfo2 = _interopRequireDefault(_PathInfo);
	
	var _Paragraph = __webpack_require__(9);
	
	var _Paragraph2 = _interopRequireDefault(_Paragraph);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var PARAGRAPH_TAGS = ['body', 'blockquote', 'caption', 'center', 'col', 'colgroup', 'dd', 'div', 'dl', 'dt', 'fieldset', 'form', 'legend', 'optgroup', 'option', 'p', 'pre', 'table', 'td', 'textarea', 'tfoot', 'th', 'thead', 'tr', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
	/**
	 * A class for converting a HTML page represented as a DOM object into a list
	 * of paragraphs.
	 * @class ParagraphMaker
	 */
	
	var ParagraphMaker = function () {
	  function ParagraphMaker() {
	    _classCallCheck(this, ParagraphMaker);
	
	    this.path = new _PathInfo2.default();
	    this.paragraphs = [];
	    this.paragraph = null;
	    this.link = false;
	    this.br = false;
	    this.startNewParagraph();
	  }
	
	  _createClass(ParagraphMaker, [{
	    key: 'startNewParagraph',
	    value: function startNewParagraph() {
	      if (this.paragraph && this.paragraph.containsText()) {
	        this.paragraphs.push(this.paragraph);
	      }
	
	      this.paragraph = new _Paragraph2.default(this.path);
	    }
	  }, {
	    key: 'startElementNS',
	    value: function startElementNS(name) {
	      this.path.append(name);
	      if (PARAGRAPH_TAGS.indexOf(name) !== -1 || name === 'br' && this.br) {
	        if (name === 'br') {
	          this.paragraph.tagsCount -= 1;
	        }
	
	        this.startNewParagraph();
	      } else {
	        this.br = name === 'br';
	        if (name === 'a') {
	          this.link = true;
	        }
	
	        this.paragraph.tagsCount += 1;
	      }
	    }
	  }, {
	    key: 'endElementNS',
	    value: function endElementNS(name) {
	      this.path.pop();
	      if (PARAGRAPH_TAGS.indexOf(name) !== -1) {
	        this.startNewParagraph();
	      }
	
	      if (name === 'a') {
	        this.link = false;
	      }
	    }
	  }, {
	    key: 'characters',
	    value: function characters(content) {
	      var trim = String.prototype.trim;
	      if (!!trim.call(content)) {
	        var text = this.paragraph.appendText(content);
	        if (this.link) {
	          this.paragraph.charsCountInLinks += text.length;
	        }
	        this.br = false;
	      }
	    }
	  }, {
	    key: 'parseHtmlDocument',
	    value: function parseHtmlDocument(root) {
	      var _this = this;
	
	      var hasOwnProperty = Object.prototype.hasOwnProperty;
	      root.forEach(function (dom) {
	        if (dom.type !== 'directive') {
	          if (hasOwnProperty.call(dom, 'children')) {
	            _this.startElementNS(dom.name);
	            _this.parseHtmlDocument(dom.children);
	            _this.endElementNS(dom.name);
	          } else {
	            if (dom.type === 'text') {
	              _this.characters(dom.data);
	            } else if (hasOwnProperty.call(dom, 'name')) {
	              // support br for multiple lines
	              _this.startElementNS(dom.name);
	            }
	          }
	        }
	      });
	    }
	
	    /**
	     * Converts root document into paragraphs.
	     **/
	
	  }, {
	    key: 'makeParagraphs',
	    value: function makeParagraphs(root) {
	      this.parseHtmlDocument(root);
	      console.log('makeParagraphs', this.paragraphs);
	      return this.paragraphs;
	    }
	  }]);
	
	  return ParagraphMaker;
	}();
	
	exports.default = ParagraphMaker;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 *
	 * list of triples (tag name, order, children)
	 * @class PathInfo
	 */
	var PathInfo = function () {
	  function PathInfo() {
	    _classCallCheck(this, PathInfo);
	
	    this.elements = [];
	  }
	
	  _createClass(PathInfo, [{
	    key: 'dom',
	    value: function dom() {
	      var html = [];
	      // base on tag name
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = this.elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var item = _step.value;
	
	          html.push(item[0]);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	
	      return html.join('.');
	    }
	  }, {
	    key: 'xpath',
	    value: function xpath() {
	      var path = '';
	      // path base on tag name and order
	      if (this.elements.length) {
	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;
	
	        try {
	          for (var _iterator2 = this.elements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	            var item = _step2.value;
	
	            path += '/' + item[0] + '[' + item[1] + ']';
	          }
	        } catch (err) {
	          _didIteratorError2 = true;
	          _iteratorError2 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion2 && _iterator2.return) {
	              _iterator2.return();
	            }
	          } finally {
	            if (_didIteratorError2) {
	              throw _iteratorError2;
	            }
	          }
	        }
	      } else {
	        path = '/';
	      }
	      return path;
	    }
	  }, {
	    key: 'append',
	    value: function append(tagName) {
	      var children = this.getChildren();
	      var order = children[tagName] + 1 || 1;
	      children[tagName] = order;
	      this.elements.push([tagName, order, {}]);
	      return this;
	    }
	  }, {
	    key: 'getChildren',
	    value: function getChildren() {
	      if (this.elements.length) {
	        return this.elements[this.elements.length - 1][2];
	      }
	      return {};
	    }
	  }, {
	    key: 'pop',
	    value: function pop() {
	      this.elements.pop();
	      return this;
	    }
	  }]);
	
	  return PathInfo;
	}();
	
	exports.default = PathInfo;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _PathInfo = __webpack_require__(8);
	
	var _PathInfo2 = _interopRequireDefault(_PathInfo);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * Object representing one block of text in HTML.
	 * @class Paragraph
	 */
	var Paragraph = function () {
	  function Paragraph() {
	    var path = arguments.length <= 0 || arguments[0] === undefined ? _PathInfo2.default : arguments[0];
	
	    _classCallCheck(this, Paragraph);
	
	    this.domPath = path.dom();
	    this.xpath = path.xpath();
	    this.textNodes = [];
	    this.charsCountInLinks = 0;
	    this.tagsCount = 0;
	    this.classType = '';
	  }
	
	  _createClass(Paragraph, [{
	    key: 'isHeading',
	    value: function isHeading() {
	      var re = /\bh\d\b/;
	      return this.domPath.search(re);
	    }
	  }, {
	    key: 'isBoilerplate',
	    value: function isBoilerplate() {
	      return this.classType !== 'good';
	    }
	  }, {
	    key: 'text',
	    value: function text() {
	      var str = '';
	      str = this.textNodes.join('');
	      // remove multi space to one space
	      str = str.replace(/\s{2,}/g, ' ');
	      // remove lead space
	      str = str.replace(/^\s+/, '');
	      // remove trailing space
	      str = str.replace(/\s+$/, '');
	      return str;
	    }
	  }, {
	    key: 'len',
	    value: function len() {
	      return this.text().length;
	    }
	  }, {
	    key: 'wordsCount',
	    value: function wordsCount() {
	      return this.text().split(' ').length;
	    }
	  }, {
	    key: 'containsText',
	    value: function containsText() {
	      return this.textNodes.length > 0;
	    }
	  }, {
	    key: 'appendText',
	    value: function appendText() {
	      var str = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	
	      var replace = String.prototype.replace;
	      var text = replace.call(str, /\s{2,}/g, ' ');
	      this.textNodes.push(text);
	      return text;
	    }
	  }, {
	    key: 'stopwordsCount',
	    value: function stopwordsCount() {
	      var stopwords = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	
	      var count = 0;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = this.text().split(' ')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var word = _step.value;
	
	          if (stopwords.indexOf(word.toLowerCase()) !== -1) {
	            count++;
	          }
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	
	      return count;
	    }
	  }, {
	    key: 'stopwordDesity',
	    value: function stopwordDesity() {
	      var stopwords = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	
	      var count = this.wordsCount();
	      if (count === 0) {
	        return 0;
	      }
	
	      return this.stopwordsCount(stopwords) / count;
	    }
	  }, {
	    key: 'linksDesity',
	    value: function linksDesity() {
	      var textLength = this.len();
	      if (textLength === 0) {
	        return 0;
	      }
	
	      return this.charsCountInLinks / textLength;
	    }
	  }]);
	
	  return Paragraph;
	}();
	
	exports.default = Paragraph;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _sprintfJs = __webpack_require__(11);
	
	var _sprintfJs2 = _interopRequireDefault(_sprintfJs);
	
	var _htmlEntities = __webpack_require__(3);
	
	var _htmlEntities2 = _interopRequireDefault(_htmlEntities);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Presenter = function () {
	  function Presenter() {
	    _classCallCheck(this, Presenter);
	  }
	
	  _createClass(Presenter, [{
	    key: 'defaultOuptut',
	
	
	    /**
	     * Outputs the paragraphs as:
	     * <tag> text of the first paragraph
	     * <tag> text of the second paragraph
	     * ...
	     * where <tag> is <p>, <h> or <b> which indicates
	     * standard paragraph, heading or boilerplate respecitvely.
	     * */
	    value: function defaultOuptut(paragraphs) {
	      var noBoilerPlate = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
	
	      var result = [];
	      var htmlDecoding = new _htmlEntities2.default.AllHtmlEntities();
	
	      paragraphs.forEach(function (paragraph) {
	        var tag = '';
	        if (paragraph.classType === 'good') {
	          if (paragraph.isHeading()) {
	            tag = 'h';
	          } else {
	            tag = 'p';
	          }
	        } else if (!noBoilerPlate) {
	          tag = 'b';
	        }
	        if (tag !== '') {
	          result.push(_sprintfJs2.default.sprintf('<%s> %s', tag, htmlDecoding.encode(paragraph.text())));
	        }
	      });
	      return result.join('\r\n');
	    }
	
	    /**
	     * Same as output_default, but only <p> tags are used and the following
	     * attributes are added: class, cfclass and heading.
	     * */
	
	  }, {
	    key: 'detailOuptut',
	    value: function detailOuptut(paragraphs) {
	      var result = [];
	      var htmlDecoding = new _htmlEntities2.default.AllHtmlEntities();
	
	      paragraphs.forEach(function (paragraph) {
	        result.push(_sprintfJs2.default.sprintf('<p class="%s" cfclass="%s" heading="%i" xpath="%s"> %s', paragraph.classType, paragraph.cfClass, Number(paragraph.isHeading(), 10), paragraph.xpath, htmlDecoding.encode(paragraph.text())));
	      });
	      return result.join('\r\n');
	    }
	
	    /**
	     * Outputs the paragraphs in a KrdWrd compatible format:
	     * class<TAB>first text node
	     * class<TAB>second text node
	     * ...
	     * where class is 1, 2 or 3 which means
	     * boilerplate, undecided or good respectively. Headings are output as
	     * undecided.
	     * */
	
	  }, {
	    key: 'krdwrdOuptut',
	    value: function krdwrdOuptut(paragraphs) {
	      var result = [];
	      paragraphs.forEach(function (paragraph) {
	        var cls = 1;
	        if (['good', 'neargood'].indexOf(paragraph.classType) !== -1) {
	          if (paragraph.isHeading()) {
	            cls = 2;
	          } else {
	            cls = 3;
	          }
	        }
	
	        for (var index = 0; index < paragraph.textNodes.length; index++) {
	          var str = paragraph.textNodes[index];
	          // remove lead space
	          str = str.replace(/^\s+/, '');
	          // remove trailing space
	          str = str.replace(/\s+$/, '');
	          result.push(_sprintfJs2.default.sprintf('%i\t%s', cls, str));
	        }
	      });
	      return result.join('\r\n');
	    }
	  }]);
	
	  return Presenter;
	}();
	
	exports.default = Presenter;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	(function(window) {
	    var re = {
	        not_string: /[^s]/,
	        number: /[diefg]/,
	        json: /[j]/,
	        not_json: /[^j]/,
	        text: /^[^\x25]+/,
	        modulo: /^\x25{2}/,
	        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijosuxX])/,
	        key: /^([a-z_][a-z_\d]*)/i,
	        key_access: /^\.([a-z_][a-z_\d]*)/i,
	        index_access: /^\[(\d+)\]/,
	        sign: /^[\+\-]/
	    }
	
	    function sprintf() {
	        var key = arguments[0], cache = sprintf.cache
	        if (!(cache[key] && cache.hasOwnProperty(key))) {
	            cache[key] = sprintf.parse(key)
	        }
	        return sprintf.format.call(null, cache[key], arguments)
	    }
	
	    sprintf.format = function(parse_tree, argv) {
	        var cursor = 1, tree_length = parse_tree.length, node_type = "", arg, output = [], i, k, match, pad, pad_character, pad_length, is_positive = true, sign = ""
	        for (i = 0; i < tree_length; i++) {
	            node_type = get_type(parse_tree[i])
	            if (node_type === "string") {
	                output[output.length] = parse_tree[i]
	            }
	            else if (node_type === "array") {
	                match = parse_tree[i] // convenience purposes only
	                if (match[2]) { // keyword argument
	                    arg = argv[cursor]
	                    for (k = 0; k < match[2].length; k++) {
	                        if (!arg.hasOwnProperty(match[2][k])) {
	                            throw new Error(sprintf("[sprintf] property '%s' does not exist", match[2][k]))
	                        }
	                        arg = arg[match[2][k]]
	                    }
	                }
	                else if (match[1]) { // positional argument (explicit)
	                    arg = argv[match[1]]
	                }
	                else { // positional argument (implicit)
	                    arg = argv[cursor++]
	                }
	
	                if (get_type(arg) == "function") {
	                    arg = arg()
	                }
	
	                if (re.not_string.test(match[8]) && re.not_json.test(match[8]) && (get_type(arg) != "number" && isNaN(arg))) {
	                    throw new TypeError(sprintf("[sprintf] expecting number but found %s", get_type(arg)))
	                }
	
	                if (re.number.test(match[8])) {
	                    is_positive = arg >= 0
	                }
	
	                switch (match[8]) {
	                    case "b":
	                        arg = arg.toString(2)
	                    break
	                    case "c":
	                        arg = String.fromCharCode(arg)
	                    break
	                    case "d":
	                    case "i":
	                        arg = parseInt(arg, 10)
	                    break
	                    case "j":
	                        arg = JSON.stringify(arg, null, match[6] ? parseInt(match[6]) : 0)
	                    break
	                    case "e":
	                        arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential()
	                    break
	                    case "f":
	                        arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg)
	                    break
	                    case "g":
	                        arg = match[7] ? parseFloat(arg).toPrecision(match[7]) : parseFloat(arg)
	                    break
	                    case "o":
	                        arg = arg.toString(8)
	                    break
	                    case "s":
	                        arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg)
	                    break
	                    case "u":
	                        arg = arg >>> 0
	                    break
	                    case "x":
	                        arg = arg.toString(16)
	                    break
	                    case "X":
	                        arg = arg.toString(16).toUpperCase()
	                    break
	                }
	                if (re.json.test(match[8])) {
	                    output[output.length] = arg
	                }
	                else {
	                    if (re.number.test(match[8]) && (!is_positive || match[3])) {
	                        sign = is_positive ? "+" : "-"
	                        arg = arg.toString().replace(re.sign, "")
	                    }
	                    else {
	                        sign = ""
	                    }
	                    pad_character = match[4] ? match[4] === "0" ? "0" : match[4].charAt(1) : " "
	                    pad_length = match[6] - (sign + arg).length
	                    pad = match[6] ? (pad_length > 0 ? str_repeat(pad_character, pad_length) : "") : ""
	                    output[output.length] = match[5] ? sign + arg + pad : (pad_character === "0" ? sign + pad + arg : pad + sign + arg)
	                }
	            }
	        }
	        return output.join("")
	    }
	
	    sprintf.cache = {}
	
	    sprintf.parse = function(fmt) {
	        var _fmt = fmt, match = [], parse_tree = [], arg_names = 0
	        while (_fmt) {
	            if ((match = re.text.exec(_fmt)) !== null) {
	                parse_tree[parse_tree.length] = match[0]
	            }
	            else if ((match = re.modulo.exec(_fmt)) !== null) {
	                parse_tree[parse_tree.length] = "%"
	            }
	            else if ((match = re.placeholder.exec(_fmt)) !== null) {
	                if (match[2]) {
	                    arg_names |= 1
	                    var field_list = [], replacement_field = match[2], field_match = []
	                    if ((field_match = re.key.exec(replacement_field)) !== null) {
	                        field_list[field_list.length] = field_match[1]
	                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== "") {
	                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {
	                                field_list[field_list.length] = field_match[1]
	                            }
	                            else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
	                                field_list[field_list.length] = field_match[1]
	                            }
	                            else {
	                                throw new SyntaxError("[sprintf] failed to parse named argument key")
	                            }
	                        }
	                    }
	                    else {
	                        throw new SyntaxError("[sprintf] failed to parse named argument key")
	                    }
	                    match[2] = field_list
	                }
	                else {
	                    arg_names |= 2
	                }
	                if (arg_names === 3) {
	                    throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported")
	                }
	                parse_tree[parse_tree.length] = match
	            }
	            else {
	                throw new SyntaxError("[sprintf] unexpected placeholder")
	            }
	            _fmt = _fmt.substring(match[0].length)
	        }
	        return parse_tree
	    }
	
	    var vsprintf = function(fmt, argv, _argv) {
	        _argv = (argv || []).slice(0)
	        _argv.splice(0, 0, fmt)
	        return sprintf.apply(null, _argv)
	    }
	
	    /**
	     * helpers
	     */
	    function get_type(variable) {
	        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase()
	    }
	
	    function str_repeat(input, multiplier) {
	        return Array(multiplier + 1).join(input)
	    }
	
	    /**
	     * export to either browser or node.js
	     */
	    if (true) {
	        exports.sprintf = sprintf
	        exports.vsprintf = vsprintf
	    }
	    else {
	        window.sprintf = sprintf
	        window.vsprintf = vsprintf
	
	        if (typeof define === "function" && define.amd) {
	            define(function() {
	                return {
	                    sprintf: sprintf,
	                    vsprintf: vsprintf
	                }
	            })
	        }
	    }
	})(typeof window === "undefined" ? this : window);


/***/ }
/******/ ])
});
;
//# sourceMappingURL=justext.js.map