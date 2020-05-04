class Product {
    constructor(title, imgUrl, price, description) {
        this.title = title;
        this.imgUrl = imgUrl;
        this.description = description;
        this.price = price;
    }
}

class ElementAttribute {
    constructor(attrName, attrValue) {
        this.name = attrName;
        this.value = attrValue;
    }
}

class Component {
    constructor(renderHookId, shouldRender = true) {
        this.hookId = renderHookId;
        if (shouldRender) {
            this.render();
        }
    }

    render() {}

    createRootElement( tag, cssClasses, attributes) {
        const rootElement = document.createElement(tag);
        if (cssClasses) {
            rootElement.className = cssClasses;
        }
        if (attributes && attributes.length > 0) {
            for (const attr of attributes) {
                rootElement.setAttribute(attr.name, attr.value);
            }
        }
        document.getElementById(this.hookId).append(rootElement);
        return rootElement;
    }
}

class ShoppingCart extends Component {
    items =[];

    set cartItems(value) {
        this.items = value;
        this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(2)}</h2>`;
    }

    get totalAmount() {
        const sum = this.items.reduce(
            (prevValue, curItem) =>  prevValue + curItem.price
        , 0)
        return sum;
    }

    constructor(renderHookId) {
        super(renderHookId, false);
        this.orderProducts = () => {
            console.log('Ordering...');
            console.log(this.items)
        }
        this.render();
    }

    addProduct(product) {
        const UpdatedItems = [...this.items];
        UpdatedItems.push(product);
        this.cartItems = UpdatedItems;
    }

    render() {
        
        const cartEl = this.createRootElement('section', 'cart');
        cartEl.innerHTML = `
        <h2>Total: \$${0}</h2>
        <button>Order now!</button>
        `;
        const orderBtn = cartEl.querySelector('button');
        orderBtn.addEventListener('click', this.orderProducts);
        this.totalOutput = cartEl.querySelector('h2');
    }
}

class ProductItem extends Component {
    constructor(product, renderId) {
        super(renderId, false);
        this.product = product;
        this.render();
    }

    addToCart() {
        App.addProductToCart(this.product);
    }

    render() {
        const prodEl = this.createRootElement('li', 'product-item');
        prodEl.innerHTML = `
        <div>
            <img src="${this.product.imgUrl}" alt="${this.product.title}">
            <div class="product-item__content">
                <h2>${this.product.title}</h2>
                <h3>\$${this.product.price}</h3>
                <p>${this.product.description}</p>
                <button>Add to cart</button>
            </div>
        </div>
        `;
        const addCartButton = prodEl.querySelector('button');
        addCartButton.addEventListener('click', this.addToCart.bind(this));
    
    }
}

class ProdList extends Component{
    #products = [];

    constructor(renderId) {
        super(renderId, false);
        this.render();
        this.fetchProducts();
    }
 
    fetchProducts() {
        this.#products = [new Product(
            'Fruits',
            'https://homepages.cae.wisc.edu/~ece533/images/fruits.png',
            19.99, 
            'A soft pillow!'
        ),
        new Product(
            'airplane', 
            'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
            89.99,
            'A lovely carpet!'
        )];
        this.renderProducts();
    }

    renderProducts() {
        for (const prod of this.#products) {
            new ProductItem(prod, 'product-list');
        }
    }

    render() {
        this.createRootElement('ul', 'product-list', [new ElementAttribute('id', 'product-list')]);
        if ( this.#products && this.#products.length > 0) {
            this.renderProducts(); 
        }
    }

}


class Shop {
    constructor() {
       this.render();
    }

    render() {
        this.cart = new ShoppingCart('app');
        new ProdList('app');
    }
}


class App {

    static init() {
        const shop = new Shop();
        this.cart = shop.cart;    
    }

    static addProductToCart(product) {
        this.cart.addProduct(product);
    }
}

App.init();


