let person = {
    name: 'Nitish',
    age: 15
}
let student = {
    a:12,
    b:14,
    c:10
}
sum = 0
for(let key in student) {
    sum += student[key];
}
console.log(sum);

function mouseDown()  {
    const box = document.getElementById('mouseBox')
    box.style.color="red";
}
function onmouseup1() {
    const box = document.getElementById("mouseBox")
    box.style.color="blue";
}
function onmouseOut() {
    document.getElementById('mouseBox').style.backgroundColor="purple";
}