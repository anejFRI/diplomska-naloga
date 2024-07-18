async function genre_creation(event) {
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
                window.location.href = "index.html"; // če se žanra uspešno doda, redirect na main page
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