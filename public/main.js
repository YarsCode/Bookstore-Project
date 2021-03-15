const home = document.getElementById("home");
const login = document.getElementById("login");
const signUp = document.getElementById("sign-up");
const loginModal = document.getElementsByClassName('modal')[0];
const signUpModal = document.getElementsByClassName('modal')[1];
const closeModal = document.getElementById('close-modal');

home.addEventListener('click', () => { // Returns to homepage
    location.href = "http://127.0.0.1:5500/Projects/Bookstore-Project/public/index.html";
})

const modals = () => {
    login.addEventListener('click', () => {
        loginModal.style.display = "flex";
    });
    signUp.addEventListener('click', () => {
        signUpModal.style.display = "flex";
        document.getElementsByClassName('modal-content')[1].style.height = "70%";
        document.getElementsByClassName('close-modal')[1].style.marginTop = "20%";
    });
    closeModal.addEventListener('click', () => {
        loginModal.style.display = "none";
    });
    window.addEventListener('click', (event) => {
        if (event.target === loginModal || event.target === signUpModal) {
            loginModal.style.display = "none";
            signUpModal.style.display = "none";
        }
    });
};
modals();























// home.addEventListener('click', () => {
//     fetch("http://localhost:3000/users/get?id=60479c378c0cf810bfdb4e83")
//     .then((result) => {
//         if (result.ok) {
//             // console.log(result.firstName);
//             return result.json()
//         }
//         else
//             throw new Error()
//     })
//     .then ((name) => {
//         console.log(name);
//     })
// })

