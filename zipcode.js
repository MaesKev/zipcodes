const {readFileSync} = require('fs');

function readZipcodes(filename) {
  const output = [];
  const cities = readFileSync(filename, 'utf-8');
  const arr = cities.split('\r\n');
  for (let index = 0; index < arr.length; index++) {
    output[index] = arr[index].split('\t');
  }
  return output;
}

function findUniqueNumbers(zipcode) {
  const numbers = zipcode.split('');
  let uniqueNumbers = [...new Set(numbers)];
  return uniqueNumbers;
}

function zipcodeContainsOnlyNumbers(zipcode, numberArray) {
  const allNumbers = ['0','1','2','3','4','5','6','7','8','9'];
  const difference = allNumbers.filter(x => !numberArray.includes(x));
  for (let index = 0; index < difference.length; index++) {
    if(zipcode.includes(difference[index])) {
      return false;
    }
  }
  return true;
}

function findMatchingZipcodes(zipcode) {
  const output = [];
  const cities = readZipcodes('postalcodes.txt');
  const numberArray = findUniqueNumbers(zipcode);

  cities.forEach(city => {
    if(zipcodeContainsOnlyNumbers(city[0], numberArray)) {
      output.push(city);
    }
  });

  return output;
}

function sortByZipcode(cities) {
  return cities.sort((a, b) => {
    if(parseInt(a[0]) > parseInt(b[0])) {
      return 1
    } else if(parseInt(a[0]) < parseInt(b[0])) {
      return -1
    } else if(parseInt(a[0]) == parseInt(b[0])) {
      return a[1].localeCompare(b[1])
    }
  })
}

function mergeCommonZipcodes(sortedCities) {
  for (let index = 0; index < sortedCities.length; index++) {
    for (let index = 0; index < sortedCities.length; index++) {
      if(sortedCities[index+1]) {
        if(sortedCities[index][0] == sortedCities[index+1][0]) {
          sortedCities[index][1] = sortedCities[index][1] + `, ${sortedCities[index+1][1]}`;
          sortedCities.splice(index+1, 1)
        }
      }
    }
  }

  return sortedCities;
}

function prettyPrint(mergedCities) {
  let output = '';
  mergedCities.forEach(city => {
    output += `${city[0]} - ${city[1]}\n`
  });
  console.log(output);
}

function generateOutput(input) {
  if(typeof(input) === 'number') {
    input = input.toString();
  }
  const output = findMatchingZipcodes(input);
  const sorted = sortByZipcode(output);
  const merged = mergeCommonZipcodes(sorted);
  prettyPrint(merged);
}

generateOutput(2800);
