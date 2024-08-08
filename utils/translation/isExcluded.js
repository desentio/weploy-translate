const { getGlobalseoOptions, OLD_EXCLUDE_CLASS } = require("../configs");

function isExcludedClassName(className) {
  const globalseoOptions = getGlobalseoOptions();

  return className.includes(OLD_EXCLUDE_CLASS) || className.includes("globalseo-exclude") || globalseoOptions.excludeClasses.length && globalseoOptions.excludeClasses.some(excludeClass => excludeClass && className.includes(excludeClass))
}
exports.isExcludedClassName = isExcludedClassName;

function isExcludedId(id) {
  if (!id) return false;
  
  const globalseoOptions = getGlobalseoOptions();

  return globalseoOptions.excludeIds.length && globalseoOptions.excludeIds.some(excludeId => excludeId && id.includes(excludeId))
}
exports.isExcludedId = isExcludedId;
