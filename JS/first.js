// Basic Syntax

// Comments (single-line)
// This is a single-line comment.

/*
This is a multi-line comment.
*/

// Variables (declaration and assignment)
let message = "Hello, world!"; // Using let (block scope)
const PI = 3.14159; // Using const (constant)
var oldVariable = "This is an older way to declare variables"; // Using var (function/global scope - generally avoid)

// Datatypes

// Primitive Datatypes
let name = "John"; // String
let age = 30; // Number (integers and floating-point)
let isStudent = true; // Boolean
let nothing = null; // Null (intentional absence of a value)
let undefinedVariable; // Undefined (variable declared but not assigned a value)
let bigNumber = 1234567890123456789012345678901234567890n; // BigInt (for arbitrarily large integers)
let mySymbol = Symbol('description'); // Symbol (unique and immutable)

// Non-Primitive Datatype (Object)
let person = {
  firstName: "John",
  lastName: "Doe",
  age: 30,
  greet: function() { // Method (function within an object)
    console.log("Hello, my name is " + this.firstName + " " + this.lastName);
  }
};


// Operators

// Arithmetic Operators
let sum = 5 + 3; // Addition
let difference = 10 - 4; // Subtraction
let product = 6 * 2; // Multiplication
let quotient = 15 / 3; // Division
let remainder = 10 % 3; // Modulus (remainder)
let exponent = 2 ** 3; // Exponentiation

// Assignment Operators
let x = 10;
x += 5; // x = x + 5 (shorthand)
x -= 2; // x = x - 2
x *= 3; // x = x * 3
x /= 2; // x = x / 2

// Comparison Operators
let isEqual = (5 == 5); // Equal to (loose comparison)
let isStrictEqual = (5 === 5); // Equal to (strict comparison - checks type too)
let isNotEqual = (5 != 6); // Not equal to
let isGreaterThan = (10 > 5); // Greater than
let isLessThan = (5 < 10); // Less than
let isGreaterThanOrEqual = (10 >= 10); // Greater than or equal to
let isLessThanOrEqual = (5 <= 5); // Less than or equal to

// Logical Operators
let andOperator = (true && true); // Logical AND
let orOperator = (true || false); // Logical OR
let notOperator = (!true); // Logical NOT

// String Operators
let greeting = "Hello, " + name + "!"; // Concatenation

// Type Operators
let typeOfName = typeof name; // Returns "string"
let typeOfAge = typeof age; // Returns "number"


// Statements

// Conditional Statements
if (age >= 18) {
  console.log("Adult");
} else {
  console.log("Minor");
}

// Switch Statement
let day = "Monday";
switch (day) {
  case "Monday":
    console.log("It's Monday!");
    break;
  case "Tuesday":
    console.log("It's Tuesday!");
    break;
  default:
    console.log("It's some other day.");
}

// Loops
// For loop
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// While loop
let j = 0;
while (j < 3) {
  console.log(j);
  j++;
}

// Do...While loop
let k = 5;
do {
    console.log(k);
    k--;
} while (k > 0)


// Functions

// Function declaration
function greet(personName) {
  return "Hello, " + personName + "!";
}

// Function call
let greetingMessage = greet("Alice");
console.log(greetingMessage);


// Arrow function (more concise syntax)
const add = (a, b) => a + b;
let sumOfTwoNumbers = add(2, 3);
console.log(sumOfTwoNumbers);


// Operands and Methods

// Operands: Values that operators act upon (e.g., 5 and 3 in 5 + 3).

// Methods: Functions that are associated with objects.  (See the `person.greet()` example above).


// Output
console.log(message); // Displays the value of message in the console.
console.log(person.firstName); //Accessing object properties
person.greet(); // Calling a method

(function()  {
    arr = ['this', 'is', 'an', 'array'];
    console.table(arr);
})(); // IIFE (Immediately Invoked Function Expression);