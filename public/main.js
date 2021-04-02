const home = document.getElementById("home");
const login = document.getElementById("login");
const signUp = document.getElementById("sign-up");
const logOut = document.getElementById("logout");
const addBook = document.getElementById("add-book");
const editBookButton = document.getElementById('edit-button');
const deleteBookButton = document.getElementById('delete-book');
const editCartButton = document.getElementById('add-to-cart');
const applyChanges = document.getElementById('apply-changes');
const checkoutButton = document.getElementById('checkout-button');
const loginForm = document.getElementById("login-form");
const signUpForm = document.getElementById("sign-up-form");
const bookEditForm = document.getElementById("book-edit-form");
const addBookForm = document.getElementById("add-book-form");
const loginModal = document.getElementsByClassName('modal')[0];
const signUpModal = document.getElementsByClassName('modal')[1];
const bookInfoModal = document.getElementsByClassName('modal')[2];
const addBookModal = document.getElementsByClassName('modal')[3];
const closeModal = document.getElementsByClassName('close-modal');
const booksContainer = document.getElementById('books');
const cartButton = document.getElementById('cart');
const cartModal = document.getElementsByClassName('modal')[4];
let selectedBook;
import {getUser, userLogOut, userLogOutAll, addNewBook, deleteBook, doesPassMatches, displayErrorMsg, isSignupFormLegal, editCart, editBook, getBook, refreshCart} from "../modules/funcs.js";

let loggedUser;

window.addEventListener('load', () => {
    getUser().then ((res) => {
        if (res) {
            loggedUser = res;
            login.style.display = "none"
            signUp.style.display = "none"
            logOut.style.display = "flex"
            cart.style.display = "flex"
            document.getElementById('welcome-message').innerHTML = "Welcome back " + loggedUser.firstName + "!";
            if (!loggedUser.isAdmin) {
                addBook.classList.add("none")
                editBookButton.style.display = "none"
                deleteBookButton.style.display = "none"
            }
            else {
                addBook.classList.remove("none")
            }
        }
        else {
            addBook.classList.add("none")
            editBookButton.style.display = "none"
            editCartButton.style.display = "none"
            deleteBookButton.style.display = "none"
        }
    })
})

// window.addEventListener('beforeunload', (e) => {
//     e.preventDefault();
//     userLogOutAll(loggedUser);
// })

// const turnLoggedInMode = () => {
//     getUser().then((user) => {
//         if (user) {
//             login.style.display = "none"
//             signUp.style.display = "none"
//             logOut.style.display = "flex"
//             cart.style.display = "flex"
//             document.getElementById('welcome-message').innerHTML = "Welcome back " + user[0].firstName + "!";
//         }
//     })
// }
home.addEventListener('click', () => { // Returns to homepage
    window.location = "./index.html";
})

const displayModal = (element) => {
    element.style.display = "flex";
    if (element === signUpModal) {
        document.getElementsByClassName('modal-content')[1].style.height = "77%";
        document.getElementsByClassName('close-modal')[1].style.marginTop = "10%";
    }
    if (element === loginModal) {
        document.getElementsByClassName('modal-content')[0].style.height = "50%";
    }
};

const closeModals = () => {
    for (let i = 0; i < closeModal.length; i++) {
            closeModal[i].addEventListener('click', () => {
                loginModal.style.display = "none";
                signUpModal.style.display = "none";                
            });
        }    
        window.addEventListener('click', (event) => {
            if (event.target === loginModal || event.target === signUpModal || event.target === bookInfoModal || event.target === addBookModal || event.target === cartModal) {
                loginModal.style.display = "none";
                signUpModal.style.display = "none";
                bookInfoModal.style.display = "none";
                addBookModal.style.display = "none";
                cartModal.style.display = "none";
            }
        });
}
login.addEventListener('click', () => {
    displayModal(loginModal);
})
signUp.addEventListener('click', () => {
    displayModal(signUpModal)
})
addBook.addEventListener('click', () => {
    displayModal(addBookModal)
})
closeModals();

