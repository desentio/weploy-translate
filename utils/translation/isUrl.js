// Check if the text is a URL
const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
'((([a-z\\d]*)\\.)+[a-z]{2,}|'+ // domain name
'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
'(\\#[-a-z\\d_]*)?$','i'); // fragment locator

function isUrl(text) {
  return urlPattern.test(text)
}

module.exports = isUrl;
