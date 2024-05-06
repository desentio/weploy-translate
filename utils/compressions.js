function compressToArrayBuffer(string, encoding) {
  const byteArray = new TextEncoder().encode(string);
  const cs = new CompressionStream(encoding);
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  return new Response(cs.readable).arrayBuffer();
}

function decompressArrayBuffer(byteArray, encoding) {
  const cs = new DecompressionStream(encoding);
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  return new Response(cs.readable).arrayBuffer().then(function (arrayBuffer) {
    return new TextDecoder().decode(arrayBuffer);
  });
}

async function compressToString(inputString, encoding) {
  try {
    // Compress the input string to an ArrayBuffer
    const compressedBuffer = await compressToArrayBuffer(inputString, encoding);

    // Convert the ArrayBuffer to a base64-encoded string
    const base64String = btoa(String.fromCharCode(...new Uint8Array(compressedBuffer)));

    return base64String;
  } catch (error) {
    console.error("Error compressing string:", error);
    throw error;
  }
}

function base64ToArrayBuffer(base64) {
  var binaryString = window.atob(base64);
  var len = binaryString.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

async function decompressString(base64String, encoding) {
  try {
    // Decode the base64-encoded string to an ArrayBuffer
    const compressedBuffer = base64ToArrayBuffer(base64String)

    // Decompress the ArrayBuffer
    const decompressed = await decompressArrayBuffer(compressedBuffer, encoding);
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
  decompressString
};
