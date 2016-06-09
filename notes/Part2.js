/**
 * Object-Oriented Javascript Part 2: Making Things Private
 *
 * Building on the content of a previous talk, we'll explore how we can use
 * scope, closures, binding, and the prototype chain to implement certain
 * patterns that are not immediately apparent in Javascript.
 *
 * 1. A Quick Review
 *	a) Written Scope
 *	b) Runtime Scope
 *  c) Pass-by-Reference
 *  d) Closure
 *  e) Prototype
 *  f) Constructor Functions
 * 2. Encapsulation
 *  a) Immeditately Invoked Anonymous Functions (IIAF)
 *  b) Module pattern
 */

/**
 * Review
 */

/**
 * Written Scope (Lexical Scope
 * Access variables based on the written structure of the code.
 */

var sound = "LOUD NOISES";

function lexSpeak() {
    return sound; // lexical scope.
}

lexSpeak(); // LOUD NOISES

// Lexical scope does not depend on the context in which a function is called.
// Lexical scope depends on the context in which a function is written.
function lexSpeakWrapper() {
    var sound = "test";
    return speak();
}

lexSpeakWrapper(); // LOUD NOISES


/**
 * Runtime scope with `this`.
 * Access based on the context in which a function is called.
 */
sound = "GLOBAL";
function speak() {
	return this.sound;
}

speak(); // "GLOBAL"

// If we put `speak` on another object, it's context changes.
var eg = {
	speak: speak,
	sound: "EG"
};

speak(); // GLOBAL
eg.speak(); // EG

// We can tell functions in which context we want them to be called, using `call`.
speak.call(eg); // EG
eg.speak.call(this); // GLOBAL

/**
 * Prototypes
 */
// Even functions are objects in Javascript, and functions have a property called the `prototype`.

function Dog() { }
Dog.prototype; // Object { }

// Objects have a property called `__proto__`, which points to some prototype object.
// The default prototype for all objects is the `Object` prototype.
var billy = {};
billy.__proto__; // Object { }

// We can change the `__proto__` of an object.
function Dog() { }
Dog.prototype; // Object { }

var dog = {};
dog.__proto__ = Dog.prototype;

/**
 * The Prototype Chain
 *		Inheritence in Javascript is handled by the Prototype chain.
 *		When you look for a property on an object, the interpreter will first look at the
 *		object itself, but if the property is not found, it will look at the object's prototype.
 */

function Dog() { }
Dog.prototype; // Object { }

var dog = {};
dog.__proto__ = Dog.prototype;
dog.sound; // undefined
Dog.prototype.sound = "Woof";
dog.sound; // Woof
dog.sound = "WOOF WOOF";
dog.sound; // WOOF WOOF;
Dog.prototype.sound; // Woof





/**
 *Constructor Functions
 */
function Dog(name) {
    this.name = name;
}

var dog = new Dog("Bob");

Dog.prototype.speak = function(n){
    n = n || 1;
    
    for (var i=0; i < n; i ++) {
        console.log(this.sound);
    }
};


/**
 * Immediately Invoked Anonymous Functions
 */

(function() { console.log("Hello from IIAF!");})();

/**
 * Encapsulation
 */
Person = (function() {
	return function Person (name, age) {
		this.name = name;
		this.age = age;
    };
})();

/**
 * Private Constants
 */
Person = (function() {

    MAX_AGE = 110;

    function Person (name, age) {
        if (age > MAX_AGE)
            throw new Error("He can't be that old!");

        this.name = name;
        this.age = age;
    }

    return Person;
});

/**
 * Private Methods
 */
Person = (function() {
    function Person (name, yob) {
        this.name = name;
        this.age = calculateAge(yob);
    }

    function calculateAge(yob) {
        return 2016 - yob;
    }

    return Person;
});

bob = new Person("byyob", 25);
bob.speak(); // Hi, I'm bob


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


/**
 * EXTRA: * Simulate private variables using closure/lexical scope.
 */
Person = (function() {
    function Person(name, age) {
        this.name = name;
        this.age = age;

        var privateVariables = { isAlive: true };

        this.isAlive = function() {
            return privateVariables.isAlive;
        };

        this.kill = function() {
            privateVariables.isAlive = false;
        };
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
