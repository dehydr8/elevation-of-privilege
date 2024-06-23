import { shapes, V, dia, util } from 'jointjs';
import {
  defineHasOpenThreats,
  defineOutOfScope,
  defineProperties,
  editNameElement,
  editNameLink,
  wordUnwrap,
} from './utils.js';

const Highlighter = {
  highlighter: {
    name: 'addClass',
    options: {
      className: 'highlighted',
    },
  },
};

//data flow shape

const Flow = dia.Link.extend({
  markup: [
    '<path class="connection" stroke="black"/>',
    '<path class="marker-source" fill="black" stroke="black" />',
    '<path class="marker-target" fill="black" stroke="black" />',
    '<path class="connection-wrap"/><title class="tooltip"></title>',
    '<g class="labels"/>',
  ].join(''),

  arrowheadMarkup: [
    '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
    '<circle class="marker-arrowhead" end="<%= end %>" r="6" />',
    '</g>',
  ].join(''),

  setLabel: function (labelText) {
    this.attributes.labels = [
      {
        position: 0.5,
        attrs: {
          text: { text: labelText, 'font-weight': '400', 'font-size': 'small' },
        },
      },
    ];
  },

  defaults: util.defaultsDeep(
    {
      type: 'tm.Flow',
      attrs: {
        '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' },
      },
      smooth: true,
    },
    dia.Link.prototype.defaults,
  ),
});

//flow element properties

Object.defineProperty(Flow.prototype, 'name', {
  get: function () {
    return wordUnwrap(this.attributes.labels[0].attrs.text.text);
  },
  set: function (value) {
    editNameLink(this, value);
  },
});

defineOutOfScope(Flow.prototype, 'connection');
defineHasOpenThreats(Flow.prototype, ['connection', 'marker-target']);
defineProperties(Flow.prototype, [
  'reasonOutOfScope',
  'protocol',
  'isEncrypted',
  'isPublicNetwork',
  'threats',
]);

//trust boundary shape

const Boundary = dia.Link.extend({
  markup: [
    '<path class="connection" stroke="black"/>',
    '<path class="marker-source" fill="black" stroke="black" />',
    '<path class="marker-target" fill="black" stroke="black" />',
    '<path class="connection-wrap"/><title class="tooltip"></title>',
    '<g class="labels"/>',
  ].join(''),

  arrowheadMarkup: [
    '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
    '<circle class="marker-arrowhead" end="<%= end %>" r="6" />',
    '</g>',
  ].join(''),

  setLabel: function (labelText) {
    this.attributes.labels = [
      {
        position: 0.5,
        attrs: {
          text: { text: labelText, 'font-weight': '400', 'font-size': 'small' },
        },
      },
    ];
  },

  defaults: util.defaultsDeep(
    {
      type: 'tm.Boundary',
      attrs: {
        '.connection': {
          stroke: 'green',
          'stroke-width': 3,
          'stroke-dasharray': '10,5',
        },
      },
      smooth: true,
    },
    dia.Link.prototype.defaults,
  ),
});

//element with tool bar

const toolElement = shapes.basic.Generic.extend({
  toolMarkup: [
    '<g class="element-tools">',
    '<g class="element-tool-remove"><circle fill="red" r="11"/>',
    '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
    '<title>Remove this element from the model</title>',
    '</g>',
    '<g class="element-tool-link"><circle r="11" transform="translate(23,0)"/>',
    '<path fill="none" stroke="white" stroke-width="6" transform="scale (0.7) translate(20.86, 11)" d="m6.5 -1.47 l13.5 -9.53 l-13.5 -9.53"/> ',
    '<title>Link from here</title>',
    '</g>',
    '</g>',
  ].join(''),

  defaults: util.defaultsDeep(
    {
      attrs: {
        text: {
          'font-weight': 400,
          'font-size': 'small',
          fill: 'black',
          'text-anchor': 'middle',
          'ref-x': 0.5,
          'ref-y': 0.5,
          'y-alignment': 'middle',
        },
      },
    },
    shapes.basic.Generic.prototype.defaults,
  ),
});

//tool element properties

Object.defineProperty(toolElement.prototype, 'name', {
  get: function () {
    return wordUnwrap(this.attr('text/text'));
  },
  set: function (value) {
    editNameElement(this, value);
  },
});

defineProperties(toolElement.prototype, ['reasonOutOfScope', 'threats']);
defineOutOfScope(toolElement.prototype, 'element-shape');
defineHasOpenThreats(toolElement.prototype, ['element-shape', 'element-text']);

//process element shape

