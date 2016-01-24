/**
 * personlist.js
 *
 * This module initializes the PersonList app and
 * binds DOM events to the app's methods.
 */
$(function() {
    "use strict";

    var personListView = new PersonListView(PersonCollection);


    $("form").submit(onAddPerson);

    // Makes sure it catches dynamically added elements.
    $("body").on('click', '.remove-person', onRemovePerson);

    function onRemovePerson(e) {
        var personId = e.target.getAttribute("personId");

        PersonCollection.findById(personId).remove();
    }

    function onAddPerson(e) {
        e.preventDefault()

        var name = $("#new-person-name").val();
        var birthYear = $("#new-person-age").val();

        PersonCollection.create(name, birthYear);
    }

});

