import { hash, isHashValid } from './cipher';

describe('cipher', () => {
  it('should be hashed', async () => {
    const result = await hash('abcd1234');
    // $2b$10$iRgh/WJB14oV/lV99HYE7uh5ZAZ02tR7WzG1FXfaixqUkmsybvrdK
    // $2b$10$NoXLkYzdh1Pr3OgCHxlAT.r6sIQiHSSDwKKH6LO7iIcLEfj61QOga
    // $2b$10$WY348tB.rU8h2CGruToW7OJHYk4KYnpIut5oco1QPmYdL3DDdvLaO
    // $2b$10$0CB3Xj8y1EpBg.JtBol/1Oj.4.dSWb7fqT33/m.tqWl54PoNjzUO2
    console.log(result);
    expect(result.length).toEqual(60); // $2b$10$ : 7글자, salt : 22글자, hash-value : 31글자

  });

  it('should be valid', async () => {
    const result = await isHashValid('abcd1234', '$2b$10$0CB3Xj8y1EpBg.JtBol/1Oj.4.dSWb7fqT33/m.tqWl54PoNjzUO2');
    console.log(result);
    expect(result).toEqual(true);
  })
})
