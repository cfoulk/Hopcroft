const _capitalize = (inputString) => {
  if (!inputString.includes("-")) {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
  }
  return inputString.replace(
    /([a-z]+)-([a-z]+)/g,
    function (_, firstWord, secondWord) {
      return (
        firstWord.charAt(0).toUpperCase() +
        firstWord.slice(1) +
        " " +
        secondWord.charAt(0).toUpperCase() +
        secondWord.slice(1)
      );
    }
  );
};

console.log(_capitalize("linked-list"));
console.log(_capitalize("trees"));
