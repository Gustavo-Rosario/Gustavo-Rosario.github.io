export function decrypt(encryptedText, key) {
  const decodedText = atob(encryptedText); // Decodifica o texto Base64
  let result = '';
  for (let i = 0; i < decodedText.length; i++) {
    // XOR each character with the corresponding character in the key
    result += String.fromCharCode(decodedText.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}