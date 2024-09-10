const { getGlobalseoOptions, OLD_EXCLUDE_CLASS } = require("../configs");

function isExcludedClassName(window,className) {
  const globalseoOptions = getGlobalseoOptions(window);

  return className.includes(OLD_EXCLUDE_CLASS) || className.includes("globalseo-exclude") || globalseoOptions.excludeClasses.length && globalseoOptions.excludeClasses.some(excludeClass => excludeClass && className.includes(excludeClass))
}
exports.isExcludedClassName = isExcludedClassName;

function isExcludedId(window, id) {
  if (!id) return false;
  
  const globalseoOptions = getGlobalseoOptions(window);

  return globalseoOptions.excludeIds.length && globalseoOptions.excludeIds.some(excludeId => excludeId && id.includes(excludeId))
}
exports.isExcludedId = isExcludedId;
