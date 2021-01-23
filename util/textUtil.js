'use strict';

const leven = require("leven");

/**
 * utility function to perform approximate string matching.  This is useful in cases like voice integration where the voice recognition may not
 * produce perfect text input, i.e., what the user says may not be perfectly converted into text.  In such case, an approximate matching needs to
 * be performed.
 * @function module:Util/Text.approxTextMatch
 * @return {ApproximateTextMatch} The best match if it matches above the similarity threshold provided.
 * @param {string} item - A string to be matched to a list of strings for best approximate matching.
 * @param {string[]} list - An array of strings to be matched with item.
 * @param {boolean} [lowerCase] - if true, the item and list are first converted to lower case before matching.
 * @param {boolean} [removeSpace] - if true, the item and list are first stripped of space before matching.
 * @param {number} threshold - A number between 0 and 1, with higher number meaning higher similarity.
 */
function approxTextMatch(item, list, lowerCase, removeSpace, threshold) {
  function preProcess(item) {
    if (removeSpace) {
      item = item.replace(/\s/g, '');
    }
    if (lowerCase) {
      item = item.toLowerCase();
    }
    return item;
  }
  var matched = false;
  var matchedItem = null;
  var itemProcessed = preProcess(item);
  var result = list.map(function (listItem) {
    var listItemProcessed = preProcess(listItem);
    if (itemProcessed === listItemProcessed) {
      matchedItem = {
        exactMatch: true,
        similarity: 1,
        item: listItem
      };
      matched = true;
      return matchedItem;
    }
    const L = Math.max(itemProcessed.length, listItemProcessed.length);
    const similarity = (L - leven(itemProcessed, listItemProcessed)) / L;
    return {
      similarity,
      exactMatch: false,
      item: listItem
    };
  });
  if (!matched) {
    // console.log(result);
    matchedItem = result.reduce((prev, current) => {
      return ((prev && current.similarity > prev.similarity) ? current : prev) || current;
    }, null);
    if (matchedItem && matchedItem.similarity >= (threshold)) {
      return matchedItem;
    }
    else {
      return null;
    }
  }
  else {
    return matchedItem;
  }
}

/**
 * Text is a set of text-based utiltiies for bot message processing.
 * @module Util/Text
 */
module.exports = {
  approxTextMatch,
};
