sesh_data = getSessionData();

if (sesh_data) { //če je uporabnik prijavljen
    const user_data = JSON.parse(getCookie('session'));
    if(sesh_data['admin'] == 1){
        document.getElementById("myHead").innerHTML =`
        <a class="headerLinks" href="index.html">Eventi</a>  
        <a class="headerLinks" href="user_events.html">Tvoji eventi</a>  
        <a class="headerLinks" href="genres_wiki.html">Žanre Wiki</a>  
        <a class="headerLinks" href="create_event.html">Ustvari dogodek</a>  
        <a class="headerLinks" href="create_genre.html">Ustvari žanro</a>
        <a class="headerLinks" href="logout.html">Izpis</a>  
        <a class="headerLinks" id="username">${user_data['username']}</a>
        `;
    }
    else{
        document.getElementById("myHead").innerHTML =`
        <a class="headerLinks" href="index.html">Eventi</a>  
        <a class="headerLinks" href="user_events.html">Tvoji eventi</a>  
        <a class="headerLinks" href="genres_wiki.html">Žanre Wiki</a>  
        <a class="headerLinks" href="create_event.html">Ustvari event</a>  
        <a class="headerLinks" href="logout.html">Izpis</a>  
        <a class="headerLinks" id="username">${user_data['username']}</a>
        `;
    }
} 
else { //če uporabnik ni prijavljen
    document.getElementById("myHead").innerHTML =`
            <a class="headerLinks" href="index.html">Eventi</a>
            <a class="headerLinks" href="genres_wiki.html">Žanre Wiki</a>
            <a class="headerLinks" href="login_users.html">Vpis</a>
            <a class="headerLinks" href="register.html">Registracija</a>
            `
}

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