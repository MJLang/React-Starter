exports.toHyphens = function(s) {
  return s.replace(/(?:^|\.?)([A-Z])/g, function (x,y){return "-" + y.toLowerCase()}).replace(/^-/, "")
}
  
exports.toSpaces = function(s) {
  return s.replace(/(?:^|\.?)([A-Z])/g, function (x,y){return " " + y}).replace(/^ /, "")
}
  
exports.toFirstLower = function (s) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
  