export class OrderList {
    constructor(){
        this.fetchedData = {}
        this.finishedData = []
        this.fetchData()
    }

    async fetchData(){
        await Promise.all([
            fetch('https://my-json-server.typicode.com/Solnick/fake-orders-db/buyers'),
            fetch('https://my-json-server.typicode.com/Solnick/fake-orders-db/orders'),
            fetch('https://my-json-server.typicode.com/Solnick/fake-orders-db/products')
        ])
            .then(responsesArray => Promise.all(responsesArray.map(res => res.json())))
            .then(data => this.fetchedData = data)
            .then(dataArray => console.log(dataArray))
        this.proceedData()
    }

    findProductById (list, id) {
        return list.find((obj) => obj.id === id).name
    }
    proceedData() {
        for (let i = 0; i < this.fetchedData[1].length; i++) {
            const transactionId = this.fetchedData[1][i].id;
            const productId = this.fetchedData[1][i].productId
            const productName = this.findProductById(this.fetchedData[2], productId)
            const buyerId = this.fetchedData[1][i].buyerId
            const buyerName = this.findProductById(this.fetchedData[0], buyerId)
            this.finishedData.push({transactionId: transactionId, productName: productName, buyerName: buyerName})
        }
        console.log(this.finishedData)
    }




    createOrderTile(order, buyer) {
        const tile = document.createElement('div');
        tile.style.border = '1px solid black';
        tile.style.width = '200px';
        tile.style.height = '100px';
        const orderDetails = document.createElement('span');
        orderDetails.innerText = `order: ${order.id} \n ${order.product.amount}: ${order.product.name}`;
        const buyerDetails = document.createElement('span');
        buyerDetails.innerHTML = `bought by: ${buyer.name}`;

        tile.append(orderDetails);
        tile.append(document.createElement('p'));
        tile.append(buyerDetails);

        return tile;
    }
}