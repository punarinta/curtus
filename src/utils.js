/**
 * @param {import('http').ServerResponse} res
 */
const respondToOptions = (res) => {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  })
  res.end()
}

/*
 * Deep merge two or more objects together.
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 */
/**
 * @param {any} objects
 * @return {Record<string, any>}
 */
const deepMerge = (...objects) => {
  // Setup merged object
  /**
   * @type {Record<string, any>}
   */
  const newObj = {}

  // Merge the object into the newObj object
  /**
   * @param {Record<string, any>} obj
   */
  const merge = function (obj) {
    for (const prop in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(prop)) {
        // if property is an object, merge properties
        if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
          // @ts-ignore
          newObj[prop] = deepMerge(newObj[prop], obj[prop])
        } else {
          // @ts-ignore
          newObj[prop] = obj[prop]
        }
      }
    }
  }

  // loop through each object and conduct a merge
  for (let i = 0; i < objects.length; i++) {
    // @ts-ignore
    merge(objects[i])
  }

  // @ts-ignore
  return newObj
}

module.exports = { respondToOptions, deepMerge }
