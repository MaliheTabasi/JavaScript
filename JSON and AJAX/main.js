let counter = 1;
const btn = document.getElementById('btn');
btn.addEventListener('click', function () {
    const myRequest = new XMLHttpRequest();
    myRequest.open(
        'GET',
        `https://learnwebcode.github.io/json-example/animals-${counter}.json`
    );
    myRequest.onload = function () {
        if (myRequest.status >= 200 && myRequest.status < 400) {
            let data = JSON.parse(myRequest.responseText);
            renderHTML(data);
        }
    };
    myRequest.onerror = function () {
        console.log(' connection Error happend!');
    };
    myRequest.send();
    counter++;
    if (counter > 3) {
        btn.classList.add('hide-me');
    }
});

function renderHTML(data) {
    const animalContainer = document.getElementById('animal-info');
    let htmlString = '';
    for (let d of data) {
        htmlString += ` <p> ${d.name} is a ${d.species}and likes`;
        for (let l of d.foods.likes) {
            htmlString += `${l} `;
        }
        htmlString += '.</p>';
    }
    animalContainer.insertAdjacentHTML('beforeend', htmlString);
}
