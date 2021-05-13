/**
 * Convert integer to string and obfuscate it
 *
 * @param {number} id
 * @param {number} salt
 * @return {string}
 */
const encode = (id, salt = 0) => {
  if (id > 999999999) {
    throw new Error('ID must be less than 10^9')
  }

  if (salt > 999999999) {
    throw new Error('Salt must be less than 10^9')
  }

  const intermediate = Number(String(id).padStart(9, '0').split('').reverse().join(''))

  return (intermediate + salt).toString(36).padStart(6, '0')
}

/**
 * Deobfuscate a string and convert string to integer
 *
 * @param {string} string
 * @param {number} salt
 * @return {number}
 */
const decode = (string, salt = 0) => {
  const intermediate = parseInt(string, 36) - salt

  return parseInt(String(intermediate).padStart(9, '0').split('').reverse().join(''), 10)
}

module.exports = { encode, decode }
