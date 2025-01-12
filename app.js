let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');
let totalToPay = document.querySelector('.totalPriceToPay .amount');


const button = document.getElementById('getValueBtn');
const inputBox = document.getElementById('applyPromo');
const total = document.getElementById('getTotal');
let listProduct = [];
let carts = [];


iconCart.addEventListener('click', () => {
    // The toggle method checks if the showCart class is already present on the body. If the class is present, it removes it. If it's not present, it adds it.
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

// Live test work start From here...
button.addEventListener('click', () => {
    const inputValue = inputBox.value;
    if(inputValue == "ostad10") {
        //console.log('yes');
        let TotalPrice = parseFloat(totalToPay.textContent);
        if (isNaN(TotalPrice)) {
            TotalPrice = 0; 
        }
        TotalPrice = TotalPrice - (TotalPrice*10/100);
        totalToPay.innerText = TotalPrice.toFixed(2);
        alert('PromoCode Successfully Applied');

    } else if (inputValue == "ostad5") {
        let TotalPrice = parseFloat(totalToPay.textContent);
        if (isNaN(TotalPrice)) {
            TotalPrice = 0; 
        }
        TotalPrice = TotalPrice - (TotalPrice*5/100);
        totalToPay.innerText = TotalPrice.toFixed(2);
        alert('PromoCode Successfully Applied');
        
    } else {
        alert("Invalid Promo COde");
    }
})


const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if(listProduct.length > 0) {
        listProduct.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="description">${product.description}</div>
                <div class="price">Tk ${product.price}</div>
                <button class="addCart">
                    Add to cart
                </button>
            `;
            listProductHTML.appendChild(newProduct);
        })
    }
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalAmountToPay = 0;
    if(carts.length > 0) {
        carts.forEach(cart => {
            console.log(listProduct);
            console.log(cart.product_id);
            let positionProduct = listProduct.findIndex((value) => value.id == cart.product_id);
            if(positionProduct<0) {
                //console.log('tutul');
                return;
            }
            let info = listProduct[positionProduct];
            let newCart = document.createElement('div');
            totalQuantity += cart.quantity;
            totalAmountToPay += (cart.quantity * info.price);
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            
            newCart.innerHTML = `
                <div class="image">
                    <img src="${info.image}" alt="">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalPrice">
                    Tk ${cart.quantity * info.price} 
                </div>
                <div class="quantity">
                    <span class="minus"> - </span>
                    <span>${cart.quantity}</span>
                    <span class="plus"> + </span>
                </div>
                <div class="remove">
                    <button class="bad">Remove</button>
                </div>
            `;
            listCartHTML.appendChild(newCart);
        })
    }
    iconCartSpan.innerText = totalQuantity;
    totalToPay.innerText = totalAmountToPay;
}


const changeQuantity = (product_id,type) => {
    let positionProduct = carts.findIndex((value) => value.product_id == product_id);
    //console.log(positionProduct);
    if(positionProduct >= 0) {
        switch(type) {
            case 'plus':
                carts[positionProduct].quantity += 1;
                break;
            default:
                let valueChange = carts[positionProduct].quantity - 1;
                if(valueChange > 0) {
                    carts[positionProduct].quantity = valueChange;
                } else {
                    // splice diye element delete kora hoi..
                    carts.splice(positionProduct,1);
                }
                break;
        }
    }
    addCartToMemory();
    addCartToHTML();
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'plus';
        if(positionClick.classList.contains('minus')) {
            type = 'minus';
        }
        //console.log(product_id);
        changeQuantity(product_id,type);
    } else if(positionClick.classList.contains('bad')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let positionProduct = carts.findIndex((value) => value.product_id == product_id);
        carts.splice(positionProduct,1);
        addCartToMemory();
        addCartToHTML();
    }
})

const addToCart = (id) => {
    // cart e product_id already ache kina ta check. thakle oitar index return korbe otherwise -1 return korbe.
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == id);
    if(carts.length <= 0) {
        carts = [{
            product_id: id,
            quantity: 1
        }]
    } else if(positionThisProductInCart < 0) {
        carts.push({
            product_id: id,
            quantity: 1
        });
    } else {
        carts[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
}

listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')) {
        alert("Product added to cart successfully.");
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }
})

const addCartToMemory = () => {
    localStorage.setItem('cart',JSON.stringify(carts));
}

const initApp = () => {
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        listProduct = data;
        addDataToHTML();

        //get cart from memory
        if(localStorage.getItem('cart')) {
            // convert json file to array file.
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}
initApp();