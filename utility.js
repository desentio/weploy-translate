function CheckIfTranslatable(input) {
  //Check if string is just spaces 
  let trimmedContent = input.trim();
  if (trimmedContent.length < 1) {
    return "inValid";
  }



  // Single Word
  let singleWordRegex = /^\w+$/;
  if (!singleWordRegex.test(input)) {
    return input;
  }

  // Email
  let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/;
  if (emailRegex.test(input)) {
    return "inValid";
  }

  // Domain
  let domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,20}$/;
  if (domainRegex.test(input)) {
    return "inValid";
  }

  // Phone number
  let phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (phoneRegex.test(input)) {
    return "inValid";
  }

  // Emoji
  let emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}]/u;
  if (emojiRegex.test(input)) {
    return "inValid";
  }

  // Numbers
  let numbersRegex = /^[0-9]+$/;
  if (numbersRegex.test(input)) {
    return "inValid";
  }

  // Single character
  let specialCharacterRegex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (!specialCharacterRegex.test(input)) {
    return "inValid";
  }

  return input;
}

module.exports = CheckIfTranslatable;