
// SKYBOOK FLIGHT DATA

const flights = [
    {
        airline: "PIA",
        from: "Quetta",
        to: "Karachi",
        departure: "08:00 AM",
        arrival: "09:30 AM",
        price: 18500,
        availableDays: [1, 3, 5]
    },
    {
        airline: "Airblue",
        from: "Quetta",
        to: "Karachi",
        departure: "02:00 PM",
        arrival: "03:30 PM",
        price: 21000,
        availableDays: [2, 4, 6]
    },
    {
        airline: "Serene Air",
        from: "Karachi",
        to: "Lahore",
        departure: "10:00 AM",
        arrival: "12:00 PM",
        price: 19500,
        availableDays: [1, 2, 4, 6]
    },
    {
        airline: "PIA",
        from: "Islamabad",
        to: "Dubai",
        departure: "09:00 AM",
        arrival: "12:00 PM",
        price: 65000,
        availableDays: [0, 2, 4, 6]
    },
    {
        airline: "Airblue",
        from: "Lahore",
        to: "Istanbul",
        departure: "06:00 PM",
        arrival: "11:00 PM",
        price: 95000,
        availableDays: [1, 3, 5]
    },
    {
        airline: "Serene Air",
        from: "Quetta",
        to: "Islamabad",
        departure: "11:00 AM",
        arrival: "12:30 PM",
        price: 23000,
        availableDays: [0, 2, 5]
    },

{
    airline: "PIA",
    from: "Quetta",
    to: "Skardu",
    departure: "09:00 AM",
    arrival: "10:30 AM",
    price: 28000,
    availableDays: [1, 3, 5]
},
{
    airline: "Airblue",
    from: "Quetta",
    to: "London",
    departure: "08:00 PM",
    arrival: "06:00 AM",
    price: 180000,
    availableDays: [2, 4, 6]
},
{
    airline: "Serene Air",
    from: "Quetta",
    to: "Paris",
    departure: "07:00 PM",
    arrival: "05:00 AM",
    price: 195000,
    availableDays: [0, 2, 5]
},
{
    airline: "PIA",
    from: "Quetta",
    to: "Doha",
    departure: "11:00 AM",
    arrival: "02:00 PM",
    price: 85000,
    availableDays: [1, 4, 6]
},
{
    airline: "Airblue",
    from: "Quetta",
    to: "Riyadh",
    departure: "03:00 PM",
    arrival: "07:00 PM",
    price: 90000,
    availableDays: [0, 2, 5]
},
{
    airline: "PIA",
    from: "Quetta",
    to: "Baku",
    departure: "10:00 AM",
    arrival: "03:00 PM",
    price: 110000,
    availableDays: [1, 3, 6]
},
{
    airline: "Serene Air",
    from: "Quetta",
    to: "Jeddah",
    departure: "06:00 PM",
    arrival: "11:00 PM",
    price: 105000,
    availableDays: [0, 3, 5]
}

];


// SEARCH FORM

const searchForm = document.getElementById("flightSearchForm");
const results = document.getElementById("flightResults");


// DATE HELPER

function getDateAfter(date, days) {
    const newDate = new Date(date + "T00:00:00");
    newDate.setDate(newDate.getDate() + days);

    return newDate;
}

