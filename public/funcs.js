async function getUser () {
    const user = await fetch ("http://localhost:3000/users/get-all")
    .then((result) => {
        return result.json()
    })
    .then ((users) => {
        const currentlyLoggedIn = users.filter(user => user.tokens.length > 0)
        if (currentlyLoggedIn.length === 1)
            return currentlyLoggedIn[0]
    })
    return user;
}

async function getAdmin () {
    const admin = await fetch ("http://localhost:3000/admins/get-all")
    .then((result) => {
        return result.json()
    })
    .then ((admins) => {
        const currentlyLoggedIn = admins.filter(admin => admin.tokens.length > 0)
        if (currentlyLoggedIn.length === 1) {
            return currentlyLoggedIn[0]
        }
    })
    return admin;
}

async function userLogin (data) {
    const user = await fetch ("http://localhost:3000/users/login", {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((result) => {        
        return result.json()
    })
    return user;
}

async function adminLogin (data) {
    const admin = await fetch ("http://localhost:3000/admins/login", {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((result) => {
        return result.json()
    })
    return admin;
}

function userLogout (user) {
    fetch ("http://localhost:3000/users/logout", {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${user.tokens[0].token}`
        }
    })
    .then((result) => {
        return result.json()
    })
    .then((response) => {
        if (response.message === "Not authenticated")
            throw new Error();
        location.reload();
    })
}

function adminLogout (admin) {
    fetch ("http://localhost:3000/admins/logout", {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${admin.tokens[0].token}`
        }
    })
    .then((result) => {
        return result.json()
    })
    .then((response) => {
        if (response.message === "Not authenticated")
            throw new Error();
        location.reload();
    })
}
// function userLogoutAll (user) {
//     fetch ("http://localhost:3000/users/logout-all", {
//         method: 'POST',
//         headers: {
//             "Authorization": `Bearer ${user.tokens[0].token}`
//         }
//     })
//     .then((result) => {
//         return result.json()
//     })
//     .then((response) => {
//         location.reload();
//     })
// }
function addNewBook (admin, data) {
    fetch ("http://localhost:3000/books/new", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${admin.tokens[0].token}`
        },
        body: JSON.stringify(data)
    })
    .then((result) => {
        return result.json()
    })
    .then((response) => {
        location.reload();
    })
}
function editBook (admin, bookID, data) {
    fetch (`http://localhost:3000/books/edit?id=${bookID}`, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${admin.tokens[0].token}`
        },
        body: JSON.stringify(data)
    })
    .then((result) => {         
        return result.json()
    })
    .then ((response) => {
        if (response.status === 400)
            throw new Error();
        location.reload();
    })
    .catch((err) => {
        console.log(err.message);
      });
}
function deleteBook (admin, bookID) {
    fetch (`http://localhost:3000/books/delete?id=${bookID}`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${admin.tokens[0].token}`
        }
    })
    .then((result) => {
        return result.json()
    })
    .then(() => {
        location.reload();
    })
}
function displayErrorMsg (location, message, isUp) {
    const p = document.createElement('p');
    if (isUp) {
        location.removeChild(location.childNodes[0]);
        location.prepend(p);
    }
    else {
        if (location.childNodes[location.childNodes.length - 1].innerHTML === "Already in cart!")
            location.removeChild(location.childNodes[location.childNodes.length - 1]);
        location.appendChild(p);
    }
    p.innerHTML = message;
    p.style.color = "#EE3125";
    p.style.fontWeight = "bold";
    p.style.fontSize = "1.2rem"
}
function isLegalPassword(password) {
    if (password.length < 8)
        return false;
    let uppercase = 0, lowercase = 0, digit = 0;
    for (let i = 0; i < password.length; i++) {
        if (password[i] >= 0 && password[i] <= 9) {
            digit++;
            continue;
        }
        if (password[i] === password[i].toUpperCase())
            uppercase++;
        if (password[i] === password[i].toLowerCase())
            lowercase++;
    }
    if (uppercase >= 1 && lowercase >= 1 && digit >= 1)
        return true;
    else
        return false;
}
function isSignupFormLegal (location, email, pass, passConfirmation) {
    if (pass !== passConfirmation) {
        displayErrorMsg(location, "Passwords doesn't match.", true);
        return false;
    }
    if (!isLegalPassword(pass)) {
        displayErrorMsg(location, "Password must contain at least 8 characters, 1 capital letter and 1 number.", true)
        return false;
    }
    const passRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!passRegex.test(email)) {
        displayErrorMsg(location, "Invalid email!", true)
        return false;
    }
    return true;
}
function getBook (bookID) {
    return fetch (`http://localhost:3000/books/get?id=${bookID}`)
    .then((result) => {
        return result.json()
    })
    .then ((res) => {
        return res;
    })
}
async function editCart (user, data) {
    await fetch ("http://localhost:3000/users/edit-cart", {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.tokens[0].token}`
        },
        body: JSON.stringify(data)
    })
    .then((result) => {
        return result.json()
    })
}

async function getCart (user) {
    const cart = await fetch (`http://localhost:3000/users/get-cart`, {
        headers: {
            "Authorization": `Bearer ${user.tokens[0].token}`
        },
    })
    .then((result) => {
        return result.json()
    })
    return cart;
}

async function refreshCart (user, cartModal) {
    let totalPrice = 0;
    cartModal.children[0].style.minWidth = "50%";
    const cartContent = document.getElementById('cart-content');
    const checkoutButton = document.getElementById('checkout-button');
    cartModal.children[0].children[1].style.margin = "29%";
    cartContent.textContent = "";
    if (user.booksAtCart.length > 0) {
        let cart = await getCart(user);
        
        for (let books in cart) {
            const infoDiv = document.createElement('div');
            const currentBook = cart[books];
            checkoutButton.classList.remove("none");
            
            totalPrice += currentBook.totalPrice;
            const img = document.createElement('img');
            const div = document.createElement('div');            
            const deleteFromCart = document.createElement('button')
            deleteFromCart.addEventListener('click', async (e) => {
                e.stopPropagation();
                let data = {
                    booksAtCart: []
                };
                if (user.booksAtCart.length > 0) {
                    data.booksAtCart = user.booksAtCart.filter(book => book.book !== currentBook.book._id)
                    totalPrice -= currentBook.totalPrice;
                    cartContent.lastChild.innerHTML = "Total Price: " + totalPrice;
                }
                await editCart(user, data)
                user = await getUser();
                div.remove();
                if (user.booksAtCart.length === 0) {
                    checkoutButton.classList.add("none");
                    cartContent.lastChild.remove();
                    cartModal.children[0].children[1].classList.remove("none");
                }
            })
            deleteFromCart.setAttribute("id", "delete-from-cart-button")
            deleteFromCart.innerHTML = "Delete"
            img.src = currentBook.book.imageURL;
            img.style.width = '100px';
            img.style.float = "left";
            cartContent.appendChild(div)
            div.style.borderTop = "3px #f11a7441 outset";
            div.style.borderBottom = "1px #46f5d8b9 inset";
            div.style.borderLeft = "2px #ffd6fd outset";
            div.style.padding = "2rem"
            div.style.borderRadius = "4em"
            div.style.margin = "1rem"
            div.appendChild(img);
            div.appendChild(infoDiv);
            div.appendChild(deleteFromCart);
            deleteFromCart.style.marginBottom = "1em";
            infoDiv.innerHTML = `<p> Name: ${currentBook.book.name} </p> <p> Quantity: ${currentBook.quantity} </p> <p> Price: ${currentBook.totalPrice} </p> <br> <br>`;                   
        }
        const p = document.createElement('p');
        cartContent.appendChild(p);
        p.style.paddingTop = "1rem";
        p.innerHTML = "Total Price: " + totalPrice;
    }
    else {
        cartModal.children[0].children[1].classList.remove("none");
    }
}
async function getBooks () {
    return await fetch (`http://localhost:3000/books/get-all`)
    .then((result) => {
        return result.json()
    })
    .then ((res) => {
        return res;
    })
}

function isBookAlreadyInsideCart (cart, bookID) {
    for (let book in cart) {
        if (cart[book].book === bookID)
            return true;
    }
    return false;
}


export {getUser, getAdmin, userLogin, adminLogin, userLogout, adminLogout, addNewBook, deleteBook, displayErrorMsg, isSignupFormLegal, editCart, editBook, refreshCart, isBookAlreadyInsideCart, getBooks};