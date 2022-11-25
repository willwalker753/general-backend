
/* 
    Parse the city and state from a string
    Does not work if input has a street address, zip code, etc

    returns object { city: "Dallas", state: "TX" }
        if state exists, it will be abbreviated.
        if state does not exist, the return state value will be null
*/  
const parseCityState = (cityState) => {
    const stateNameAbbrList = [
        { name: "ALABAMA", abbr: "AL"},
        { name: "ALASKA", abbr: "AK"},
        { name: "AMERICAN SAMOA", abbr: "AS"},
        { name: "ARIZONA", abbr: "AZ"},
        { name: "ARKANSAS", abbr: "AR"},
        { name: "CALIFORNIA", abbr: "CA"},
        { name: "COLORADO", abbr: "CO"},
        { name: "CONNECTICUT", abbr: "CT"},
        { name: "DELAWARE", abbr: "DE"},
        { name: "DISTRICT OF COLUMBIA", abbr: "DC"},
        { name: "FLORIDA", abbr: "FL"},
        { name: "GEORGIA", abbr: "GA"},
        { name: "GUAM", abbr: "GU"},
        { name: "HAWAII", abbr: "HI"},
        { name: "IDAHO", abbr: "ID"},
        { name: "ILLINOIS", abbr: "IL"},
        { name: "INDIANA", abbr: "IN"},
        { name: "IOWA", abbr: "IA"},
        { name: "KANSAS", abbr: "KS"},
        { name: "KENTUCKY", abbr: "KY"},
        { name: "LOUISIANA", abbr: "LA"},
        { name: "MAINE", abbr: "ME"},
        { name: "MARSHALL ISLANDS", abbr: "MH"},
        { name: "MARYLAND", abbr: "MD"},
        { name: "MASSACHUSETTS", abbr: "MA"},
        { name: "MICHIGAN", abbr: "MI"},
        { name: "MINNESOTA", abbr: "MN"},
        { name: "MISSISSIPPI", abbr: "MS"},
        { name: "MISSOURI", abbr: "MO"},
        { name: "MONTANA", abbr: "MT"},
        { name: "NEBRASKA", abbr: "NE"},
        { name: "NEVADA", abbr: "NV"},
        { name: "NEW HAMPSHIRE", abbr: "NH"},
        { name: "NEW JERSEY", abbr: "NJ"},
        { name: "NEW MEXICO", abbr: "NM"},
        { name: "NEW YORK", abbr: "NY"},
        { name: "NORTH CAROLINA", abbr: "NC"},
        { name: "NORTH DAKOTA", abbr: "ND"},
        { name: "OHIO", abbr: "OH"},
        { name: "OKLAHOMA", abbr: "OK"},
        { name: "OREGON", abbr: "OR"},
        { name: "PALAU", abbr: "PW"},
        { name: "PENNSYLVANIA", abbr: "PA"},
        { name: "PUERTO RICO", abbr: "PR"},
        { name: "RHODE ISLAND", abbr: "RI"},
        { name: "SOUTH CAROLINA", abbr: "SC"},
        { name: "SOUTH DAKOTA", abbr: "SD"},
        { name: "TENNESSEE", abbr: "TN"},
        { name: "TEXAS", abbr: "TX"},
        { name: "UTAH", abbr: "UT"},
        { name: "VERMONT", abbr: "VT"},
        { name: "VIRGIN ISLANDS", abbr: "VI"},
        { name: "VIRGINIA", abbr: "VA"},
        { name: "WASHINGTON", abbr: "WA"},
        { name: "WEST VIRGINIA", abbr: "WV"},
        { name: "WISCONSIN", abbr: "WI"},
        { name: "WYOMING", abbr: "WY" }
    ];

    const trimmedCityState = cityState.trim();
    let wordArr = trimmedCityState.replace(",",", ").split(" ").filter(word => word !== "");

    // if there is only 1 word, then assume there is no state
    if (wordArr.length === 1) {
        return { city: trimmedCityState, state: null };
    }
    
    // if the last word is a 2 letter state abbreviation
    if (wordArr[wordArr.length-1].length === 2) {
        const possibleStateAbbr = wordArr[wordArr.length-1].toUpperCase();
        const matchingStates = stateNameAbbrList.filter(index => index.abbr === possibleStateAbbr);
        if (matchingStates.length > 0) {
            return {
                city: wordArr.slice(0, wordArr.length - 1).join(" ").replace(",", "").trim(), // assume city is all words before state, remove commma if exists
                state: matchingStates[0].abbr
            }
        }
    }

    // if the last 1 to 3 words are a state
    for (let i=1; i<=3; i++) {
        // if the wordArr length is greater than the number of words being checked, then we can assume there is still a city before the state being checked
        if (wordArr.length <= i) continue;

        const possibleStateName = wordArr.slice(-i).join(" ").replace(",", "").toUpperCase();
        const matchingStates = stateNameAbbrList.filter(index => index.name === possibleStateName);
        if (matchingStates.length > 0) {
            return {
                city: wordArr.slice(0, wordArr.length-i).join(" ").replace(",", "").trim(), // assume city is all words before state, remove commma if exists
                state: matchingStates[0].abbr
            }
        }
    }

    // else there is no state
    return {
        city: trimmedCityState.replace(",", ""),
        state: null
    }
}

module.exports = {
    parseCityState
}