function formatDate(date) {
    return date.toLocaleDateString("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


// SEARCH FLIGHTS

searchForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const date = document.getElementById("departure").value;
    const passengers = Number(
        document.getElementById("passengers").value
    );

    if (from === to) {
        alert("Departure and destination cannot be the same!");
        return;
    }

    const selectedDate = new Date(date + "T00:00:00");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        alert("Please select a future date!");
        return;
    }

    // FIND MATCHING ROUTES

    const matchingFlights = flights.filter(function(flight) {
        return flight.from === from && flight.to === to;
    });

    // FIND FLIGHTS ON SELECTED DATE

    const availableFlights = matchingFlights.filter(function(flight) {
        return flight.availableDays.includes(
            selectedDate.getDay()
        );
    });

    results.innerHTML = "";

    if (availableFlights.length > 0) {

        displayFlights(
            availableFlights,
            date,
            passengers,
            false
        );

    } else {

        // SEARCH NEXT 3 DAYS

        let alternativeFlights = [];

        for (let i = 1; i <= 3; i++) {

            const nextDate = getDateAfter(date, i);

            const nextDateString = [
                nextDate.getFullYear(),
                String(nextDate.getMonth() + 1).padStart(2, "0"),
                String(nextDate.getDate()).padStart(2, "0")
            ].join("-");

            matchingFlights.forEach(function(flight) {

                if (flight.availableDays.includes(nextDate.getDay())) {

                    alternativeFlights.push({
                        ...flight,
                        alternativeDate: nextDateString
                    });

                }

            });

        }

        if (alternativeFlights.length > 0) {

            results.innerHTML = `
                <div class="no-flights">
                    <h2>No Flights Available!</h2>
                    <p>
                        No flights found for ${formatDate(selectedDate)}.
                    </p>
                    <h3>Here Are Alternative Flights</h3>
                    <p>We found these options for the next 3 days.</p>
                </div>
            `;

            alternativeFlights.forEach(function(flight, index) {

                displaySingleFlight(
                    flight,
                    flight.alternativeDate,
                    passengers,
                    index,
                    true
                );


            });

        } else {

            results.innerHTML = `
                <div class="no-flights">
                    <h2>No Flights Found!</h2>
                    <p>
                        No demo flights are available for this
                        route in the next 3 days.
                    </p>
                    <p>Please try another route or date.</p>
                </div>
            `;

        }

    }

    results.scrollIntoView({ behavior: "smooth" });

});



// STORE CURRENT FLIGHT SEARCH

let currentFlightList = [];
let currentSearchDate = "";
let currentPassengers = 1;
let currentAlternative = false;


// DISPLAY NORMAL FLIGHTS

function displayFlights(flightList, date, passengers, alternative) {

    currentFlightList = flightList;
    currentSearchDate = date;
    currentPassengers = passengers;
    currentAlternative = alternative;

    let filteredFlights = [...flightList];

    // AIRLINE FILTER
    const airline = document.getElementById("airlineFilter").value;

    if (airline !== "all") {
        filteredFlights = filteredFlights.filter(function(flight) {
            return flight.airline === airline;
        });
    }

    // PRICE FILTER
    const price = document.getElementById("priceFilter").value;

    if (price === "low") {
        filteredFlights.sort((a, b) => a.price - b.price);
    }

    if (price === "high") {
        filteredFlights.sort((a, b) => b.price - a.price);
    }

    // DEPARTURE TIME FILTER
    const time = document.getElementById("timeFilter").value;

    if (time !== "all") {

        filteredFlights = filteredFlights.filter(function(flight) {

            let hour = parseInt(flight.departure);

            const isPM = flight.departure.includes("PM");

            if (isPM && hour !== 12) hour += 12;
            if (!isPM && hour === 12) hour = 0;

            if (time === "morning") return hour < 12;
            if (time === "afternoon") return hour >= 12 && hour < 17;
            if (time === "evening") return hour >= 17;

        });
    }

    results.innerHTML = `
        <h2 class="result-heading">Available Flights</h2>
        <p class="result-date">
            Travel Date: ${formatDate(new Date(date + "T00:00:00"))}
        </p>
    `;

    if (filteredFlights.length === 0) {
        results.innerHTML += "<p>No flights match your selected filters.</p>";
        return;
    }

    filteredFlights.forEach(function(flight, index) {

        displaySingleFlight(
            flight,
            date,
            passengers,
            index,
            alternative
        );

    });

}


// DISPLAY ONE FLIGHT