const Process = toolElement.extend({
  markup:
    '<g class="rotatable"><g class="scalable"><circle class="element-shape hasNoOpenThreats isInScope"/><title class="tooltip"/></g><text class="element-text hasNoOpenThreats isInScope"/></g>',

  defaults: util.defaultsDeep(
    {
      type: 'tm.Process',
      attrs: {
        '.element-shape': {
          'stroke-width': 1,
          r: 30,
          stroke: 'black',
          transform: 'translate(30, 30)',
        },
        text: { ref: '.element-shape' },
      },
      size: { width: 100, height: 100 },
    },
    toolElement.prototype.defaults,
  ),
});

//define process element properties

defineProperties(Process.prototype, ['privilegeLevel']);

//data store element shape

const Store = toolElement.extend({
  markup:
    '<g class="rotatable"><g class="scalable"><rect/><path class="element-shape hasNoOpenThreats isInScope"/><title class="tooltip"/></g><text class="element-text hasNoOpenThreats isInScope"/></g>',

  defaults: util.defaultsDeep(
    {
      type: 'tm.Store',
      attrs: {
        rect: {
          fill: 'white',
          stroke: 'white',
          'follow-scale': true,
          width: 160,
          height: 80,
        },
        '.element-shape': {
          d: 'M0 0 H160 M0 80 H160',
          stroke: 'black',
          fill: 'white',
          'stroke-width': 1,
          'follow-scale': true,
        },
        text: { ref: '.element-shape' },
      },
      size: { width: 160, height: 80 },
    },
    toolElement.prototype.defaults,
  ),
});

//data store properties

defineProperties(Store.prototype, [
  'isALog',
  'storesCredentials',
  'isEncrypted',
  'isSigned',
]);

//actor element shape

const Actor = toolElement.extend({
  markup:
    '<g class="rotatable"><g class="scalable"><rect class="element-shape hasNoOpenThreats isInScope"/><title class="tooltip"/></g><text class="element-text hasNoOpenThreats isInScope"/></g>',

  defaults: util.defaultsDeep(
    {
      type: 'tm.Actor',
      attrs: {
        '.element-shape': {
          fill: 'white',
          stroke: 'black',
          'stroke-width': 1,
          'follow-scale': true,
          width: 160,
          height: 80,
        },
        text: { ref: '.element-shape' },
      },
      size: { width: 160, height: 80 },
    },
    toolElement.prototype.defaults,
  ),
});

//actor properties

defineProperties(Store.prototype, ['providesAuthentication']);

//custom views

const ToolElementView = dia.ElementView.extend({
  initialize: function () {
    dia.ElementView.prototype.initialize.apply(this, arguments);
  },

  render: function () {
    dia.ElementView.prototype.render.apply(this, arguments);

    this.renderTools();
    this.update();

    return this;
  },

  renderTools: function () {
    var toolMarkup = this.model.toolMarkup || this.model.get('toolMarkup');

    if (toolMarkup) {
      var nodes = V(toolMarkup);
      V(this.el).append(nodes);
    }

    return this;
  },

  pointerclick: function (evt, x, y) {
    this._dx = x;
    this._dy = y;
    this._action = '';

    var className = evt.target.parentNode.getAttribute('class');

    switch (className) {
      case 'element-tool-remove':
        this.model.remove();
        return;

      case 'element-tool-link':
        this._action = 'linkFrom';
        break;

      case 'element-tool-link linking':
        this._action = 'removeLinkFrom';
        break;

      default:
    }

    dia.CellView.prototype.pointerclick.apply(this, arguments);
  },

  setSelected: function () {
    this.highlight(null, Highlighter);
  },
  setUnselected: function () {
    this.unhighlight(null, Highlighter);
  },
  addLinkFrom: function () {
    this.linkFrom = true;
    new V(this.$el.find('.element-tool-link')[0]).addClass('linking');
  },
  removeLinkFrom: function () {
    this.linkFrom = false;
    new V(this.$el.find('.element-tool-link')[0]).removeClass('linking');
  },
});

const StoreView = ToolElementView;

const ActorView = ToolElementView;

const ProcessView = ToolElementView;

const LinkView = dia.LinkView.extend({
  setSelected: function () {
    this.highlight(null, Highlighter);
  },
  setUnselected: function () {
    this.unhighlight(null, Highlighter);
  },
});

const FlowView = LinkView;

const BoundaryView = LinkView;

const tm = {
  Highlighter,
  Flow,
  Boundary,
  toolElement,
  Process,
  Store,
  Actor,
  ToolElementView,
  StoreView,
  ActorView,
  ProcessView,
  LinkView,
  FlowView,
  BoundaryView,
};

Object.assign(shapes, { tm });
