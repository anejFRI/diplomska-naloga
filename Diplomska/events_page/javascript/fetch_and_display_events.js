// Function to fetch and display JSON data
async function fetchData() {
    try {
        const response = await fetch('http://127.0.0.1:5000/events');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
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
                <a class="myLink" data-value="${post[0]}" href="#">${post[1]}</a> 
                <p class="createdBy">Event created by: ${post[10]}</p>
                <p class="zanre">Žanre: ${post[13]} </p>
                <p>${post[2]}</p>
                <p id="${post[0]}"></p>
                <p>Začetek: ${post[3]}</p>
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

    } catch (error) {
        console.error('Error fetching data:', error);
        // Display error message on the screen if fetching fails
        const dataContainer = document.getElementById('data_container');
        dataContainer.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    }
}

// Call the fetchData function when the page loads
window.onload = fetchData;