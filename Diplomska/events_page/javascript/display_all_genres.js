// Function to fetch and display JSON data
async function fetchData() {
    try {
        const response = await fetch('http://127.0.0.1:5000/genres');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Access the data and display on the screen
        const dataContainer = document.getElementById('data_container');
        data.forEach(post => {
            const div_genre_container = document.createElement('div');
            div_genre_container.id = "genre_container"
            div_genre_container.innerHTML = `
                <a class="myLink" data-value="${post[0]}" href="#"><h2>${post[1]}</h2></a> 
                <p>${post[2]}</p>
                <hr>
            `;
            dataContainer.appendChild(div_genre_container);
        });

        const links = document.querySelectorAll('.myLink'); //dodaj event listener na vsak link, da ko klikneš, te pripelje na stran žanre
        
        links.forEach(link => {
            link.addEventListener('click', (genre) => {
                genre.preventDefault(); // Prevent default link behavior
                const url = new URL('genre.html', window.location.href);
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