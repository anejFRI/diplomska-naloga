

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id'); //dobi id od prejšne strani, katera pošl id v parametru linka

const apiUrl = 'http://127.0.0.1:5000/get_event';
const apiUrlComments = 'http://127.0.0.1:5000/comments';
const apiUrlLocaition = 'http://127.0.0.1:5000/event_location';

sesh_data = getSessionData();

// Constructing the URL with query parameters
const urlWithParams = `${apiUrl}?id_event=${id}`;
const urlCommentsWithParams = `${apiUrlComments}?id_event=${id}`;
const urllLocaitionWithParams = `${apiUrlLocaition}?id_event=${id}`;

let event_data = null;

// Making a GET request with fetch
fetch(urlWithParams)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse JSON response
  })
  .then(data => { //če api pošlje nazaj podatke o eventu, se ti pokažejo na strani
    document.title = data[0][1]
    event_data = data;

    const div_title = document.createElement('div'); //dodaj naslov
    div_title.id = "event_title"
    div_title.innerHTML = `
        <p id="title" class="bold">${data[0][1]}</p>
    `;
    document.body.appendChild(div_title);

    const div_attending = document.createElement('div'); //dodaj naslov
    div_attending.id = "event_attending"
    div_attending.innerHTML = `
        <p id="gredo"><span class="bold">Gredo:</span>${data[1][0]}  <span class="bold">Zainterisirani:</span>${data[2][0]}</p>
    `;
    document.body.appendChild(div_attending);

    if (sesh_data){
      const user_data = JSON.parse(getCookie('session'));

      const div_interes = document.createElement('div'); //going
      div_interes.id = "event_interes"
      document.body.appendChild(div_interes);
      


      const div_going = document.createElement('div'); //going
      div_going.id = "event_going"
      div_going.innerHTML = `
          <form action="http://127.0.0.1:5000/event_going" method="POST" onsubmit="event_going(event)">
             <input type="hidden" name="id_event" id="id_event" value="${data[0][0]}"> 
             <input type="hidden" name="id_user" id="id_user" value="${user_data['id_user']}"> 
             <button type="submit">Grem</button>
          </form>`;
      div_interes.appendChild(div_going);

      const div_interested = document.createElement('div'); //interested
      div_interested.id = "event_interested"
      div_interested.innerHTML = `
          <form action="http://127.0.0.1:5000/event_interested" method="POST" onsubmit="event_interested(event)">
             <input type="hidden" name="id_event" id="id_event" value="${data[0][0]}"> 
             <input type="hidden" name="id_user" id="id_user" value="${user_data['id_user']}"> 
             <button type="submit">Zainterisiran</button>
          </form>`;
      div_interes.appendChild(div_interested);
    }

    const div_start = document.createElement('div'); //dodaj začetek
    div_start.id = "event_start"
    div_start.innerHTML = `
        <div><span class="bold">Začetek:</span> ${dateFormat(data[0][3])}</div>
    `;
    document.body.appendChild(div_start);

    const div_end = document.createElement('div'); //dodaj konec
    div_end.id = "event_end"
    div_end.innerHTML = `
        <div><span class="bold">Konec: </span>${dateFormat(data[0][4])}</div>
    `;
    document.body.appendChild(div_end);


    const div_organiser = document.createElement('div'); //dodaj organizatorja
    div_organiser.id = "event_organiser"
    div_organiser.innerHTML = `
        <div><span class="bold">Organizator:</span> ${data[0][10]}</div>
    `;
    document.body.appendChild(div_organiser);

    const div_genres = document.createElement('div'); //dodaj organizatorja
    div_genres.id = "event_genres"
    div_genres.innerHTML = `
        <div><span class="bold">Žanre:</span> ${data[0][13]}</div>
    `;
    document.body.appendChild(div_genres);

    const div_description = document.createElement('div'); //dodaj description
    div_description.id = "event_description"
    div_description.innerHTML = `
        <div><span class="bold">Opis:</span> ${data[0][2]}</div>
    `;
    document.body.appendChild(div_description);


    var base64Image = "data:" + data[0][6] + ";base64," + data[0][7] // post[6] = mimetype, post[7] = base64 enkodirana slika
    // Create an image element
    var img = document.createElement('img');
    // Set the src attribute with the Base64 data
    img.src = base64Image;
    
    const div_image = document.createElement('div'); //dodaj sliko
    div_image.id = "event_image"
    document.body.appendChild(div_image);
    document.getElementById("event_image").appendChild(img);

    const div_location = document.createElement('div'); //dodaj description
    div_location.id = "event_location"
    div_location.innerHTML = `
    `;
    document.body.appendChild(div_location);

    const div_map_insert = document.createElement('div'); //dodaj prostor za mapo
    div_map_insert.id = "map_insert"
    div_map_insert.innerHTML = `
    `;
    document.body.appendChild(div_map_insert);


    if (sesh_data){ //če je uporabnik prijavljen, lahko komentira
        const user_data = JSON.parse(getCookie('session'));
  
        const div_comment = document.createElement('div'); //komentiraj
        div_comment.id = "event_comment"
        div_comment.innerHTML = `
            <form action="http://127.0.0.1:5000/comment" method="POST" onsubmit="comment(event)">
               <input type="hidden" name="id_event" id="id_event" value="${event_data[0][0]}"> 
               <input type="hidden" name="id_user" id="id_user" value="${user_data['id_user']}"> 
               <textarea name="text" id="text" rows="4" cols="50"></textarea>
               <br>
               <button type="submit">Komentiraj</button>
            </form>`;
        document.body.appendChild(div_comment);
      }

      //kommentarji
      const div_komentarji = document.createElement('div'); //dodaj organizatorja
      div_komentarji.id = "komentarji"
      div_komentarji.innerHTML = `
    `;
    document.body.appendChild(div_komentarji);

  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
    // Handle errors here
  });

