const { getGlobalseoOptions } = require("../configs")

function getUnprefixedPathname(window, prefix, pathname) {
  const thePathname = pathname || window.location.pathname
  const domainSourcePrefix = prefix || getGlobalseoOptions(window)?.domainSourcePrefix
  if (!domainSourcePrefix) {
    return thePathname
  }
  
  return thePathname.replace(`/${domainSourcePrefix}/`, "/")
}

module.exports = getUnprefixedPathname
