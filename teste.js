function encrypt(text, key) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    // XOR each character with the corresponding character in the key
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result); // Converte o resultado para Base64 para garantir que seja seguro para transmissão
}



console.log(encrypt('191382', '8h29304unh9_'));

console.log(encrypt('Se você tentou usar essa senha diretamente no cadeado... Saiba que a sua jornada está apenas começando. Bem vinda a https://memories-of-brotherhood.github.io. Vá em busca das memórias perdidas pelo reino de Santos. Quando estiver perto da memória, o scan irá te ajudar. Sua primeira dica é: Comece do começo de tudo', '8h29304unh9_'));