fetchComments();

fetchLocation();

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

async function event_going(event) {
  event.preventDefault(); // Prevent the default form submission
  
  const form = event.target;
  const formData = new FormData(form);
  
  try {
      const response = await fetch(form.action, {
          method: form.method,
          body: formData
      });
      
      if (response.ok) {
          const result = await response.json();
          if (result.success) {
              window.location.href = "index.html"; // če se event uspešno doda, redirect na main page
          } 
          else {
              alert("Submission failed: " + result.message);
          }
      } 
      else {
          alert("Server error: " + response.statusText);
      }
  } 
  catch (error) {
      alert("Network error: " + error.message);
  }
}

async function event_interested(event) {
  event.preventDefault(); // Prevent the default form submission
  
  const form = event.target;
  const formData = new FormData(form);
  
  try {
      const response = await fetch(form.action, {
          method: form.method,
          body: formData
      });
      
      if (response.ok) {
          const result = await response.json();
          if (result.success) {
              window.location.href = "index.html"; // če se event uspešno doda, redirect na main page
          } 
          else {
              alert("Submission failed: " + result.message);
          }
      } 
      else {
          alert("Server error: " + response.statusText);
      }
  } 
  catch (error) {
      alert("Network error: " + error.message);
  }
}

async function subcomment(event) {
    event.preventDefault(); // Prevent the default form submission
    
    const form = event.target;
    const formData = new FormData(form);
    
    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: formData
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                window.location.reload();
            } 
            else {
                alert("Submission failed: " + result.message);
            }
        } 
        else {
            alert("Server error: " + response.statusText);
        }
    } 
    catch (error) {
        alert("Network error: " + error.message);
    }
  }

  async function comment(event) {
    event.preventDefault(); // Prevent the default form submission
    
    const form = event.target;
    const formData = new FormData(form);
    
    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: formData
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                window.location.reload();
            } 
            else {
                alert("Submission failed: " + result.message);
            }
        } 
        else {
            alert("Server error: " + response.statusText);
        }
    } 
    catch (error) {
        alert("Network error: " + error.message);
    }
  }

async function fetchComments() {
    try {
        const response = await fetch('http://127.0.0.1:5000/comments?id_event=' + id);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const user_data = JSON.parse(getCookie('session'));

        // Access the data and display on the screen
        const dataContainer = document.getElementById('komentarji');
        data.forEach(post => {

            formattedDate = dateFormat(post[2])
            

            const div_komentarji = document.createElement('div');
            div_komentarji.id = "komentarji_container"
            div_komentarji.innerHTML = `
                <p class="commentOwner">${post[7]}  ${formattedDate}</p>
                <p class="comment">${post[1]}</p>
                <form action="http://127.0.0.1:5000/subcomment" method="POST" onsubmit="subcomment(event)">
                    <input type="hidden" name="id_event" id="id_event" value="${event_data[0][0]}"> 
                    <input type="hidden" name="id_user" id="id_user" value="${user_data['id_user']}"> 
                    <input type="hidden" name="id_comment" id="id_comment" value="${post[0]}"> 
                    <textarea style="display: none;" name="subtext" id="hidden_text" required></textarea>
                    <button style="display: none;" type="submit">Komentiraj</button>
                </form>
                <button class="visible" id="visible${post[0]}">Odgovori</button>
            `;
            dataContainer.appendChild(div_komentarji);

            const visibleButtons = document.querySelectorAll('.visible');
            visibleButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const parentDiv = button.parentNode;
                    const textarea = parentDiv.querySelector('textarea');
                    const submitButton = parentDiv.querySelector('button[type="submit"]');
                    textarea.style.display = "block";
                    submitButton.style.display = "block";
                    button.style.display = "none";
                });
            });

        });
    } catch (error) {
        console.error('Error fetching data:', error);
        // Display error message on the screen if fetching fails
        const dataContainer = document.getElementById('data_container');
        dataContainer.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    }
}

async function fetchLocation() {
    try {
        const response = await fetch('http://127.0.0.1:5000/event_location?id_event=' + id);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();


        const user_data = JSON.parse(getCookie('session'));

        document.getElementById("event_location").innerHTML = `
        <div><span class="bold">Kraj:</span> ${data[0][1]}</div>
        <div><span class="bold">Naslov:</span> ${data[0][2]}</div>
        <div><span class="bold">Koordinati:</span> ${data[0][3]}</div>
        `
        const coordinates = data[0][3].split(',');
        const latitude = parseFloat(coordinates[0]);
        const longitude = parseFloat(coordinates[1]);

        const div_map = document.createElement('div'); //dodaj prostor za mapo
        div_map.id = "map"
        div_map.innerHTML = `
        
        `;
        div_map.style.width = "600px";
        div_map.style.height = "400px";

        //document.body.appendChild(div_map);

        //insert div map into div map_insert
        const div_map_insert = document.getElementById('map_insert');
        div_map_insert.appendChild(div_map);

        var map = L.map('map').setView([latitude, longitude], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    
        L.marker([latitude, longitude]).addTo(map)
          .openPopup();


    } catch (error) {
        console.error('Error fetching data:', error);
        // Display error message on the screen if fetching fails
        const dataContainer = document.getElementById('data_container');
        dataContainer.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    }
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