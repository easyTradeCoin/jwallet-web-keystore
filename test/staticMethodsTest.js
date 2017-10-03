const should = require('should')
const Keystore = require('../index')

const validMnemonic = 'come average primary sunny profit eager toy pulp struggle hazard tourist round'
const invalidMnemonic = `${validMnemonic} some other words`

const mnemonicEntropy = 'some custom entropy'
const mnemonicBufferLength = 64

const validPrivateKey = `0x${'1'.repeat(64)}`
const invalidPrivateKey = `${validPrivateKey}%`

const validPrivateKeyLength = 64
const invalidPrivateKeyLength = 65

const validPassword = 'qwe123RTY$%^'
const invalidPassword = '111111'

const passwordTestsCount = 7
const customPasswordConfig = { minLength: 20 }

const mnemonicWordsCount = 12

describe('generateMnemonic', function() {
  it('should generate 12 random English words', function(done) {
    const mnemonic = Keystore.generateMnemonic()
    const mnemonicWithEntropy = Keystore.generateMnemonic(mnemonicEntropy)
    const mnemonicWithBufferLength = Keystore.generateMnemonic(mnemonicEntropy, mnemonicBufferLength)

    const words = mnemonic.toString().split(' ')
    const wordsWithEntropy = mnemonicWithEntropy.toString().split(' ')
    const wordsWithBufferLength = mnemonicWithBufferLength.toString().split(' ')

    mnemonic.should.be.an.Object()
    words.length.should.be.equal(mnemonicWordsCount)

    mnemonicWithEntropy.should.be.an.Object()
    wordsWithEntropy.length.should.be.equal(mnemonicWordsCount)

    mnemonicWithBufferLength.should.be.an.Object()
    wordsWithBufferLength.length.should.be.equal(mnemonicWordsCount)

    done()
  })
})

describe('isMnemonicValid', function() {
  it('should return true when generated Mnemonic is valid', function(done) {
    const isMnemonicValid1 = Keystore.isMnemonicValid(validMnemonic)
    const isMnemonicValid2 = Keystore.isMnemonicValid(invalidMnemonic)

    isMnemonicValid1.should.be.a.Boolean()
    isMnemonicValid1.should.be.equal(true)

    isMnemonicValid2.should.be.a.Boolean()
    isMnemonicValid2.should.be.equal(false)

    done()
  })
})

describe('isHashStringValid', function() {
  it('should return true when private key is correct', function(done) {
    const isPrivateKeyValid1 = Keystore.isHashStringValid(validPrivateKey, validPrivateKeyLength)
    const isPrivateKeyValid2 = Keystore.isHashStringValid(invalidPrivateKey, invalidPrivateKeyLength)

    isPrivateKeyValid1.should.be.a.Boolean()
    isPrivateKeyValid1.should.be.equal(true)

    isPrivateKeyValid2.should.be.a.Boolean()
    isPrivateKeyValid2.should.be.equal(false)

    done()
  })
})

describe('testPassword', function() {
  it('should return failed/passed tests count and errors if any', function(done) {
    const testValidPasswordResult = Keystore.testPassword(validPassword)
    const testInvalidPasswordResult = Keystore.testPassword(invalidPassword)
    const testPasswordResultWithCustomConfig = Keystore.testPassword(validPassword, customPasswordConfig)

    testValidPasswordResult.should.be.an.Object()
    testValidPasswordResult.failedTests.should.be.equal(0)
    testValidPasswordResult.passedTests.should.be.equal(passwordTestsCount)
    testValidPasswordResult.errors.should.be.an.Array()
    testValidPasswordResult.errors.length.should.be.equal(0)

    testInvalidPasswordResult.should.be.an.Object()
    testInvalidPasswordResult.failedTests.should.be.equal(5)
    testInvalidPasswordResult.passedTests.should.be.equal(2)
    testInvalidPasswordResult.errors.should.be.an.Array()
    testInvalidPasswordResult.errors.length.should.be.equal(5)

    testPasswordResultWithCustomConfig.should.be.an.Object()
    testPasswordResultWithCustomConfig.failedTests.should.be.equal(1)
    testPasswordResultWithCustomConfig.passedTests.should.be.equal(6)
    testPasswordResultWithCustomConfig.errors.should.be.an.Array()
    testPasswordResultWithCustomConfig.errors.length.should.be.equal(1)
    testPasswordResultWithCustomConfig.errors[0].should.be.equal(
      `The password must be at least ${customPasswordConfig.minLength} characters long.`
    )

    done()
  })
})