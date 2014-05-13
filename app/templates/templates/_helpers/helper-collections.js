module.exports.register = function (Handlebars, options) {
  'use strict';

  Handlebars.registerHelper("foreach", function (arr, options) {
    if (options.inverse && !arr.length)
      return options.inverse(this);

    return arr.map(function (item, index) {
      item.$index = index;
      item.$isFirst = index === 0;
      item.$isLast = index === arr.length - 1;
      item.$index = index;
      return options.fn(item);
    }).join('');
  });

  Handlebars.registerHelper("lengthIsGreater", function (array, length, options) {
    if (array.length > length) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper("lengthIsGreaterOrEqual", function (array, length, options) {
    if (array.length >= length) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper("lengthIsLess", function (array, length, options) {
    if (array.length < length) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper("lengthIsLessOrEqual", function (array, length, options) {
    if (array.length <= length) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
}