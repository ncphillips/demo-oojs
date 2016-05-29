/**
 * Object-Oriented Javascript Part 2: Making Things Private
 *
 * Building on the content of a previous talk, we'll explore how we can use
 * scope, closures, binding, and the prototype chain to implement certain
 * patterns that are not immediately apparent in Javascript.
 *
 * 1. A Quick Review
 *	a) Lexical Scope
 *	b) Contextual Scope
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
 * Lexical Scope
 * Access based on write time structure
 */

// `sound` is accessed from the lexical scope. The scope defined at write-time.
var sound = "LOUD NOISES";

function speak() {
    return sound;
}

speak(); // LOUD NOISES

// Lexical scope does not depend on the context in which a function is called.
// This means if we have another function call `speak` with it's own definition
// of `sound`, `speak` will still access the global `sound`.
function speak2() {
    var sound = "test";
    return speak();
}

speak2(); // LOUD NOISES

/**
 * Contextual scope with `this`.
 * Access based on the context in which a function is called.
 */
sound = "GLOBAL";
funciton speak() {
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
 * Pass by Reference
 */
var sound = "LOUD NOISES";

function getSpeakForSound(sound) {
	return function speak() {
		// Lexical scope is still used to access sound, however the `sound` we're looking for
		// is no declared within the functions scope, not in the global scope.
        console.log(sound);
    }
}

speak1 = getSpeakForSound();
speak1(); // undefined
// Because we didn't pass any value into `getSpeakForSoudn`, the echoed value is `undefined`.

speak2 = getSpeakForSound(sound);
speak2(); // LOUD NOISES
// Now it can access the string value.

speak1(); // undefined
speak2(); // LOUD NOISES
// These are two completely separate functions, taking up their own space in memory.

sound = "LOUD NOISES";
speak2 = getSpeakForSound(sound);
speak2(); // LOUD NOISES;
sound = "OTHER NOISES";
speak2(); // LOUD NOISES

// The output did not change, because Javascript is pass-by-value, so there's actually
// two variables for `sound` now.

/**
 * Closure
 */
// Look at this stub of `getSpeakForSound`.
function getSpeakForSound(sound) { }

// This copies `sound`, passes it to `getSpeakForSound`.
// In this situation, `sound` is immediately destroyed by the garbage collector
// once `getSpeakForSound` stops executing.
getSpeakForSound(sound);

// If the garbage collection destroys `sound` after `getSpeakForSound` finishes
// executing, then why does the `speak` function in this case still work?
function getSpeakForSound(sound) {
	return function speak() { return sound; }
}

sound = "Test";
speak = getSpeakForSound(sound);
speak("Test");

// This is closure. Closure is what allows functions to access their lexical scope
// long after it should have been gone. We say that the `speak` function created
// at runtime, has a closure over the state of `getSpeakForSound` at run




function getSpeakForSound(sound) {
	// Javascript passes variables `by value`. This means the `sound` in the function is
	// a copy of the `sound` in the global scope.
	// So why can this `speak` function reference the `sound` passed to the function?
	return function speak() {
		// Normally, `sound` would be deallocated after `getSpeakForSound` finishes executing.
		// However, a new `speak` function is created at run-time, and returned to the caller.
		// And since this `speak` function references `sound` in it's parent scope, `sound`
		// continues to live as long as the new `speak` function does.
		// This is closure, closure is what allows speak to reference it's external scope long
		// after it should have been removed by the garbage collector.
        console.log(sound);
    }
}

//

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

(function() { console.log("Hello from IIAF!"})();

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



