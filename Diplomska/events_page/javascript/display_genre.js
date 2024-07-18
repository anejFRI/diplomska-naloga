const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id'); //dobi id od prejšne strani, katera pošl id v parametru linka

const apiUrl = 'http://127.0.0.1:5000/get_genre';

// Constructing the URL with query parameters
const urlWithParams = `${apiUrl}?id_genre=${id}`;

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

    const div_genre_name = document.createElement('div'); //dodaj naslov
    div_genre_name.id = "genre_name"
    div_genre_name.innerHTML = `
        <p id="title" class="bold">${data[0][1]}</p>
    `;
    document.body.appendChild(div_genre_name);

    const div_description = document.createElement('div'); //dodaj description
    div_description.id = "genre_description"
    div_description.innerHTML = `
        <div>${data[0][2]}</div>
    `;
    document.body.appendChild(div_description);

    const div_example = document.createElement('div'); //dodaj description
    div_example.id = "genre_description"
    div_example.innerHTML = `
        <div>${data[0][3]}</div>
    `;
    document.body.appendChild(div_example);
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
    // Handle errors here
  });
