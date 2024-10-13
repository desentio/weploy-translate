const { getGlobalseoOptions } = require("../configs")

function getPrefixedPathname(window, prefix, pathname) {
  const thePathname = pathname || window.location.pathname
  const domainSourcePrefix = prefix || getGlobalseoOptions(window)?.domainSourcePrefix
  if (!domainSourcePrefix) {
    return thePathname
  }

  if (thePathname.startsWith(`/${domainSourcePrefix}/`)) {
    return thePathname
  }
  
  return `/${domainSourcePrefix}${thePathname}`
}

module.exports = getPrefixedPathname
