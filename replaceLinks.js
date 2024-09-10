function replaceLinks(window, {langParam, lang, urlMode}) {
  // Select all anchor tags
  let anchors = window.document.querySelectorAll('a');

  // Main domain
  const domain = window.location.hostname.split('.').slice(-2).join('.');

  // Loop through all anchor tags
  for (let i = 0; i < anchors.length; i++) {
    let anchor = anchors[i];

    // assign full url if it's relative path
    if (!anchor.href.startsWith("http")) {
      const currentUrl = new URL(window.location.href);
      const fullHref = `${currentUrl.protocol}//${currentUrl.hostname}${anchor.href}`;
      anchor.href = fullHref;
    }

    const anchorDomain = anchor.hostname.split('.').slice(-2).join('.');
    if (urlMode == 'subdomain' && anchorDomain === domain) {
      // Create a new URL object
      let url = new URL(anchor.href);

      // append the first subdomain with lang
      // google.com -> en.google.com
      let subdomains = url.hostname.split('.');
      subdomains.splice(0, 0, lang);
      url.hostname = subdomains.join('.');

      // Update the href of the anchor tag
      anchor.href = url.href;
    } else if (urlMode == 'path' && anchor.hostname === window.location.hostname) {
      // Create a new URL object
      let url = new URL(anchor.href);

      // append the first slash with lang
      // google.com -> google.com/en
      let pathnames = url.pathname.split('/');
      pathnames.splice(1, 0, lang);
      url.pathname = pathnames.join('/');

      // Update the href of the anchor tag
      anchor.href = url.href;
    } else if ((anchor.hostname === window.location.hostname) && anchor.href !== `${window.location.href}#`) {
      // Check if the link is internal and does not contain a hash

      // Create a new URL object
      let url = new URL(anchor.href);

      // Set the search parameter "lang" to lang
      url.searchParams.set(langParam, lang);

      // Update the href of the anchor tag
      anchor.href = url.href;
      // console.log("anchor.href searchParams", anchor.href)
    }
  }
}

module.exports = replaceLinks;