function displaySingleFlight(
    flight,
    date,
    passengers,
    index,
    alternative
) {

    const totalPrice = flight.price * passengers;

    const card = document.createElement("div");
    card.className = "flight-card";

    const airline = document.createElement("div");
    airline.className = "flight-info";

    const airlineName = document.createElement("h3");
    airlineName.textContent = "✈ " + flight.airline;

    const route = document.createElement("p");
    route.textContent = flight.from + " → " + flight.to;

    airline.append(airlineName, route);

    const departure = document.createElement("div");
    departure.className = "flight-time";

    const departureTime = document.createElement("h3");
    departureTime.textContent = flight.departure;

    const departureLabel = document.createElement("p");
    departureLabel.textContent = "Departure";

    departure.append(departureTime, departureLabel);

    const arrival = document.createElement("div");
    arrival.className = "flight-time";

    const arrivalTime = document.createElement("h3");
    arrivalTime.textContent = flight.arrival;

    const arrivalLabel = document.createElement("p");
    arrivalLabel.textContent = "Arrival";

    arrival.append(arrivalTime, arrivalLabel);

    const price = document.createElement("div");
    price.className = "flight-price";

    const priceHeading = document.createElement("h3");
    priceHeading.textContent =
        "Rs. " + totalPrice.toLocaleString("en-PK");

    const passengerLabel = document.createElement("p");
    passengerLabel.textContent = passengers + " Passenger(s)";

    const dateLabel = document.createElement("p");
    dateLabel.textContent =
        "Date: " + formatDate(new Date(date + "T00:00:00"));

    price.append(priceHeading, passengerLabel, dateLabel);

    const bookButton = document.createElement("button");
bookButton.type = "button";
bookButton.textContent = "Book Now";
    // VIEW FLIGHT DETAILS BUTTON

const detailsButton = document.createElement("button");
detailsButton.type = "button";
detailsButton.textContent = "View Details";
detailsButton.className = "details-button";

detailsButton.addEventListener("click", function() {
    showFlightDetails(flight, date, passengers);
});
    bookButton.addEventListener("click", function() {
        bookFlight(flight, date, passengers);
    });

    card.append(
    airline,
    departure,
    arrival,
    price,
    detailsButton,
    bookButton
);

    results.appendChild(card);
}
// SHOW FLIGHT DETAILS POPUP

function showFlightDetails(flight, date, passengers) {

    const modal = document.getElementById("flightDetailsModal");

    document.getElementById("detailsAirline").textContent =
        flight.airline + " - Flight Experience";

    document.getElementById("detailsRoute").textContent =
        flight.from + " → " + flight.to;

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";

    // BOOK THIS FLIGHT BUTTON
    const bookButton = document.getElementById("detailsBookButton");

    if (bookButton) {
        bookButton.onclick = function () {
            closeFlightDetails();
            bookFlight(flight, date, passengers);
        };
    }
}


// CLOSE FLIGHT DETAILS POPUP

function closeFlightDetails() {

    const modal = document.getElementById("flightDetailsModal");

    modal.style.display = "none";
    document.body.style.overflow = "auto";

}


// CLOSE POPUP WHEN CLICKING OUTSIDE

document.getElementById("flightDetailsModal").addEventListener("click", function(event) {

    if (event.target === this) {
        closeFlightDetails();
    }

});


// CLOSE POPUP WITH ESCAPE KEY

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        closeFlightDetails();
    }

});

// BOOK FLIGHT AND SHOW E-TICKET

function bookFlight(flight, date, passengers) {

    const passengerName = prompt("Enter Passenger Name:");

    if (!passengerName || !passengerName.trim()) {
        alert("Please enter passenger name!");
        return;
    }

    const booking = {
        bookingId: "SB" + Date.now(),
        passenger: passengerName.trim(),
        airline: flight.airline,
        from: flight.from,
        to: flight.to,
        date: date,
        departure: flight.departure,
        arrival: flight.arrival,
        passengers: passengers,
        price: flight.price * passengers
    };

    localStorage.setItem(
        "skybookBooking",
        JSON.stringify(booking)
    );

    showTicket(booking);
}


