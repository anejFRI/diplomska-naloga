// Function to fetch and display JSON data
async function fetchData() {
    sesh_data = getSessionData();
    const user_data = JSON.parse(getCookie('session'));
    console.log(user_data['id_user']);
    console.log(user_data);
    try {
        const response = await fetch('http://127.0.0.1:5000/users_events?id=' + user_data['id_user']);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

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
                <p>${post[2]}</p>
                <p id="${post[0]}"></p>
                <p>Začetek: ${dateFormat(post[3])}</p>
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


function getSessionData() {
    const jsonData = getCookie("session");
    if (jsonData) {
        try {
            return JSON.parse(jsonData);
        } catch (e) {
            console.error("Error parsing session data:", e);
            return null;
        }
    }
    return null;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function dateFormat (datum){
    dateString = datum;

    // Parse the date string
    const parsedDate = new Date(dateString)
    // Get components of the date
    const hours = String(parsedDate.getUTCHours()).padStart(2, '0');
    const minutes = String(parsedDate.getUTCMinutes()).padStart(2, '0');
    const day = String(parsedDate.getUTCDate()).padStart(2, '0');
    const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = parsedDate.getUTCFullYear()
    // Format the date into desired format
    const formattedDate = `${hours}:${minutes} ${day}.${month}.${year}`;

    return formattedDate;
}