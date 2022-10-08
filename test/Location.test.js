const Location = artifacts.require('./contracts/Location.sol');

contract('Location',(accounts) =>{
    let location

    before(async ()=> {
        location = await Location.deployed()
    })

    describe('deployment', async ()=> {
        it('deploys successfully', async ()=> {
            const address = await location.address
            assert.notEqual(address,0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name',  async ()=> {
            const name = await location.name()
            assert.equal(name, 'BlockChainApp Location')
        })
    })
})