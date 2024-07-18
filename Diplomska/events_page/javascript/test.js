const dateString = "Wed, 03 Jul 2024 18:03:00 GMT";

// Parse the date string
const parsedDate = new Date(dateString);

// Get components of the date
const hours = String(parsedDate.getUTCHours()).padStart(2, '0');
const minutes = String(parsedDate.getUTCMinutes()).padStart(2, '0');
const day = String(parsedDate.getUTCDate()).padStart(2, '0');
const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
const year = parsedDate.getUTCFullYear();

// Format the date into desired format
const formattedDate = `${hours}:${minutes} ${day}.${month}.${year}`;

console.log(formattedDate);