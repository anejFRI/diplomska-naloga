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