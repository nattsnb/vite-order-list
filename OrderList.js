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
    await Promise.all([
      fetch(
        "https://my-json-server.typicode.com/Solnick/fake-orders-db/buyers",
      ),
      fetch(
        "https://my-json-server.typicode.com/Solnick/fake-orders-db/orders",
      ),
      fetch(
        "https://my-json-server.typicode.com/Solnick/fake-orders-db/products",
      ),
    ])
      .then((responsesArray) =>
        Promise.all(responsesArray.map((res) => res.json())),
      )
      .then((data) => (this.fetchedData = data))
      .then((dataArray) => console.log(dataArray));
    this.proceedData();
  }

  findItemById(list, id) {
    return list.find((obj) => obj.id === id).name;
  }
  proceedData() {
    for (let i = 0; i < this.fetchedData[1].length; i++) {
      const transactionId = this.fetchedData[1][i].id;
      const productId = this.fetchedData[1][i].productId;
      const productName = this.findItemById(this.fetchedData[2], productId);
      const buyerId = this.fetchedData[1][i].buyerId;
      const buyerName = this.findItemById(this.fetchedData[0], buyerId);
      this.finishedData.push({
        transactionId: transactionId,
        productName: productName,
        buyerName: buyerName,
      });
    }
    console.log(this.finishedData);
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
    if (this.ticketsToBeRendered > 0) {
      const order = {
        id: this.finishedData[this.ticketsRendered].transactionId,
        productName: this.finishedData[this.ticketsRendered].productName,
      };
      const buyer = this.finishedData[this.ticketsRendered].buyerName;
      this.createOrderTile(order, buyer);
      this.ticketsRendered = this.ticketsRendered + 1;
      this.ticketsToBeRendered = this.ticketsToBeRendered - 1;
    } else {
      console.log("no more tickets to be printed");
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