// SHOW TICKET

function showTicket(booking) {

    const ticketModal = document.getElementById("ticketModal");
    const ticketContent = document.getElementById("ticketContent");

    function safe(value) {
        return String(value).replace(/[&<>"']/g, function(char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[char];
        });
    }

    const travelDate = new Date(booking.date + "T00:00:00");

    const formattedDate = travelDate.toLocaleDateString("en-PK", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    ticketContent.innerHTML = `
        <div class="ticket">

            <div class="ticket-banner">
                <div class="ticket-brand">
                    <span>✈</span> SKYBOOK
                </div>

                <span class="demo-label">DEMO TICKET</span>

                <div class="banner-text">
                    <h2>Your Journey Begins Here.</h2>
                    <p>Travel beyond limits with SkyBook.</p>
                </div>
            </div>

            <div class="ticket-body">

                <div class="ticket-route">
                    <div>
                        <small>FROM</small>
                        <h2>${safe(booking.from)}</h2>
                        <p>Departure</p>
                    </div>

                    <div class="route-plane">✈</div>

                    <div>
                        <small>TO</small>
                        <h2>${safe(booking.to)}</h2>
                        <p>Destination</p>
                    </div>
                </div>

                <div class="ticket-photo">
                    <img
                        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1000"
                        alt="Airplane flying above clouds">
                </div>

                <div class="ticket-details">

                    <div>
                        <small>PASSENGER NAME</small>
                        <strong>${safe(booking.passenger)}</strong>
                    </div>

                    <div>
                        <small>AIRLINE</small>
                        <strong>${safe(booking.airline)}</strong>
                    </div>

                    <div>
                        <small>TRAVEL DATE</small>
                        <strong>${safe(formattedDate)}</strong>
                    </div>

                    <div>
                        <small>PASSENGERS</small>
                        <strong>${safe(booking.passengers)}</strong>
                    </div>

                    <div>
                        <small>DEPARTURE</small>
                        <strong>${safe(booking.departure)}</strong>
                    </div>

                    <div>
                        <small>ARRIVAL</small>
                        <strong>${safe(booking.arrival)}</strong>
                    </div>

                    <div>
                        <small>BOOKING ID</small>
                        <strong>${safe(booking.bookingId)}</strong>
                    </div>

                    <div>
                        <small>TOTAL PRICE</small>
                        <strong>Rs. ${booking.price.toLocaleString("en-PK")}</strong>
                    </div>

                </div>

                <div class="ticket-bottom">

                    <div>
                        <h3>Have a Wonderful Journey!</h3>
                        <p>This is a sample demo booking ticket.</p>
                        <p>Not valid for actual air travel.</p>
                    </div>

                    <div class="fake-qr">
                        <div class="qr-pattern"></div>
                        <small>DEMO CODE</small>
                    </div>

                </div>

            </div>

        </div>
    `;

    ticketModal.style.display = "flex";
    document.body.style.overflow = "hidden";
}


// CLOSE TICKET

function closeTicket() {

    document.getElementById("ticketModal").style.display = "none";
    document.body.style.overflow = "auto";

}

// DESTINATION GALLERY DATA

const destinationData = {
Dubai: {
    description: "Discover the beauty, luxury and amazing skyline of Dubai.",

    about: "Dubai is a modern city in the United Arab Emirates, famous for its impressive skyscrapers, luxury shopping, beautiful beaches and exciting attractions.",

    places: [
        "Burj Khalifa",
        "Palm Jumeirah",
        "Dubai Mall",
        "Dubai Marina",
        "Museum of the Future"
    ],

    images: [
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900",
        "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=900",
        "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=900",
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=900"
    ]
},

    Istanbul: {
    description: "Explore historic architecture and beautiful streets of Istanbul.",

    about: "Istanbul is a beautiful city in Turkey, famous for its rich history, stunning architecture and unique culture.",

    places: [
        "Hagia Sophia",
        "Blue Mosque",
        "Galata Tower",
        "Topkapi Palace"
    ],

    images: [
        "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=900",
        "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=900",
        "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=900",
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=900"
    ]


    },

    
Paris: {
    description: "Experience the beauty, culture and iconic landmarks of Paris.",

    about: "Paris is the capital of France, famous for its beautiful architecture, art, fashion, charming streets and world-famous landmarks.",

    places: [
        "Eiffel Tower",
        "Louvre Museum",
        "Arc de Triomphe",
        "Notre-Dame Cathedral",
        "Palace of Versailles"
    ],

    images: [
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900",
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=900",
        "https://images.unsplash.com/photo-1503917988258-f87a78e3c995?w=900",
        "https://images.unsplash.com/photo-1494587416117-f102a2ac0a8d?w=900"
    ]
},


    Karachi: {
        description: "Discover the lively coastal city of Karachi, Pakistan.",
        images: [
            "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=900",
            "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=900",
            "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=900",
            "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900"
        ]
    },

    Lahore: {
        description: "Explore the history, culture and beautiful landmarks of Lahore.",
        images: [
            "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=900",
            "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=900",
            "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=900",
            "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=900"
        ]
    },

    Islamabad: {
        description: "Enjoy the peaceful beauty and green landscapes of Islamabad.",
        images: [
            "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=900",
            "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=900",
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900",
            "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=900"
        ]
    },

    Skardu: {
        description: "Discover the breathtaking mountains and lakes of Skardu.",
        images: [
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900",
            "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900",
            "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=900",
            "https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=900"
        ]
    }
};


// OPEN DESTINATION POPUP

function openDestination(city) {

    const data = destinationData[city];

    if (!data) {
        alert("Gallery for this destination is coming soon!");
        return;
    }

    document.getElementById("popupTitle").textContent = city;

    document.getElementById("popupDescription").textContent =
        data.description;
        document.getElementById("popupAbout").textContent =
    data.about || "More information coming soon.";

const placesList = document.getElementById("popupPlaces");

placesList.innerHTML = "";

(data.places || []).forEach(function(place) {
    const li = document.createElement("li");
    li.textContent = place;
    placesList.appendChild(li);
});

    const gallery = document.getElementById("popupGallery");

    gallery.innerHTML = "";

    data.images.forEach(function(imageUrl, index) {

        const img = document.createElement("img");

        img.src = imageUrl;
        img.alt = city + " destination photo " + (index + 1);
        img.loading = "lazy";

        gallery.appendChild(img);

    });

    document.getElementById("destinationModal").style.display = "flex";

}


// CLOSE POPUP

function closeDestination() {

    document.getElementById("destinationModal").style.display = "none";

}


// MAKE DESTINATION CARDS CLICKABLE

document.querySelectorAll(".destination-card").forEach(function(card) {

    card.addEventListener("click", function() {

        const city = card.querySelector("h3").textContent.trim();

        openDestination(city);

    });

});


// EXPLORE FLIGHTS BUTTON

document.getElementById("exploreFlights").addEventListener("click", function() {

    const city = document.getElementById("popupTitle").textContent;

    const destinationSelect = document.getElementById("to");

    destinationSelect.value = city;

    closeDestination();

    document.getElementById("flights").scrollIntoView({
        behavior: "smooth"
    });

});


// CLOSE POPUP WHEN CLICKING OUTSIDE

document.getElementById("destinationModal").addEventListener("click", function(event) {

    if (event.target === this) {
        closeDestination();
    }

});

// VIEW SAVED BOOKING

function viewSavedBooking() {

    const savedBooking = localStorage.getItem("skybookBooking");

    if (!savedBooking) {
        alert("You have no saved bookings yet!");
        return;
    }

    const booking = JSON.parse(savedBooking);

    showTicket(booking);
}

// FILTER CHANGE EVENTS

document.getElementById("priceFilter").addEventListener("change", function() {
    if (currentFlightList.length > 0) {
        displayFlights(currentFlightList, currentSearchDate, currentPassengers, currentAlternative);
    }
});

document.getElementById("airlineFilter").addEventListener("change", function() {
    if (currentFlightList.length > 0) {
        displayFlights(currentFlightList, currentSearchDate, currentPassengers, currentAlternative);
    }
});

document.getElementById("timeFilter").addEventListener("change", function() {
    if (currentFlightList.length > 0) {
        displayFlights(currentFlightList, currentSearchDate, currentPassengers, currentAlternative);
    }
});

// SKYBOOK LIVE WEATHER

const weatherCities = {
    Istanbul: { name: "Istanbul, Turkey", lat: 41.0082, lon: 28.9784 },
    Dubai: { name: "Dubai, UAE", lat: 25.2048, lon: 55.2708 },
    Paris: { name: "Paris, France", lat: 48.8566, lon: 2.3522 },
    Quetta: { name: "Quetta, Pakistan", lat: 30.1798, lon: 66.9750 },
    Karachi: { name: "Karachi, Pakistan", lat: 24.8607, lon: 67.0011 },
    Lahore: { name: "Lahore, Pakistan", lat: 31.5204, lon: 74.3587 },
    London: { name: "London, UK", lat: 51.5072, lon: -0.1276 },
    Islamabad: { name: "Islamabad, Pakistan", lat: 33.6844, lon: 73.0479 },
    Skardu: { name: "Skardu, Pakistan", lat: 35.2971, lon: 75.6333 }
};


// WEATHER DESCRIPTION

function getWeatherInfo(code) {

    if (code === 0) return ["Clear Sky", "☀️"];
    if (code === 1) return ["Mostly Clear", "🌤️"];
    if (code === 2) return ["Partly Cloudy", "⛅"];
    if (code === 3) return ["Overcast", "☁️"];
    if (code === 45 || code === 48) return ["Foggy", "🌫️"];
    if (code >= 51 && code <= 55) return ["Drizzle", "🌦️"];
    if (code >= 61 && code <= 65) return ["Rainy", "🌧️"];
    if (code >= 71 && code <= 77) return ["Snowy", "❄️"];
    if (code >= 80 && code <= 82) return ["Rain Showers", "🌦️"];
    if (code >= 95) return ["Thunderstorm", "⛈️"];

    return ["Weather Update", "🌤️"];
}


// GET LIVE WEATHER

async function updateWeather(city) {

    const selectedCity = weatherCities[city];

    if (!selectedCity) return;

    document.getElementById("weatherCity").textContent = selectedCity.name;
    document.getElementById("weatherCondition").textContent = "Loading weather...";
    document.getElementById("weatherIcon").textContent = "🌤️";

    try {

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Weather data unavailable");
        }

        const data = await response.json();
        const current = data.current;

        const weather = getWeatherInfo(current.weather_code);

        document.getElementById("weatherTemp").textContent =
            Math.round(current.temperature_2m) + "°";

        document.getElementById("weatherCondition").textContent =
            weather[0];

        document.getElementById("weatherIcon").textContent =
            weather[1];

        document.getElementById("weatherHumidity").textContent =
            current.relative_humidity_2m + "%";

        document.getElementById("weatherWind").textContent =
            current.wind_speed_10m + " km/h";

        document.getElementById("weatherFeels").textContent =
            Math.round(current.apparent_temperature) + "°C";

    } catch (error) {

        document.getElementById("weatherCondition").textContent =
            "Weather data could not load. Please try again.";

    }
}


// CHANGE DESTINATION

document.getElementById("weatherCitySelect").addEventListener("change", function() {
    updateWeather(this.value);
});


// LOAD DEFAULT CITY

updateWeather("Istanbul");
