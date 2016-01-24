/**
 * Person.js
 *
 * Represents a collection of Persons.
 */
var PersonCollection = (function() {
    "use strict";

    // Private Static Variables
    var lastId = 0;
    var personCollection = { };
    var listeners = [ ];

    // Person
    function Person(name, birthYear) {
        this.id = null;
        this.name = name;
        this.birthYear = birthYear;
    }

    Person.prototype.save = function() {
        savePerson(this);
    }

    Person.prototype.remove = function() {
        removePerson(this);
    }

    Person.prototype.toString = function() {
        return this.name + " " + this.birthYear;
    }


    // Person Collection Methods
    // Query
    function all() {
        var ids = Object.getOwnPropertyNames(personCollection) || [];

        return ids.map(findById);
    }

    function findById(id) {
        return personCollection[id];
    }

    // Persistence
    function create(name, birthYear) {
        var person = new Person(name, birthYear);
        savePerson(person);
        return person;
    }

    function savePerson(person) {
        if (!person.id)
            createPerson(person);
        else
            updatePerson(person);
        notify();
    }

    function createPerson(person) {
        person.id = generateNextId();
        personCollection[person.id] = person;
    }

    function updatePerson(person) {
        personCollection[person.id] = person;
    }

    function removePerson(person) {
        delete personCollection[person.id];
        notify();
    }

    function generateNextId() {
        return ++lastId;
    }

    // Events
    function notify() {
        listeners.forEach(function(listener) {
            listener();
        });
    }

    function addListener(listener) {
        listeners.push(listener);
        listener();
    }

    // Default Data
    create("Nolan", 1992);

    return {
        create: create,
        all: all,
        findById: findById,
        addListener: addListener
    };

})();
