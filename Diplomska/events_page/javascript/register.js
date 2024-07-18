async function handleSubmit(event) {
    event.preventDefault(); // Prevent the default form submission
    
    const form = event.target;
    const formData = new FormData(form);
    
    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: formData
        });
        const result = await response.json();
        if (response.ok) {
            if (result.success) {
                window.location.href = "login_users.html"; // Redirect to another website
            } else {
                alert("Submission failed: " + result.message);
            }
        } else {
            alert("Server error: " + result.message);
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