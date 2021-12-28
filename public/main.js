const body = document.body;
const home = document.getElementById("home");
const login = document.getElementById("login");
const signUp = document.getElementById("sign-up");
const logOut = document.getElementById("logout");
const addBook = document.getElementById("add-book");
const editBookButton = document.getElementById('edit-button');
const deleteBookButton = document.getElementById('delete-book');
const addToCartButton = document.getElementById('add-to-cart');
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
const booksContainer = document.getElementById('books-container');
const cartButton = document.getElementById('cart');
const cartModal = document.getElementsByClassName('modal')[4];
const search = document.getElementById("search")
let selectedBook;
import {getUser, getAdmin, userLogin, adminLogin, userLogout, adminLogout, addNewBook, deleteBook, displayErrorMsg, isSignupFormLegal, editCart, editBook, refreshCart, isBookAlreadyInsideCart, getBooks} from "./funcs.js";

let loggedUser;

window.addEventListener('load', async () => {
    const user = await getUser(), admin = await getAdmin();
    body.style.overflowY = "auto";
    loggedUser = user || admin;
    if (user || admin) {
        loggedUser.isAdmin = user ? false : true;
        login.style.display = "none"
        signUp.style.display = "none"
        logOut.style.display = "flex"
        document.getElementById('welcome-message').innerHTML = "Welcome back " + loggedUser.firstName + "!";
        if (!loggedUser.isAdmin) {
            cart.style.display = "flex"
            addBook.classList.add("none")
            editBookButton.style.display = "none"
            deleteBookButton.style.display = "none"
        }
        else {
            addBook.classList.remove("none")
        }
    }
})

home.addEventListener('click', () => { // Returns to homepage
    window.location = "./index.html";
})

const displayModal = (element) => {
    element.style.display = "flex";   
    body.style.overflowY = "hidden"; 
    if (element === signUpModal) {
        document.getElementsByClassName('modal-content')[1].style.height = "77%";
        document.getElementsByClassName('close-modal')[1].style.marginTop = "10%";
    }
    if (element === loginModal) {
        document.getElementsByClassName('modal-content')[0].style.height = "50%";
    }
};

const closeModals = () => {
    body.style.overflowY = "auto";
    for (let i = 0; i < closeModal.length; i++) {
            closeModal[i].addEventListener('click', () => {
                loginModal.style.display = "none";
                signUpModal.style.display = "none";                
            });
        }    
        window.addEventListener('click', (event) => {
            if (event.target === loginModal || event.target === signUpModal || event.target === bookInfoModal || event.target === addBookModal || event.target === cartModal) {
                body.style.overflowY = "auto";
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
    if (loggedUser.isAdmin)
        adminLogout(loggedUser);
    else
        userLogout(loggedUser);
})
const displayBooks = async (books) => {
    if (!books)
        books = await getBooks();
    for (let book in books) {
        const booksModalContent = document.getElementById('books-modal-content');
        const img = document.createElement('img');
        img.src = books[book].imageURL;
        if (img.src.includes("http://127.0.0.1:5500/Projects/Bookstore-Project/public/"))
        img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png"
        img.setAttribute("id", `${books[book]._id}`)
        booksContainer.children[0].appendChild(img);
        img.addEventListener('click', (event) => {
            body.style.overflowY = "hidden";
            let alreadyInCart = document.getElementById("already-in-cart");
            if (alreadyInCart)
                 alreadyInCart.remove();
            if (loggedUser) {
                if (!loggedUser.isAdmin) {
                    addToCartButton.classList.remove("none");
                    document.getElementById("number-of-books-to-add").classList.remove("none");
                }
                editBookButton.classList.remove("none");
                deleteBookButton.classList.remove("none");    
            }            
            const bookDetails = document.getElementById('book-details')
            if (bookDetails)
                bookDetails.remove();                
            bookEditForm.classList.add("none")
            selectedBook = books[book];
            bookInfoModal.style.display = "flex";
            document.getElementsByClassName('modal-content')[2].style.width = "30%";
            const h2 = document.createElement('h2');
            booksModalContent.prepend(h2)
            h2.setAttribute("id", "book-details")
            h2.innerHTML = `<p> Name: ${books[book].name} </p> <p> Author: ${books[book].author} </p> <p> Genre: ${books[book].genre} </p> <p> Summary: ${books[book].summary} </p> <p> Price: ${books[book].price} </p>`;
        })
    }
}
displayBooks().then();
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        "email": loginForm.email.value,
        "password": loginForm.password.value
    }
    const user = await userLogin(data), admin = await adminLogin(data);
    if (user.status === 400 && admin.status === 400)
        displayErrorMsg(loginForm, "Your email and/or password were incorrect.", true)
    else
        location.reload();
});
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const isAdmin = signUpForm.isAdmin.value === "Yes" ? true : false;
    const route = isAdmin ? "admins" : "users";
    if (!isSignupFormLegal(signUpForm, signUpForm.email.value, signUpForm.password.value, signUpForm.passwordConfirmation.value))
        return;
    const data = {
        "firstName": signUpForm.fname.value,
        "lastName": signUpForm.lname.value,
        "email": signUpForm.email.value,
        "password": signUpForm.password.value
    }
    fetch (`http://localhost:3000/${route}/new`, {
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
        if (!response.status)
            location.reload();
        else {
            throw new Error();
        }
    })
    .catch(() => {
        displayErrorMsg(signUpForm, "One or more of your details are invalid.", true)
    });
});

