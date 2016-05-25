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

    $("body").on('click', '.remove-person', onRemovePerson);

    function onRemovePerson(e) {
        var personId = e.target.getAttribute("personId");

        var person = PersonCollection.findById(personId);

        PersonCollection.remove(person);
    }

    function onAddPerson(e) {
        e.preventDefault();

        var name = $("#new-person-name").val();
        var birthYear = $("#new-person-age").val();

        var person = new Person(name, birthYear);

        PersonCollection.save(person);
    }

});

