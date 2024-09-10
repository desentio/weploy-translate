async function setLocalStorageExpiration(window) {
  // get the current date
  const now = new Date();

  // get the current date timestamp
  const nowTimestamp = now.getTime();

  // expiration in 24 hours
  const expiration = nowTimestamp + (24 * 60 * 60 * 1000);

  // get globalseoExpirationTimestamp from localStorage
  const globalseoExpirationTimestamp = await window.localStorage.getItem("globalseoExpirationTimestamp");
  const timestamp = Number(globalseoExpirationTimestamp);

  // if globalseoExpirationTimestamp is not set or not valid or already expired, set it to the current date timestamp
  if (isNaN(timestamp) || timestamp < nowTimestamp) {
    window.localStorage.setItem("globalseoExpirationTimestamp", String(expiration));
  }
}

module.exports = setLocalStorageExpiration;
