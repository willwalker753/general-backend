const capitalizeWordsInString = input => {
    if (typeof input !== "string") return input;

    // create an array of words, remove extra spaces if any
    let wordsArr = input.trim().split(" ").filter(word => word !== "");
    // capitalize the first letter of each word in the array
    wordsArr = wordsArr.map(word => (
        word[0].toUpperCase() + word.slice(1)
    ))
    const capitalizedWords = wordsArr.join(" ");

    return capitalizedWords;
}

module.exports = capitalizeWordsInString;