import { util } from 'jointjs';

// utility functions for threat model shapes

export function editNameElement(element, value) {
  element.attr('text/text', wordWrap(element, value));
}

export function editNameLink(element, value) {
  element.label(0, {
    attrs: { text: { text: wordWrap(element, value) } },
  });
}

export function wordWrap(element, text) {
  var size = element.isLink()
    ? { width: 140, height: 80 }
    : element.get('size');
  return util.breakText(text, size, {});
}

export function wordUnwrap(text) {
  return text.replace('\n', ' ');
}

export function defineProperties(proto, properties) {
  properties.forEach(function (property) {
    Object.defineProperty(proto, property, {
      get: function () {
        return this.prop(property);
      },
      set: function (value) {
        this.prop(property, value);
      },
    });
  });
}

export function defineOutOfScope(proto, selectorClass) {
  Object.defineProperty(proto, 'outOfScope', {
    get: function () {
      return this.prop('outOfScope');
    },
    set: function (value) {
      var selector = '.' + selectorClass + '/class';
      var originalClass =
        this.attr(selector) || selectorClass + ' hasNoOpenThreats isInScope';

      if (value) {
        this.attr(selector, originalClass.replace('isInScope', 'isOutOfScope'));
      } else {
        this.attr(selector, originalClass.replace('isOutOfScope', 'isInScope'));
      }

      this.prop('outOfScope', value);
    },
  });
}

export function defineHasOpenThreats(proto, selectorClasses) {
  Object.defineProperty(proto, 'hasOpenThreats', {
    get: function () {
      return this.prop('hasOpenThreats');
    },
    set: function (value) {
      var element = this;

      selectorClasses.forEach(function (selectorClass) {
        var selector = '.' + selectorClass + '/class';
        var originalClass =
          element.attr(selector) ||
          selectorClass + ' hasNoOpenThreats isInScope';

        if (value) {
          element.attr(
            selector,
            originalClass.replace('hasNoOpenThreats', 'hasOpenThreats'),
          );
        } else {
          element.attr(
            selector,
            originalClass.replace('hasOpenThreats', 'hasNoOpenThreats'),
          );
        }
      });

      this.prop('hasOpenThreats', value);
    },
  });
}
