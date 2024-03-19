const pokemonDisplay = document.querySelector('#pokemonDisplay');
const quizContainer = document.querySelector('#quizContainer');
const fetchUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151&offset=0';

async function fetchPokemon(url) {
     try {
         let response = await fetch(url);
         let data = await response.json();
         // add the pokemon to local storage
        localStorage.setItem('pokemon', JSON.stringify(data.results));
     }
     catch (error) {
         console.log(error);
     }
 }

 //call the function, if local storage pokemon is empty
 if (!localStorage.getItem('pokemon')) {
    fetchPokemon(fetchUrl);
}

// display a random pokemon as a function
async function displayRandomPokemon() {
    const pokemon = JSON.parse(localStorage.getItem('pokemon'));
    const randomIndex = Math.floor(Math.random() * pokemon.length);
    const selectedPokemon = pokemon[randomIndex];
    const pokeDescription = await generateDescription(selectedPokemon.name);
    fillQuizContainer(selectedPokemon.name);
    pokemonDisplay.innerHTML = `Hier die Beschreibung des Pokemons: ${pokeDescription}`;
}

displayRandomPokemon();


async function generateDescription(pokemonName) {
    // Replace 'YOUR_API_KEY' with your actual API key
    const apiKey = 'API KEY HERE';
    const apiUrl = `https://api.openai.com/v1/chat/completions`;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo-0125',
            messages: [
                {
                    role: 'user',
                    content: `Erstelle drei Adjektive für dieses Pokemon: ${pokemonName}. Nutze dabei nicht den Namen des Pokemons.`
                }
            ]
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

function fillQuizContainer(correctPokemonName) {
    const pokemon = JSON.parse(localStorage.getItem('pokemon'));
    let options = [correctPokemonName]; // Beginne mit der richtigen Antwort

    // Füge drei zufällige falsche Antworten hinzu
    while (options.length < 4) {
        const randomIndex = Math.floor(Math.random() * pokemon.length);
        const pokemonName = pokemon[randomIndex].name;
        if (!options.includes(pokemonName)) {
            options.push(pokemonName);
        }
    }

    // Mische die Optionen
    options = options.sort(() => Math.random() - 0.5);

    // Erstelle die Buttons im Quiz-Container
    quizContainer.innerHTML = ''; // Leere den Container für neue Fragen
    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.addEventListener('click', () => checkAnswer(option, correctPokemonName));
        quizContainer.appendChild(button);
    });
}

function checkAnswer(selectedOption, correctOption) {
    if (selectedOption === correctOption) {
        alert('Richtig! 🎉');
    } else {
        alert('Falsch. 😢 Versuche es erneut!');
    }
    // Optional: Aktualisiere das Quiz nach der Antwort oder füge weitere Logik hinzu
}