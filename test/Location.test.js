const Location = artifacts.require('./contracts/Location.sol');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Location',([deployer, seller, buyer]) =>{
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

    describe('products', async () => {
        let result, productCount

        before(async () => {
            result = await location.createProduct('Tesla', web3.utils.toWei('1', 'Ether'), { from: seller })
            productCount = await location.productCount()
        })

        it('creates products', async () => {
            assert.equal(productCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'correct id type')
            assert.equal(event.name, 'Tesla', 'correct name type')
            assert.equal(event.price, '1000000000000000000', 'correct price type')
            assert.equal(event.owner, seller, 'owner is correct')
            assert.equal(event.purchased, false, 'correct purchase type')

            await await location.createProduct('', web3.utils.toWei('1', 'Ether'),{ from: seller }).should.be.rejected;
            await await location.createProduct('Tesla', 0,{ from: seller }).should.be.rejected;
        })

        it('sells products', async () => {
            let oldSellerBalance
            oldSellerBalance = await web3.eth.getBalance(seller)
            oldSellerBalance = new web3.utils.BN(oldSellerBalance)


            result = await location.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'Ether')})

            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'correct id type')
            assert.equal(event.name, 'Tesla', 'correct name type')
            assert.equal(event.price, '1000000000000000000', 'correct price type')
            assert.equal(event.owner, buyer, 'owner is correct')
            assert.equal(event.purchased, true, 'correct purchase type')

            let newSellerBalance
            newSellerBalance = await web3.eth.getBalance(seller)
            newSellerBalance = new web3.utils.BN(newSellerBalance)

            let price
            price = web3.utils.toWei('1', 'Ether')
            price = new web3.utils.BN(price)

            const exepectedBalance = oldSellerBalance.add(price)

            assert.equal(newSellerBalance.toString(), exepectedBalance.toString())


            await location.purchaseProduct(99, { from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;

            await location.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;

            await location.purchaseProduct(productCount, { from: deployer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;

            await location.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
        })
    })
})