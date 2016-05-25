/**
 * Object-Oriented Javascript Part 2: Making Things Private
 * 
 * Building on the content of a previous talk, we'll explore how we can use
 * scope, closures, binding, and the prototype chain to implement certain
 * patterns that are not immediately apparent in Javascript. 
 *
 * 1. A Quick Review
 * 2. 
 */

/**
 * Review
 * 
 * Last time I talked a whole bunch about javascript, and various features and oddities of the language.
 * As this ideas built on top of each other, we eventually started talking 
 */
function Dog(name, sound) {
    this.name = name;
    this.sound = sound;
}

Dog.prototype.speak = function(n){
    n = n || 1;
    for (var i=0; i < n; i ++) {
        console.log(this.sound);
    }
};


/**
 * Immediately Invoked Anonymous Functions
 */

(function() { console.log("Hello from IIAF!"})();

/**
 * Private Constants
 */
Person = (function() {

    MAX_AGE = 110;

    return function Person (name, age) {
        if (age > MAX_AGE)
            throw new Error("He can't be that old!");

        this.name = name;
        this.age = age;
    };

})

/**
 * Private Methods
 */
Person = (function() {
    function Person (name, age) {
        this.name = name;
        this.age = age;
    };

    Person.prototype.speak = function() {
        var message = thinkOfSomethingToSay(this);
        console.log(message);
        return message;
    }

    function thinkOfSomethingToSay(person) {
        return "Hi, I'm " + person.name;
    }

    return Person;
})

bob = new Person("byyob", 25);
bob.speak(); // Hi, I'm bob

/**
 * Simulate private variables using closure/lexical scope.
 */
Person = (function() {
    function Person(name, age) {
        this.name = name;
        this.age = age;

        var privateVariables = { isAlive: true };

        this.isAlive = function() {
            return privateVariables.isAlive;
        }

        this.kill = function() {
            privateVariables.isAlive = false;
        }
    }

    return Person
})();


bob = new Person("bob", 25);
jerry = new Person("jerry", 25);

bob.isAlive(); // true
jerry.isAlive(); // true

bob.kill();

bob.isAlive(); // false
jerry.isAlive(); // true

bob.privateVariables; // undefined

bob.getPrivateVariables = function() { return this.privateVariables; }
bob.getPrivateVariables(); // Uncaught ReferneceError: privateVariables is not defined.

/**
 * Pull function definitions out of contsructor with binding
 *  `bind(context)` can be called on any function. It binds whatever
 *  `context` is to the function so that, no matter what `this` will
 *  be the `context`. `bind` copies the function so we can bind the
 *  same function multiple times.
 */
var Person = (function() {
    function Person(name, age) {
        this.name = name;
        this.age = age;

        var privateVariables = { password: null }

        this.isPassword = function() { return privateVariables.password; };
        this.setPassword = privateSetPassword.bind(this, privateVariables);
    }

    function isPassword(privateVariables, password){
        return privateVariables.password === hashPassword(password);
    }

    function privateSetPassword(privateVariables, password) {
        if (isBadPassword(password))
            throw new Error("That's a bad password.");

        privateVariables.password = hashPassword(password);
    }

    function isBadPassword(password) { /** return boolean */ return false; }

    function hashPassword(password) { /** return string */ return password; }

    return Person
})();

/**
 * Static Methods
 */
var Person = (function() {
    function Person (name, age) {
        this.name = name;
        this.age = age;
    }

    Person.prtotype.toString = function() {
        return this.name + " " + this.age;
    };

    Person.findById = function() {
        $.getJSON("/api/people/" + id).then(function(response) {
            var name = response.name;
            var age = response.age;

            return new Person(age, name);
        });
    };

    return Person;
})();

var personId = $("#selected-user").text();

var newPerson = new Person("Nolan", 23);
var selectedPerson = Person.findById(selectedPersonId);

selectedPerson.toString(); // Adam Sandler 45

/**
 * Private Constructors with the Module Pattern.
 *  Let's use a Game of Life example
 */

var World = (function() {
    function World() { }

    function emptyWorld() {
        return new World();
    }

    function blockWorld(topLeftLocation) {
        var world = new World();

        // setup block ...

        return world;
    }

    return {
        emptyWorld: emptyWorld,
        blockWorld: blockWorld
    }
})();

var emptyWorld = World.emptyWorld();

var newWorld = new World(); // Uncaught TypeError: World is not a function...