logOut.addEventListener('click', () => {
    logOut.style.display = "none"
    cart.style.display = "none"
    login.style.display = "flex"
    signUp.style.display = "flex"
    userLogOut(loggedUser);
})
const displayBooks = async (req, res) => {
    const response = await fetch("http://localhost:3000/books/get-all")
    const books = await response.json();
    return books;
    // console.log(response.json());
    // .then((result) => {
    //     return result.json()
    // })
    // .then ((booksAtCart) => {
    //     getBook(event.target.id).then((book) => {
    //         selectedBook = {...book};
    //         console.log(selectedBook);
    //     })
    // })
    // .then ((books) => {
    //     for (let book in books) {
    //         const booksModalContent = document.getElementById('books-modal-content');
    //         const img = document.createElement('img');
    //         img.src = books[book].imageURL;
    //         if (img.src.includes("http://127.0.0.1:5500/Projects/Bookstore-Project/public/"))
    //             img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png"
    //         img.setAttribute("id", `${books[book]._id}`)
    //         booksContainer.appendChild(img);
    //         img.addEventListener('click', (event) => {
    //             // debugger
    //             // bookEditForm.style.display = "none";
    //             editCartButton.classList.remove("none");
    //             editBookButton.classList.remove("none");
    //             deleteBookButton.classList.remove("none");
    //             const bookDetails = document.getElementById('book-details')
    //             if (bookDetails) {
    //                 bookDetails.remove();
    //             }
    //             bookEditForm.classList.add("none")
    //             // getBook(event.target.id).then((book) => {
    //             //     selectedBook = {...book};
    //             //     console.log(selectedBook);
    //             // })
    //             // selectedBook = event.target.id;
    //             console.log(selectedBook);
    //             bookInfoModal.style.display = "flex";
    //             document.getElementsByClassName('modal-content')[2].style.width = "30%";
    //             // while (booksModalContent.children.length > 3) {
    //             //     // console.log(booksModalContent.firstChild.nodeName);
    //             //     if (booksModalContent.firstChild.nodeName !== 'BUTTON')
    //             //         booksModalContent.removeChild(booksModalContent.firstChild);
    //             // }
    //             const h2 = document.createElement('h2');
    //             booksModalContent.prepend(h2)
    //             h2.setAttribute("id", "book-details")
    //             h2.innerHTML = `<p> Name: ${books[book].name} </p> <p> Author: ${books[book].author} </p> <p> Genre: ${books[book].genre} </p> <p> Summary: ${books[book].summary} </p> <p> Price: ${books[book].price} </p>`;
    //         })
    //     }        
    // }).catch((error) => {
    //     // alert(error)
    // })
}
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
        const data = {
            "email": loginForm.email.value,
            "password": loginForm.password.value
        }
        fetch ("http://localhost:3000/users/login", {
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
        .then ((res) => {
            // console.log(res.status);
            if (res.status == undefined)
                location.reload();
            else {
                throw new Error ('Your username and/or password were incorrect.');
            }
        })
        .catch((err) => {
            displayErrorMsg(loginForm, "Your email and/or password were incorrect.")
        });
});
signUpForm.addEventListener('submit', (e) => {
    // debugger
    e.preventDefault();
    // console.log(signUpForm.passwordConfirmation.value);
    if (!isSignupFormLegal(signUpForm, signUpForm.email.value, signUpForm.password.value, signUpForm.passwordConfirmation.value))
        return;
    // if (!doesPassMatches(signUpForm.password.value, signUpForm.passwordConfirmation.value)) {
    //     return displayErrorMsg(signUpForm, "Passwords doesn't match");
    // }
    const data = {
        "firstName": signUpForm.fname.value,
        "lastName": signUpForm.lname.value,
        "email": signUpForm.email.value,
        "password": signUpForm.password.value,
        "isAdmin": signUpForm.isAdmin.value === "Yes" ? true : false,
    }
    fetch ("http://localhost:3000/users/new", {
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
    .then ((response) => {
        console.log(response.status);
        if (!response.status)
            location.reload();
        else {
            throw new Error();
        }
    })
    .catch((err) => {
        displayErrorMsg(signUpForm, "One or more of your details are invalid.")
      });
});



// displayModals();
displayBooks().then ((books) => {
    for (let book in books) {
        // debugger
        const booksModalContent = document.getElementById('books-modal-content');
        const img = document.createElement('img');
        img.src = books[book].imageURL;
        if (img.src.includes("http://127.0.0.1:5500/Projects/Bookstore-Project/public/"))
        img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png"
        img.setAttribute("id", `${books[book]._id}`)
        booksContainer.appendChild(img);
        img.addEventListener('click', (event) => {
            let alreadyInCart = document.getElementById("already-in-cart");
            if (alreadyInCart)
                 alreadyInCart.remove();
            // debugger
            // bookEditForm.style.display = "none";
            editCartButton.classList.remove("none");
            editBookButton.classList.remove("none");
            deleteBookButton.classList.remove("none");
            const bookDetails = document.getElementById('book-details')
            if (bookDetails) {
                bookDetails.remove();
            }
            bookEditForm.classList.add("none")
            // getBook(event.target.id).then((book) => {
            //     selectedBook = {...book};
            //     console.log(selectedBook);
            // })
            selectedBook = books.filter(book => book.imageURL === event.target.src)[0];
            bookInfoModal.style.display = "flex";
            document.getElementsByClassName('modal-content')[2].style.width = "30%";
            // while (booksModalContent.children.length > 3) {
            //     // console.log(booksModalContent.firstChild.nodeName);
            //     if (booksModalContent.firstChild.nodeName !== 'BUTTON')
            //         booksModalContent.removeChild(booksModalContent.firstChild);
            // }
            const h2 = document.createElement('h2');
            booksModalContent.prepend(h2)
            h2.setAttribute("id", "book-details")
            h2.innerHTML = `<p> Name: ${books[book].name} </p> <p> Author: ${books[book].author} </p> <p> Genre: ${books[book].genre} </p> <p> Summary: ${books[book].summary} </p> <p> Price: ${books[book].price} </p>`;
        })
    }
});

editBookButton.addEventListener('click', () => {
    const bookDetails = document.getElementById('book-details')
    bookDetails.textContent = "";
    editCartButton.classList.add("none");
    editBookButton.classList.add("none");
    deleteBookButton.classList.add("none");
    bookEditForm.classList.remove("none");
})
bookEditForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        "imageURL": bookEditForm.imgURL.value,
        "name": bookEditForm.name.value,
        "author": bookEditForm.author.value,
        "genre": bookEditForm.genre.value,
        "summary": bookEditForm.summary.value,
        "price": parseInt(bookEditForm.price.value)
    }
    for (let i in data) {
        if (data[i] === "")
            delete data[i];
    }
    editBook(loggedUser, selectedBook._id, data);
})
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (addBookForm.newImgURL.value = "")
        addBookForm.newImgURL.value = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png"
    const data = {
        "imageURL": addBookForm.newImgURL.value === "" ? "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png" : addBookForm.newImgURL.value,
        "name": addBookForm.newName.value,
        "author": addBookForm.newAuthor.value,
        "genre": addBookForm.newGenre.value,
        "summary": addBookForm.newSummary.value,
        "price": parseInt(addBookForm.newPrice.value)
    }
    addNewBook(loggedUser, data);
})

