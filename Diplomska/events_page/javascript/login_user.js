async function handleSubmit(event) {
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
                const sessionData = {
                    id_user: result.id_user,
                    username: result.username,
                    email: result.email,
                    admin: result.admin
                    }
                    setCookie('session', JSON.stringify(sessionData), 31); // cookie nastavljen za 31 dni
                window.location.href = "index.html"; // Redirect to another website
            } else {
                alert("Submission failed: " + result.message);
            }
        } else {
            alert("Server error: " + response.statusText);
        }
    } catch (error) {
        alert("Network error: " + error.message);
    }
}

function setCookie(name, value, days, secure, sameSite) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    var secureAttribute = secure ? "; Secure" : "";
    var sameSiteAttribute = sameSite ? "; SameSite=" + sameSite : "";
    document.cookie = name + "=" + (value || "") + expires + "; path=/" + secureAttribute + sameSiteAttribute;
}