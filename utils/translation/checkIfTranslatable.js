function checkIfTranslatable(input) {
  //Check if string is just spaces 
  let trimmedContent = input.trim();
  if (trimmedContent.length == 0 ) {
    return "inValid";
  }

  //check if string too big
  if (trimmedContent.length > 50000) {
    return "inValid";
  }

  //Check if string contains at least one character that represent letter in any language excluding emoji
  let containsText = /[\p{Ll}\p{Lu}\p{Lt}\p{Lo}\p{Nl}]/gu;
  if (!containsText.test(trimmedContent)) {
    return "inValid";
  }

  // Code string filters
  let codeStringRegex = /<[^>]*>|\/\/.*|\/\*[\s\S]*?\*\/|#.*|<!--[\s\S]*?-->|{.*}|def .*:|function .*{|public .*{|#include <|import .*/;
  if (codeStringRegex.test(trimmedContent)) {
    return "inValid";
  }

  // If not single word then just make it valid
  let multiWords = /^\W+|\s+|\W+$/;
  if (multiWords.test(trimmedContent)) {
    return input;
  }

  // Email
  let emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
  if (emailRegex.test(trimmedContent)) {
    return "inValid";
  }

  // Domain
  let domainRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.){1,2}[a-zA-Z]{2,}(\/[a-zA-Z0-9]+)*$/;
  if (domainRegex.test(trimmedContent)) {
    return "inValid";
  }

  // Phone number
  let phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (phoneRegex.test(trimmedContent)) {
    return "inValid";
  }

  // Emoji
  let emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}]/u;
  if (emojiRegex.test(trimmedContent)) {
    return "inValid";
  }

  // Numbers
  let numbersRegex = /^[0-9]+$/;
  if (numbersRegex.test(trimmedContent)) {
    return "inValid";
  }

  // Single character
  let specialCharacterRegex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (specialCharacterRegex.test(trimmedContent)) {
    return "inValid";
  }
  
  return input;
}

module.exports = checkIfTranslatable;
