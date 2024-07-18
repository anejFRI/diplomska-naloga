// Function to fetch and display JSON data
async function search(event) {
    event.preventDefault();
    const dataContainer = document.getElementById('data_container');
    dataContainer.innerHTML = '';    

    const form = event.target;
    const formData = new FormData(form);


    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: formData
        });

        const data = await response.json();
        console.log(data);

        // Access the data and display on the screen
        const dataContainer = document.getElementById('data_container');
        data.forEach(post => {
            // Base64 encoded image data (example)
            var base64Image = "data:" + post[6] + ";base64," + post[7] // post[6] = mimetype, post[7] = base64 enkodirana slika
            // Create an image element
            var img = document.createElement('img');
            // Set the src attribute with the Base64 data
            img.src = base64Image;
            // Append the image element to the body or any other HTML element
            //document.body.appendChild(img);


            const div_event_container = document.createElement('div');
            div_event_container.id = "event_container"
            div_event_container.innerHTML = `
                <a class="myLink" data-value="${post[0]}" href="#"><h2>${post[1]}</h2></a> 
                <p class="createdBy">Event created by: ${post[10]}</p>
                <p>${post[2]}</p>
                <p id="${post[0]}"></p>
                <p>Začetek:${post[3]}</p>
                <hr>
            `;
            dataContainer.appendChild(div_event_container);
            document.getElementById([post[0]]).appendChild(img);
        });

        const links = document.querySelectorAll('.myLink'); //dodaj event listener na vsak link, da ko klikneš, te pripelje na stran eventa
        
        links.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior
                //const url = new URL('display_event.html');
                const url = new URL('display_event.html', window.location.href);
                url.searchParams.append('id', link.getAttribute("data-value"));
                window.location.href = url.toString(); 
            });
        });

    }
catch (error) {
    alert("Network error: " + error.message);
}
}