deleteBookButton.addEventListener('click', (e) => {
    deleteBook(loggedUser, selectedBook._id);
})
editCartButton.addEventListener('click', async (e) => {
    const data = {
        booksAtCart: []
    }
    const user = await getUser();
    try {
        data.booksAtCart.push({bookID: selectedBook._id})
        for (let book in user.booksAtCart) {
            if (user.booksAtCart[book].bookID === selectedBook._id)
                throw new Error();
            data.booksAtCart.push({bookID: user.booksAtCart[book].bookID})
        }
        await editCart(loggedUser, selectedBook, data)
        location.reload();
    } catch (err) {
        const booksModalContent = document.getElementById('books-modal-content');
        const p = document.createElement('p');
        booksModalContent.appendChild(p);
        p.setAttribute("id", "already-in-cart")
        p.innerHTML = "Already in your cart!";
        p.style.color = "#EE3125";
        p.style.fontWeight = "bold";
        p.style.fontSize = "1.2rem";
    }
})
cartButton.addEventListener('click', async (e) => {
    // let totalPrice = 0;
    // cartModal.style.display = "flex";
    // // cartModal.children[0].style.width = "50%";
    // cartModal.children[0].style.minWidth = "50%";
    // const cartContent = document.getElementById('cart-content');
    // cartContent.textContent = "";
    // // cartContent.textContent = ""
    e.stopPropagation();
    // console.log(cartModal.children[0]);
    const user = await getUser();
    refreshCart(user, cartModal);
    // // console.log(user.booksAtCart);
    // if (user.booksAtCart.length > 0) {
    //     for (let book in user.booksAtCart) {
    //         // console.log(user.booksAtCart[book].bookID);
    //         // debugger
    //         const currentBook = await getBook(user.booksAtCart[book].bookID)
    //         totalPrice += currentBook.price;
    //         const img = document.createElement('img');
    //         const div = document.createElement('div');
    //         const infoDiv = document.createElement('div');
    //         const deleteFromCart = document.createElement('button')
    //         // deleteFromCart.addEventListener('click', () => {
                
    //         // })
    //         deleteFromCart.setAttribute("id", "delete-from-cart-button")
    //         deleteFromCart.innerHTML = "Delete"
    //         img.src = currentBook.imageURL;
    //         img.style.width = '100px';
    //         // img.style.height = '162px';
    //         img.style.float = "left";
    //         cartContent.appendChild(div)
    //         // div.style.border = "1px azure solid"
    //         div.style.borderTop = "3px #f11a7441 outset";
    //         div.style.borderBottom = "1px #46f5d8b9 inset";
    //         div.style.borderLeft = "2px #ffd6fd outset";
    //         div.style.padding = "2rem"
    //         div.style.borderRadius = "4em"
    //         // div.style.boxShadow = "12px 12px rgba(108, 70, 143, 0.15)";
    //         div.style.margin = "1rem"
    //         div.appendChild(img);
    //         div.appendChild(infoDiv);
    //         div.appendChild(deleteFromCart);
    //         deleteFromCart.style.marginBottom = "1em"
    //         // infoDiv.style.float = "right"
    //         infoDiv.innerHTML = `<p> Name: ${currentBook.name} </p> <p> Price: ${currentBook.price} </p> <br> <br>`;
    //         // cartContent.innerHTML = `<p> Name: ${currentBook.name} </p> <p> Author: ${currentBook.author} </p> <p> Genre: ${currentBook.genre} </p> <p> Summary: ${currentBook.summary} </p> <p> Price: ${currentBook.price} </p>`;
    //     }
    //     const p = document.createElement('p');
    //     cartContent.appendChild(p);
    //     p.style.paddingTop = "1rem";
    //     p.innerHTML = "Total Price: " + totalPrice;

    // }
    // getUser().then((res) => {
        // const bookID = res[0].bookAtCart[0];
        // console.log(res[0].booksAtCart);
        // getBook(res.)
    // })
})
checkoutButton.addEventListener('click', () => {
    const cartContent = document.getElementById('cart-content');
    cartContent.textContent = "";
    const h2 = document.createElement('h2');
    cartContent.prepend(h2);
    h2.innerHTML = "Purchase Successful!";
    h2.style.color = "green"
    document.getElementById('checkout-button').classList.add("none")
    // cartModal.style.display = "none";
})