editBookButton.addEventListener('click', () => {
    const bookDetails = document.getElementById('book-details')
    bookDetails.textContent = "";
    addToCartButton.classList.add("none");
    editBookButton.classList.add("none");
    deleteBookButton.classList.add("none");
    bookEditForm.classList.remove("none");
})
bookEditForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if ((!bookEditForm.imgURL.value.includes(".jpg", ".png")) && bookEditForm.imgURL.value !== "")
        bookEditForm.imgURL.value = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png"
    const data = {
        "imageURL": bookEditForm.imgURL.value,
        "name": bookEditForm.name.value,
        "author": bookEditForm.author.value,
        "genre": bookEditForm.genre.value,
        "summary": bookEditForm.summary.value,
        "price": parseInt(bookEditForm.price.value)
    }
    for (let i in data) {
        if (data[i] === "" || !data[i])
            delete data[i];
    }
    editBook(loggedUser, selectedBook._id, data);
})
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (addBookForm.newImgURL.value === "")
        addBookForm.newImgURL.value = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png"
    const data = {
        "imageURL": addBookForm.newImgURL.value,
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
addToCartButton.addEventListener('click', async (e) => {
    const data = {
        booksAtCart: []
    }
    const user = await getUser();
    try {
        if (!isBookAlreadyInsideCart(user.booksAtCart, selectedBook._id)) {
            const booksQuantity = parseInt(document.getElementById("number-of-books-to-add").value);
            data.booksAtCart.push({book: selectedBook._id, quantity: booksQuantity, totalPrice: selectedBook.price * booksQuantity})
            if (user.booksAtCart.length > 0)
                data.booksAtCart.push(...user.booksAtCart)
            await editCart(user, data)
            location.reload();
        }
        else
            throw new Error();
    } catch (err) {
        const bookDetails = document.getElementById('book-details');
        displayErrorMsg(bookDetails, "Already in cart!", false)
    }
})
cartButton.addEventListener('click', async (e) => {
    e.stopPropagation();
    cartModal.style.display = "flex";
    body.style.overflowY = "hidden";
    const user = await getUser();
    refreshCart(user, cartModal);
})
checkoutButton.addEventListener('click', async () => {
    const cartContent = document.getElementById('cart-content');
    cartContent.textContent = "";
    const h2 = document.createElement('h2');
    cartContent.prepend(h2);
    h2.innerHTML = "Purchase Successful!";
    h2.style.color = "green";
    document.getElementById('checkout-button').classList.add("none");
    const user = await getUser();
    const data = {
        booksAtCart: []
    };
    editCart(user, data);
})
search.addEventListener('submit', async (e) => {
    e.preventDefault();
    const clearBooks = () => {
        booksContainer.children[0].textContent = "";
    }
    if (booksContainer.contains(document.getElementById("no-results-found")))
        document.getElementById("no-results-found").remove();
    if (search.search.value.length > 0) {
        let books = await getBooks();        
        clearBooks();
        books = books.filter(value => value.name.toLowerCase().includes(search.search.value.toLowerCase()))
        if (books.length === 0) {
            const h1 = document.createElement('h1');
            booksContainer.appendChild(h1);
            h1.setAttribute('id', 'no-results-found')
            h1.innerHTML = "No results found.";
            h1.style.color = "red";
        }
        displayBooks(books)
    }
    else {
        clearBooks();
        displayBooks();
    }
})