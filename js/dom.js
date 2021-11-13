const UNCOMPLETED_LIST_BOOK_ID = "incompleteBookshelfList"; //belum selesai
const COMPLETED_LIST_BOOK_ID = "completeBookshelfList"; //telah selesai
const BOOK_ITEMID = "bookId"; //data disimpan JSON

function addBook() {
    // Cek buku apakah selesai dibaca
    let checkBook = document.getElementById("inputBookIsComplete").checked;

    let statusBook;
    let stat;

    // Cek status Checkbox
    if (checkBook) {
        statusBook = document.getElementById(COMPLETED_LIST_BOOK_ID);
        stat = true;
    } else {
        statusBook = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
        stat = false;
    }


    // Mengambil Inputan 
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    console.log(`title book ${title}`);
    console.log(`author book ${author}`);
    console.log(`year book ${year}`);

    const book = makeBook(title, author, year, stat);
    const bookObject = composeBookObject(title, author, year, stat);

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    statusBook.append(book);
    updateDataToStorage();
}

function makeBook(title, author, year, isCompleted) {
    // Title Book
    const textTitle = document.createElement('h2');
    textTitle.innerText = title;
    // Author Name
    const textAuthor = document.createElement('p');
    textAuthor.classList.add("author");
    textAuthor.innerText = author;
    // Year of Book
    const textYear = document.createElement('p');
    textYear.classList.add("year");
    textYear.innerText = year;


    const containerBtn = document.createElement("div");
    containerBtn.classList.add("action");

    if (isCompleted) {
        containerBtn.append(
            createUndoButton(),
            createTrashButton()
        );
    } else {
        containerBtn.append(
            createCheckButton(),
            createTrashButton()
        );
    }
    const bookContainer = document.createElement('div');
    bookContainer.classList.add('book_item');
    bookContainer.append(textTitle, textAuthor, textYear, containerBtn);

    return bookContainer;
}

function createButton(buttonTypeClass, valueBtn, eventListener) {
    const button = document.createElement('button');
    button.innerText = valueBtn;
    button.classList.add(buttonTypeClass);
    button.addEventListener('click', function (event) {
        eventListener(event);
    });

    return button;
}

function addReadToCompleted(taskElement) {
    const readCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    const title = taskElement.querySelector(".book_item > h2").innerText;
    const author = taskElement.querySelector(".author").innerText;
    const year = taskElement.querySelector(".year").innerText;

    const newBook = makeBook(title, author, year, true);
    const book = findBook(taskElement[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;


    readCompleted.append(newBook);
    taskElement.remove();

    updateDataToStorage();
}

function createCheckButton() {
    return createButton("green", "Selesai dibaca", function (event) {
        addReadToCompleted(event.target.parentElement.parentElement);
    });
}

function removeBookFromCompleted(taskElement) {
    const bookPosition = findBookIndex(taskElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    taskElement.remove();
    updateDataToStorage();
}

function createTrashButton() {
    return createButton("red", "Hapus buku", function (event) {
        removeBookFromCompleted(event.target.parentElement.parentElement);
    })
}

function undoBookFromCompleted(taskElement) {
    const bookUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const title = taskElement.querySelector(".book_item > h2").innerText;
    const author = taskElement.querySelector("p.author").innerText;
    const year = taskElement.querySelector("p.year").innerText;

    const newBook = makeBook(title, author, year, false);

    const book = findBook(taskElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;

    bookUncompleted.append(newBook);
    taskElement.remove();

    updateDataToStorage();
}

function createUndoButton() {
    return createButton("green", "Belum Selesai dibaca", function (event) {
        undoBookFromCompleted(event.target.parentElement.parentElement);
    })
}

function refreshDataFromBook() {
    const bookUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    let bookCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);

    for (book of books) {
        const newBook = makeBook(book.title, book.author, book.year, book.isCompleted);
        newBook[BOOK_ITEMID] = book.id;
        if (book.isCompleted) {
            bookCompleted.append(newBook);
        } else {
            bookUncompleted.append(newBook);
        }
    }
}


function searchTitle(input) {
    const listBook = document.querySelectorAll('.book_item');
    let i = 0;
    for (book of listBook) {
        // Cek Input kosong atau tidak
        if (input != "") {
            // Mencari data buku
            let list = listBook[i].childNodes[0].innerText;
            if (list != input) {
                listBook[i].setAttribute("hidden", "hidden");
            }
        }
        else {
            listBook[i].removeAttribute("hidden");
        }
        i++;
    }
}
