const { getGlobalseoOptions, OLD_EXCLUDE_CLASS } = require("../configs");

function isExcluded(className) {
  const globalseoOptions = getGlobalseoOptions();

  return className.includes(OLD_EXCLUDE_CLASS) || className.includes("globalseo-exclude") || globalseoOptions.excludeClasses.length && globalseoOptions.excludeClasses.some(excludeClass => excludeClass && className.includes(excludeClass))
}

module.exports = isExcluded;
