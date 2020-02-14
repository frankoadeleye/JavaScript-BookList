class Book {
    constructor(title, author, isbn) {
      this.title = title;
      this.author = author;
      this.isbn = isbn;
    }
  }
  
  class UI {
    addBookToList(book) {
      const list = document.getElementById('book-list');//we want to grab the  <tbody id="book-list"></tbody> in the html and append something to it...
      // Create tr element
      const row = document.createElement('tr');//Now we create the row we want to append which is a <tr></tr> that will have <td></td>s
  
  
      // Insert the <td></td>s
      row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X<a></td>
      `;
    
      list.appendChild(row);
    }
  
    showAlert(message, className) {
      // Create div
      const div = document.createElement('div');
      // Add classes
      div.className = `alert ${className}`;//so we added two classes, one is 'alert' from the css framework, and the other is the one we created in the style in the head of our html file, which is error.
      // Add text
      div.appendChild(document.createTextNode(message));//the createTextNode method helps you create a textnode which can be just html text and we have set the parameter as message, which is the 'Please fill in all fields' we wrote several lines below when calling this showAlert function.
      // Get parent
      const container = document.querySelector('.container');//The parent of everything in the html body
      // Get form
      const form = document.querySelector('#book-form');//This is the id of the form in the container.
      // Insert alert
      container.insertBefore(div, form);//the insertBefore() method has two parameters, first what you wanna insert and secondly what you want it to come before, which is your form...so it will be placed before your form...
  
      // Timeout after 3 sec
      setTimeout(function(){
        document.querySelector('.alert').remove();
      }, 3000);
    }
  
    deleteBook(target) {
      if(target.className === 'delete') {//that is we want to target the a-href link in the  '<td><a href="#" class="delete">X</a></td>' as created above because it has a class of delete, 
        target.parentElement.parentElement.remove();//and then we want to remove the class parent of the parent of the a-href link, which is the the tr as we have created above in line 17...
      }
    }
  
    clearFields() {
      document.getElementById('title').value = '';
      document.getElementById('author').value = '';
      document.getElementById('isbn').value = '';
    }
  }
  
  // Local Storage Class
  class Store {
    static getBooks() { //TO EXPLAIN THE STATIC KEYWORD: The getBooks() method would not be able to use this._name to get to the _name field of an Store object, as the this pointer inside of getBooks will never reference an Store object.
      let books;
      if(localStorage.getItem('books') === null) {//meaning that if there's no book in the local storage
      books = []; //then create an empty array
        books = [];
      } else {
        books = JSON.parse(localStorage.getItem('books'));// so we get the books that exit. Note that we wrapped it in the JSON.parse because we need it to be a javascript object. 
      }
  
      return books;
    }
  
    // After the book gets added to local storage, now we want to display it in the UI
  
    static displayBooks() {
      const books = Store.getBooks();
  
      books.forEach(function(book){
        const ui  = new UI;
  
        // Add book to UI
        ui.addBookToList(book);
      });
    }
  
    static addBook(book) {
      const books = Store.getBooks();
  
      books.push(book);
  
      localStorage.setItem('books', JSON.stringify(books)); //This means we set the item as 'books' and then we save it in the books array which we must wrap in the JSON.stringify() method. The 'JSON.stringify()' method converts a JavaScript object or value to a JSON string
    }
  
    static removeBook(isbn) {
      const books = Store.getBooks();
  
      books.forEach(function(book, index){
       if(book.isbn === isbn) {
        books.splice(index, 1);
       }
      });
  
      localStorage.setItem('books', JSON.stringify(books));
    }
  }
  
  // DOM Load Event
  document.addEventListener('DOMContentLoaded', Store.displayBooks);
  
  // Event Listener for add book
  document.getElementById('book-form').addEventListener('submit', function(e){
    // Get form values
    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value
  
    // Instantiate book
    const book = new Book(title, author, isbn);//this means that we are creating an object from the 'Book' constructor function above, and then we are saying that since the Book function has three parameters, we are saying that the replacement for the three parameters (title, author, isbn) should be the const variables we defined above which are values of the inputs we got by their ids.
  
    // Instantiate UI
    const ui = new UI();
  
    console.log(ui);
  
    // Validate
    if(title === '' || author === '' || isbn === '') {
      // Error alert
      ui.showAlert('Please fill in all fields', 'error');
  
      //disable submit button when alert pops up after first click [All done purely out of my thinking skill and innovations]
      document.querySelector('.submit-btn').disabled = true;
  
       // Now enable it after the alert pop up is gone which happens in 3secs as we have set it to be above.[All done purely out of my innovation]
       setTimeout(function(){
        document.querySelector('.submit-btn').disabled = false;
      }, 3000);
  
    } else {
      // Add book to list
      ui.addBookToList(book);
  
      // Add to LS
      Store.addBook(book);
  
      // Show success
      ui.showAlert('Book Added!', 'success');
    
      // Clear fields
      ui.clearFields();
    }
  
    e.preventDefault();
  });
  
  // Event Listener for delete
  document.getElementById('book-list').addEventListener('click', function(e){
  
    // Instantiate UI
    const ui = new UI();
  
    // Delete book
    ui.deleteBook(e.target);
  
    // Remove from LS
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  
    // Show message
    ui.showAlert('Book Removed!', 'success');
  
    e.preventDefault();
  });