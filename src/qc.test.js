const { encode, decode } = require('./qc')

describe('Tests for quick code logic', () => {
  it('encode() -> decode()', async () => {
    const salt = Math.floor(100000000 * Math.random())

    // console.log(`Salt = ${salt}`)

    for (let i = 0; i < 10; i++) {
      const random = Math.floor(100000000 * Math.random())

      expect(decode(encode(random, salt), salt)).toBe(random)
    }

    expect(() => { encode(1234567890, salt) }).toThrow('ID must be less than 10^9')
    expect(() => { encode(salt, 1234567890) }).toThrow('Salt must be less than 10^9')
  })
})
