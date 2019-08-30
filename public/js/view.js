$(document).ready(function() {
  // Getting a reference to the input field where user adds a new todo
  var $newItemInput = $("input.new-item");
  // Our new todos will go inside the todoContainer
  var $flashcardContainer = $(".flashcard-container");
  // Adding event listeners for deleting, editing, and adding todos
  $(document).on("click", "button.delete", deleteFlashcard);
  $(document).on("click", "button.complete", toggleComplete);
  $(document).on("click", ".flashcard-item", editFlashcard);
  $(document).on("keyup", ".flashcard-item", finishEdit);
  $(document).on("blur", ".flashcard-item", cancelEdit);
  $(document).on("submit", "#flashcard-form", insertFlashcard);

  // Our initial todos array
  var flashcards = [];

  // Getting todos from database when page loads
  getFlashcards();

  // This function resets the todos displayed with new todos from the database
  function initializeRows() {
    $flashcardContainer.empty();
    var rowsToAdd = [];
    for (var i = 0; i < flashcards.length; i++) {
      rowsToAdd.push(createNewRow(flashcards[i]));
    }
    $flashcardContainer.prepend(rowsToAdd);
  }

  // This function grabs todos from the database and updates the view
  function getFlashcards() {
    $.get("/api/flashcards", function(data) {
      flashcards = data;
      initializeRows();
    });
  }

  // This function deletes a todo when the user clicks the delete button
  function deleteFlashcard(event) {
    event.stopPropagation();
    var id = $(this).data("id");
    $.ajax({
      method: "DELETE",
      url: "/api/flashcards/" + id
    }).then(getFlashcards);
  }

  // This function handles showing the input box for a user to edit a todo
  function editFlashcard() {
    var currentFlashcard = $(this).data("flashcard");
    $(this).children().hide();
    $(this).children("input.edit").val(currentFlashcard.textQuestion);
    $(this).children("input.edit").show();
    $(this).children("input.edit").focus();
  }

  // Toggles complete status
  function toggleComplete(event) {
    event.stopPropagation();
    var flashcard = $(this).parent().data("flashcard");
    flashcard.complete = !flashcard.complete;
    updateFlashcard(flashcard);
  }

  // This function starts updating a todo in the database if a user hits the "Enter Key"
  // While in edit mode
  function finishEdit(event) {
    var updatedFlashcard= $(this).data("flashcard");
    if (event.which === 13) {
      updatedFlashcard.textQuestion = $(this).children("input").val().trim();
      $(this).blur();
      updateFlashcard(updatedFlashcard);
    }
  }

  // This function updates a todo in our database
  function updateFlashcard(flashcard) {
    $.ajax({
      method: "PUT",
      url: "/api/flashcards",
      data: flashcard
    }).then(getFlashcards);
  }

  // This function is called whenever a todo item is in edit mode and loses focus
  // This cancels any edits being made
  function cancelEdit() {
    var currentFlashcard = $(this).data("flashcard");
    if (currentFlashcard) {
      $(this).children().hide();
      $(this).children("input.edit").val(currentFlashcard.textQuestion);
      $(this).children("span").show();
      $(this).children("button").show();
    }
  }

  // This function constructs a todo-item row
  function createNewRow(flashcard) {
    var $newInputRow = $(
      [
        "<li class='list-group-item flashcard-item'>",
        "<span>",
        flashcard.textQuestion,
        "</span>",
        "<input type='text' class='edit' style='display: none;'>",
        "<button class='delete btn btn-danger'>x</button>",
        "<button class='complete btn btn-primary'>✓</button>",
        "</li>"
      ].join("")
    );

    $newInputRow.find("button.delete").data("id", flashcard.id);
    $newInputRow.find("input.edit").css("display", "none");
    $newInputRow.data("flashcard", flashcard);
    if (flashcard.complete) {
      $newInputRow.find("span").css("text-decoration", "line-through");
    }
    return $newInputRow;
  }

  // This function inserts a new todo into our database and then updates the view
  function insertFlashcard(event) {
    event.preventDefault();
    var flashcard = {
      textQuestion: $newItemInput.val().trim(),
      complete: false
    };

    $.post("/api/flashcards", flashcard, getFlashcards);
    $newItemInput.val("");
  }
});
