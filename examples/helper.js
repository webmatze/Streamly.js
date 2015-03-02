var logToConsole = function logToConsole(value) {
  console.log(value);
};
var say = function say(text) {
  return function() {
    alert(text);
  };
};
var always = function always(value) {
  return function(_) {
    return value;
  };
};
var equals = function equals(value) {
  return function(data) {
    return data == value;
  };
};
var targetId = function targetId(event) {
  return event.target.id;
};
var add = function add(a, b) {
  return a + b;
};
var concat = function concat(a1, a2) {
  return a1.concat(a2);
};
var join = function join(joinBy) {
  return function(values) {
    return values.join(joinBy);
  };
};
var output = function output(elementId, preText) {
  var element = $(elementId);
  return function(value) {
    element.text(preText + value);
  };
};
