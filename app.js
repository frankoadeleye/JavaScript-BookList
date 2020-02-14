// Book Constructor (1.)
function Book(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

// UI Constructor(1.1)
function UI(){ //we just created a constructor function here so we can append objects to it to demonstrate how to use the prototype method... so we don't need to add anything inside this function, we just need to define it so we can append things to it.

}

// Add Book To List(2.5)
UI.prototype.addBookToList = function(book){
    const list = document.getElementById('book-list'); //we want to grab the  <tbody id="book-list"></tbody> in the html and append something to it...
    // Create tr element(2.6)
    const row = document.createElement('tr'); //Now we create the row we want to append which is a <tr></tr> that will have <td></td>s


    // Insert the <td></td>s
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
    `;

    list.appendChild(row);
}

// show alert(2.9)
UI.prototype.showAlert = function(message, className){
    // Create div
    const div = document.createElement('div');
    // Add classes
    div.className = `alert ${className}`; //sp we added two classes, one is 'alert' from the css framework, and the other is the one we created in the style in the head of our html file, which is error.
    // Add text
    div.appendChild(document.createTextNode(message)); //the createTextNode method helps you create a textnode which can be just html text and we have set the parameter as message, which is the 'Please fill in all fields' we wrote several lines below when calling this showAlert function.
    // Get parent
    const container = document.querySelector('.container'); //The parent of everything in the html body
    const form = document.querySelector('#book-form'); //This is the id of the form in the container.
    // insert alert
    container.insertBefore(div, form); //the insertBefore() method has two parameters, first what you wanna insert and secondly what you want it to come before, which is your form...so it will be placed before your form...

    //timeout after 3sec
    setTimeout(function(){
        document.querySelector('.alert').remove();
    }, 3000);

}

// Delete book(3.0)
UI.prototype.deleteBook = function(target){ //this target parameter is same as writing e.target. as we have done below...
    if(target.className === 'delete'){ //that is we want to target the a-href link in the  '<td><a href="#" class="delete">X</a></td>' as created above because it has a class of delete, 
        target.parentElement.parentElement.remove(); //and then we want to remove the class parent of the parent of the a-href link, which is the the tr as we have created above in line 17...

    }
}

// clear fields(2.8) after you click the submit button
UI.prototype.clearFields = function(){
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
}

// Add book Event Listeners(2.0)
document.getElementById('book-form').addEventListener('submit', function(e){
    // Get form values(2.1)
   const title = document.getElementById('title').value,
         author = document.getElementById('author').value,
         isbn = document.getElementById('isbn').value;
         
        //  Instantiate book(2.2)
    const book = new Book(title, author, isbn); //this means that we are creating an object from the 'Book' constructor function above, and then we are saying that since the Book function has three parameters, we are saying that the replacement for the three parameters (title, author, isbn) should be the const variables we defined above which are values of the inputs we got by their ids.

    // Instantiate UI(2.3)
    const ui = new UI();

    // validate ui (2.4)
    if(title === '' || author === '' || isbn === ''){
        // Error alert
        ui.showAlert('Please fill in all fields', 'error');

        //disable submit button which alert pops up after first click [All done purely out of my thinking skill and innovations]
        document.querySelector('.submit-btn').disabled = true;

        // Now enable it after the alert pop up is gone which happens in 3secs as we have set it to be above.[All done purely out of my innovation]
        setTimeout(function(){
            document.querySelector('.submit-btn').disabled = false;
        }, 3000);
       

    }else{
         //Add book to list
    ui.addBookToList(book);

    // Show success, if book is successfully added
    ui.showAlert('Book Added', 'success');

    // Clear fields
    ui.clearFields();

    }


    // (2.0)
    e.preventDefault();
})

// Event listener for delete(2.9)
document.getElementById('book-list').addEventListener('click', function(e){ //so we have to place the listener on the book-list which is in the page when the page loads, else it will not work if we place it on the a-href link itself because the link was generated using javascript...this methosd is called EVENT DELEGATION, meaning using the parent to go down to the child

    // instantiate the ui, meaning create an object from the empty UI() function above.
    const ui = new UI();

    //here we make the delete book a method of the UI() object that is created
    ui.deleteBook(e.target);//now the event.target refers to the book-list div in the html on which we placed the eventListener


    //now the event.target refers to the book-list div in the html on which we placed the eventListener
    if(e.target.className !== 'delete'){ //Now this is purely out of my thinking: This if statement helps to make sure that this 'ui.showAlert('Book Removed', 'success')' is not shown when we click on anywhere in the tr, only when we click on the actual a-href link which has the X, which is remove. So this means that if we don't rap this function in this if statement and we click anywhere in the booklist after we have created one(that is, one book), it will fire this ui.showAlert('Book Removed', 'success') function, since the event listener was placed on the parent which has a class of "book-list" which is in out html file. So in this section of the if statement we want it to do nothing, that is we don't want it to show the 'ui.showAlert('Book Removed', 'success')' message when we click on the any area of the whole book-list.

    
    }else{
         // this else statement helps us to make sure that the alert is shown show when a book is deleted by clicking only on the X mark in the html when we create a book...because this else statement is set to work if e.target has a className of 'delete'
        ui.showAlert('Book Removed', 'success');
    }




    e.preventDefault();
})
