/**
 * PersonCollection.js
 *
 * Represents a collection of Persons.
 */
var PersonCollection = (function() {
    "use strict";

    /**
     * Private Static Variables
     */
    var lastId = 0;
    var personCollection = { };
    var listeners = [ ];

    /**
     * Singleton Object (Oh noo)
     */
    var PersonCollection = {};

    /**
     * Public Static Methods
     */
    PersonCollection.all = function() {
        var ids = Object.getOwnPropertyNames(personCollection) || [];

        return ids.map(this.findById);
    };

    PersonCollection.findById = function(id) {
        return personCollection[id];
    };

    PersonCollection.save = function(person) {
        if (!person.id)
            addPerson(person);
        else
            updatePerson(person);
        notify();
    };

    PersonCollection.remove = function(person) {
        delete personCollection[person.id];
        notify();
    };

    PersonCollection.addListener = function(listener) {
        listeners.push(listener);
        listener();
    };

    /**
     * Private Static Methods
     */
    function addPerson(person) {
        person.id = generateNextId();
        personCollection[person.id] = person;
    }

    function updatePerson(person) {
        personCollection[person.id] = person;
    }

    function generateNextId() {
        return ++lastId;
    }

    function notify() {
        listeners.forEach(function(listener) {
            try{
                listener();
            } catch (error) {
                console.log(error);
            }
        });
    }

    /**
     * Default Data
     */
    PersonCollection.save(new Person("Nolan", 1992));

    /**
     * Module Definition
     */
    return PersonCollection;
})();
