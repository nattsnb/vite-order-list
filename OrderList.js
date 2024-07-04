export class OrderList {
  constructor() {
    this.fetchedData = {};
    this.finishedData = [];
    this.ticketsRendered = 0;
    this.ticketsToBeRendered = 0;
    this.fetchData();
    this.initializeRenderButton();
  }

  async fetchData() {
    const responsesArray = await Promise.all([
      fetch(
        "https://my-json-server.typicode.com/Solnick/fake-orders-db/buyers",
      ),
      fetch(
        "https://my-json-server.typicode.com/Solnick/fake-orders-db/orders",
      ),
      fetch(
        "https://my-json-server.typicode.com/Solnick/fake-orders-db/products",
      ),
    ]);
    const dataToProcess = await Promise.all(responsesArray.map((res) => res.json()));
    this.fetchedData.buyers = dataToProcess[0]
    this.fetchedData.orders = dataToProcess[1]
    this.fetchedData.products = dataToProcess[2]
    this.transformData();
  }

  findItemById(list, id) {
    return list.find((obj) => obj.id === id).name;
  }

  transformData = () => {
    for (let i = 0; i < this.fetchedData.orders.length; i++) {
      const transactionId = this.fetchedData.orders[i].id;
      const productId = this.fetchedData.orders[i].productId;
      const productName = this.findItemById(this.fetchedData.products, productId);
      const buyerId = this.fetchedData.orders[i].buyerId;
      const buyerName = this.findItemById(this.fetchedData.buyers, buyerId);
      this.finishedData.push({
        transactionId: transactionId,
        productName: productName,
        buyerName: buyerName,
      });
    }
    this.ticketsToBeRendered = this.finishedData.length;
  }
  initializeRenderButton = () => {
    const renderButton = document.createElement("button");
    document.body.append(renderButton);
    renderButton.innerHTML = "RENDER";
    this.addEventListenerToRenderButton(renderButton);
  };

  addEventListenerToRenderButton = (button) => {
    button.addEventListener("click", this.render);
  };

  render = () => {
    for (let i = 0; i < this.ticketsToBeRendered; i++) {
      const order = {
        id: this.finishedData[this.ticketsRendered].transactionId,
        productName: this.finishedData[this.ticketsRendered].productName,
      };
      const buyer = this.finishedData[this.ticketsRendered].buyerName;
      this.createOrderTile(order, buyer);
      this.ticketsRendered = this.ticketsRendered + 1;
    }
  };

  createOrderTile(order, buyer) {
    const tile = document.createElement("div");
    document.body.append(tile);
    tile.style.border = "1px solid black";
    tile.style.width = "200px";
    tile.style.height = "100px";
    const orderDetails = document.createElement("span");
    orderDetails.innerText = `order: ${order.id} \n 1: ${order.productName}`;
    const buyerDetails = document.createElement("span");
    buyerDetails.innerHTML = `bought by: ${buyer}`;

    tile.append(orderDetails);
    tile.append(document.createElement("p"));
    tile.append(buyerDetails);

    return tile;
  }
}
