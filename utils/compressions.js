function isCompressionSupported(window) {
  const isSupported = window.CompressionStream && window.DecompressionStream && window.TextEncoder && window.TextDecoder;
  return window.isWorker || !!isSupported;
}

function compressToArrayBuffer(window, string, encoding) {
  if (window.compressToArrayBuffer) return window.compressToArrayBuffer(string);
  const byteArray = new window.TextEncoder().encode(string);
  const cs = new window.CompressionStream(encoding);
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  return new window.Response(cs.readable).arrayBuffer();
}

function decompressArrayBuffer(window, byteArray, encoding) {
  if (window.decompressArrayBuffer) return window.decompressArrayBuffer(byteArray);
  const cs = new window.DecompressionStream(encoding);
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  return new window.Response(cs.readable).arrayBuffer().then(function (arrayBuffer) {
    return new window.TextDecoder().decode(arrayBuffer);
  });
}

async function compressToString(window, inputString, encoding) {
  try {
    if (window.compressToString) return await window.compressToString(inputString)
    // Compress the input string to an ArrayBuffer
    const compressedBuffer = await compressToArrayBuffer(window, inputString, encoding);

    // Convert the ArrayBuffer to a base64-encoded string
    const base64String = btoa(window.String.fromCharCode(...new window.Uint8Array(compressedBuffer)));

    return base64String;
  } catch (error) {
    console.error("Error compressing string:", error);
    throw error;
  }
}

function base64ToArrayBuffer(window, base64) {
  var binaryString = window.atob(base64);
  var len = binaryString.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

async function decompressString(window, base64String, encoding) {
  try {
    if (window.decompressString) return await window.decompressString(base64String)

    // Decode the base64-encoded string to an ArrayBuffer
    const compressedBuffer = base64ToArrayBuffer(window, base64String)

    // Decompress the ArrayBuffer
    const decompressed = await decompressArrayBuffer(window, compressedBuffer, encoding);
    return decompressed;
  } catch (error) {
    console.error("Error decompressing string:", error);
    throw error;
  }
}

module.exports = {
  compressToArrayBuffer,
  decompressArrayBuffer,
  compressToString,
  decompressString,
  isCompressionSupported
};
