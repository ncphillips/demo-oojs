// `this.prototype` stuff is off the chain: Object Oriented Javascript
//
// Overview
// I. Introduction
//      a) functions
//      b) objects
//      c) methods
//      d) lexical scope
//      e) `this`
// II. Constructor Functions
//      a) assigning variables
//      b) assigning methods
//          i.  lexical scope
//          ii. `this`
//      c) `new`
//      d) `prototype`
//          i.  object type checking
//          ii. assigning methods via `prototype`
// III. Making Things Private
//      a) IIFEs create private scope
//      b) private constants
//      c) private functions/methods
//      d) private instance variables
//      e) static methods
//      d) private constructors with public factories
// IV. Building Re-usable Apps

/**
 * Functions
 */
function add(x, y) {
    return x + y;
}

add(1, 4); // 5

/**
 * Objects
 *  A set of key-value pairs. The key is a string or number, and the value can be anything, even a function.
 *  They almost look moer like dictionaries in Python, or HashMaps in Java.
 */
var dog = {
    name: "bob"
}

/**
 * Javascript fakes object methods by just assinging functions to variables.
 */
var dog = {
    speak: function() {
        console.log("Woof!");
    }
};

dog.speak(); // Woof!

/**
 * Lexical Scope
 *
 * WARNING: This is a perfect example of awful programming.
 */
var addened = 1;
var augend = 2;

function add() {
    // Accesses globally defined variables.
    return addend + augend;
}

add(); // 3
augend = 8;
add(); // 9

/**
 * Lexical Scope Cont. Methods
 *
 * Pulling details out of the code...kind of better, right?
 */
dogSound = "Woof!";

dog = {
    speak: function () {
        console.log(dogSound);
    }
}

/**
 * `this` is a better way
 *  Global state is bad, so we can use `this`, which references the context
 *  in which a function is called.This is decide at runtime, not compile time.
 */

function speak() {
    console.log(this.sound);
}

speak(); // undefined
this; // Window
this.sound; // undefined
this === window; // true
window.sound; // undefined
window.sound = "Hello World";
speak(); // Hello World

dog = {
    sound: "Woof!",
    speak: speak
}

dog.speak(); // Woof!
dog.speak === speak; // true
// We've now pulled the details out of the speak method and into
// data attached to the `dog` object.


/**
 * Constructor Functions
 *  Similar concept to constructors in class based languages like Java, a function that creates objects
 *  with a particular set of properties, but there's nothing really linking these objects.
 */

// We could call this `constructPerson`, but the capital `P` conventionally
// means it's a function which creates an object.
function Person(name, age) {
  return {
        name: name,
        age: age
    };
}

bruce = Person("bruce", 21); // Object {name: "bruce", age: 21}
alan = Person("alan", 34); // Object {name: "alan", age: 34}

/**
 * Faking class "methods"
 *  We can fake methods by assigning functions in our constructor functions.
 */
function Person(name, age) {
  return {
        name: name,
        age: age,
        toString: function() {
            return name + " " + age;
        }
    };
}

bruce = Person("bruce", 21); // Object {name: "bruce", age: 21}
alan = Person("alan", 34); // Object {name: "alan", age: 34}

bruce.toString(); // bruce 21
alan.toString(); // alan 34

// But how does toString work? In this case via lexical scope. Look...
alan.toString === bruce.toString; // false

// We should say that we're faking "methods" because there's a fundamental difference between
// how Java `toString` methods work, and how these `toString` functions work. Take a look at
// this Person class in Java.
public class Person {
    String name;
    Integer age;

    public Person(String name, Integer age) {
        this.name = name;
        this.age = age;
    }

    public toString(){
        return name + " " + age;
    }
}
// Superficially this looks pretty similar to our Person function. The difference is
// that the Java `toString` methods are attached to the class, but in our Javascript
// example the functions are created when the `Person` function is called. That means each
// Person object has a unique `toString` function. This means this strangeness can happen...
alan.toString = bruce.toString;
alan.toString(); // bruce 21

// Why? Because when the `toString` function is defined and attached to the Person,
// it is permanently bound to whatever values were in `name` and `age` at runtime.
// This is called "closure". Closure is what lets a function access the variables
// that were in it's lexical scope at runtime

/**
 * Methods should use `this` instead
 */
personToString = function() {
    return this.name + " " + this.age;
}

function Person(name, age) {
  return {
        name: name,
        age: age,
        toString: personToString
    };
}

matt = Person("matt", 35);
derek = Person("derek", 22);

matt.toString === derek.toString; // true
matt.toString === personToString; // true

matt.toString = derek.toString;
matt.toString(); // matt 35

personToString = function() {
    return this.age + " " + this.name;
}

matt.toString(); // matt 35

// What happend? Although the functions attached to the person we created are
// now re-usable and no longer stuck to the values of the person they were
// created for, the `Person` constructor still assigns them by value, and not
// by reference. Our code's more portable, but there's still some memory duplication.

/**
 * Let's try something `new`.
 * In order to remove memory duplication between our Person objects, we'll
 * need to step back a bit and discuss the `new` syntax.
 */
function Fruit() {
    return { };
}

newFruit = Fruit(); // Object { }

function Car() {

}

newCar = new Car(); // Car { }

// The `new` operator is to be used with constructor functions, but how does it work?
// 1. It creates the new empty object for you.
// 2. It binds the newly created object as the context to the constructor. This means
//    that the new object can be accesed via `this`.
// 3. If the function doesn't have it's own return statement, it returns the new object.
//
// This means we now define our Person a little more plainly.
//
personToString = function () {
    return this.name + " " + this.age;
}

function Person (name, age) {
    this.name = name;
    this.age = age;
    this.toString = personToString;
}

evan = new Person("evan", 65); // Person {name: "evan", age: 65}
evan.toString(); // evan 65

brent = Person(); // undefined

/**
 * `prototype`: The big scary.
 *  In Javascript, every function has a reference to an object. This is called the functions `prototype.
 *  When we use `new`, the new object is automatically linked to that functions prototype.
 */

brent = new Person();
brent.__proto__ === Person.prototype; // true

// With this, we could do some object type checking.
function isPerson(o) {
   return o.__proto__ === Person.prototype;
}

isPerson({}); // false
isPerson(new Car()); // false
isPerson(new Person()); //true

// But that's just the beginning...

/**
 * The `prototype` chain
 *  Javascript doesn't have inheritence in the Java or even Python sense of the word,
 *  but it does have the prototype chain, and with it we can solve our memory problem.
 */
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.toString = function() {
    return this.name + " " + this.age;
}

wilfred = new Person("wilfred", 42);
shia = new Person("shia", 32);

wilfred.toString(); // wilfred 42
shia.toString(); // shia 32

Person.prototype.toString = function () {
    return this.age + " " + this.name;
}

wilfred.toString(); // 42 wilfred
shia.toString(); // 32 shia

// We now have a subtype of Object called Person, for which
// all instances have a shared toString method.
