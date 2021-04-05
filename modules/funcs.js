function getUser () {
    return fetch ("http://localhost:3000/users/get-all")
    .then((result) => {
        return result.json()
    })
    .then ((users) => {
        const currentlyLoggedIn = users.filter(user => user.tokens.length > 0)
        if (currentlyLoggedIn.length === 1) {
            // const loggedUser = currentlyLoggedIn[0];
            return currentlyLoggedIn[0]
        }
    })
}

function editUser (user, data) {
    fetch (`http://localhost:3000/users/edit`, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.tokens[0].token}`
        },
        body: JSON.stringify(data)
    })
    .then((result) => {         
        return result.json()
    })
    .then ((response) => {
        // location.reload();
    })
    .catch((err) => {
        // console.log(err.status);
      });
}
function userLogOut (user) {
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
function userLogOutAll (user) {
    fetch ("http://localhost:3000/users/logout-all", {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${user.tokens[0].token}`
        }
    })
    .then((result) => {
        return result.json()
    })
    .then((response) => {
        location.reload();
    })
}
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
function editBook (user, bookID, data) {
    fetch (`http://localhost:3000/books/edit?id=${bookID}`, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.tokens[0].token}`
        },
        body: JSON.stringify(data)
    })
    .then((result) => {         
        return result.json()
    })
    .then ((response) => {
        location.reload();
    })
    .catch((err) => {
        // console.log(err.status);
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
    .then((response) => {
        location.reload();
    })
}
function doesPassMatches (pass, passConfirmation) {
    return pass === passConfirmation;
}
function displayErrorMsg (location, message) {
    location.removeChild(location.childNodes[0]);
    const p = document.createElement('p');
    location.prepend(p);
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
        displayErrorMsg(location, "Passwords doesn't match.");
        return false;
    }
    if (!isLegalPassword(pass)) {
        displayErrorMsg(location, "Password must contain at least 8 characters, 1 capital letter and 1 number.")
        return false;
    }
    const passRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!passRegex.test(email)) {
        displayErrorMsg(location, "Invalid email!")
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
    // debugger
    // return getBook(book._id).then((res) => {
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
    // });    
}
async function refreshCart (user, cartModal) {
    let totalPrice = 0;
    cartModal.style.display = "flex";
    cartModal.children[0].style.minWidth = "50%";
    const cartContent = document.getElementById('cart-content');
    const checkoutButton = document.getElementById('checkout-button');
    cartModal.children[0].children[1].style.margin = "29%";
    cartContent.textContent = "";
    if (user.booksAtCart.length > 0) {
        for (let book in user.booksAtCart) {
            // console.log(user.booksAtCart[book].bookID);
            // debugger
            // user = await getUser();
            checkoutButton.classList.remove("none");
            const currentBook = await getBook(user.booksAtCart[book].bookID)
            totalPrice += currentBook.price;
            const img = document.createElement('img');
            const div = document.createElement('div');
            const infoDiv = document.createElement('div');
            const deleteFromCart = document.createElement('button')
            deleteFromCart.addEventListener('click', async (e) => {
                e.stopPropagation();
                // user = await getUser();
                // debugger
                const data = {
                    booksAtCart: []
                };
                if (user.booksAtCart.length > 0) {
                    for (let book2 in user.booksAtCart) {
                        if (user.booksAtCart[book2].bookID !== currentBook._id) {
                            data.booksAtCart.push({bookID: user.booksAtCart[book2].bookID})
                        }
                    }
                    totalPrice -= currentBook.price;
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
            img.src = currentBook.imageURL;
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
            deleteFromCart.style.marginBottom = "1em"
            infoDiv.innerHTML = `<p> Name: ${currentBook.name} </p> <p> Price: ${currentBook.price} </p> <br> <br>`;            
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


export {getUser, userLogOut, userLogOutAll, addNewBook, deleteBook, doesPassMatches, displayErrorMsg, isSignupFormLegal, editCart, editBook, getBook, refreshCart, getBooks};