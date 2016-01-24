/**
 * personlist.js
 *
 * This module initializes the PersonList app and
 * binds DOM events to the app's methods.
 */
$(function() {
    "use strict";

    var app = new PersonListApp();


    $("form").submit(onAddPerson);

    // Makes sure it catches dynamically added elements.
    $("body").on('click', '.remove-person', onRemovePerson);

    function onRemovePerson(e) {
        var personId = e.target.getAttribute("personId");

        app.removePerson(personId);
    }

    function onAddPerson(e) {
        e.preventDefault()

        var name = $("#new-person-name").val();
        var birthYear = $("#new-person-age").val();

        app.addPerson(name, birthYear);
    }

});

