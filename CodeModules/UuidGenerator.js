
/*
 *  http://stackoverflow.com/questions/1320568/best-way-to-generate-unique-ids-client-side-with-javascript
 */
var _generate = function() {
  // RFC4122: The version 4 UUID is meant for generating UUIDs from truly-random or
  // pseudo-random numbers.
  // The algorithm is as follows:
  //     Set the two most significant bits (bits 6 and 7) of the
  //        clock_seq_hi_and_reserved to zero and one, respectively.
  //     Set the four most significant bits (bits 12 through 15) of the
  //        time_hi_and_version field to the 4-bit version number from
  //        Section 4.1.3. Version4
  //     Set all the other bits to randomly (or pseudo-randomly) chosen
  //     values.
  // UUID                   = time-low "-" time-mid "-"time-high-and-version "-"clock-seq-reserved and low(2hexOctet)"-" node
  // time-low               = 4hexOctet
  // time-mid               = 2hexOctet
  // time-high-and-version  = 2hexOctet
  // clock-seq-and-reserved = hexOctet:
  // clock-seq-low          = hexOctet
  // node                   = 6hexOctet
  // Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  // y could be 1000, 1001, 1010, 1011 since most significant two bits needs to be 10
  // y values are 8, 9, A, B
  var guidHolder = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  var hex = '0123456789abcdef';
  var r = 0;
  var guidResponse = "";
  for (var i = 0; i < 36; i++) {
      if (guidHolder[i] !== '-' && guidHolder[i] !== '4') {
          // each x and y needs to be random
          r = Math.random() * 16 | 0;
      }

      if (guidHolder[i] === 'x') {
          guidResponse += hex[r];
      } else if (guidHolder[i] === 'y') {
          // clock-seq-and-reserved first hex is filtered and remaining hex values are random
          r &= 0x3; // bit and with 0011 to set pos 2 to zero ?0??
          r |= 0x8; // set pos 3 to 1 as 1???
          guidResponse += hex[r];
      } else {
          guidResponse += guidHolder[i];
      }
  }

  return guidResponse;
};


module.exports = {
  generate: _generate
}
