const flagElement = document.getElementById('flag');
const optionsContainer = document.getElementById('options-container');
const correctScoreElement = document.getElementById('correct-score');
const wrongScoreElement = document.getElementById('wrong-score');
const resultsContainer = document.getElementById('results-container');
const restartButton = document.getElementById('restart-btn');

let score = 0;
let wrongScore = 0;
let currentQuestion = 0;
const totalQuestions = 10;
let countriesData = [];

async function fetchCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const countries = await response.json();
        return countries;
    } catch (error) {
        console.error('Error fetching country data:', error);
        optionsContainer.innerHTML = '<p>Failed to load countries. Please try again later.</p>';
        flagElement.src = '';
        return [];
    }
}

async function startQuiz() {
    countriesData = await fetchCountries();
    if (countriesData.length === 0) {
        return;
    }
    score = 0;
    wrongScore = 0;
    currentQuestion = 0;
    updateScore();
    resultsContainer.classList.add('hidden');
    displayNextQuestion();
}

function displayNextQuestion() {
    if (currentQuestion >= totalQuestions) {
        showResults();
        return;
    }
    currentQuestion++;

    const randomCountry = countriesData[Math.floor(Math.random() * countriesData.length)];
    flagElement.src = randomCountry.flags.png;

    const options = generateOptions(countriesData, randomCountry);

    optionsContainer.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option.name.common;
        button.onclick = () => checkAnswer(button, option, randomCountry);
        optionsContainer.appendChild(button);
    });

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next flag';
    nextButton.className = 'next-button hidden';
    nextButton.onclick = () => displayNextQuestion();
    optionsContainer.appendChild(nextButton);
}

function generateOptions(countries, correctCountry) {
    const options = [correctCountry];
    while (options.length < 4) {
        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
        if (!options.includes(randomCountry)) {
            options.push(randomCountry);
        }
    }
    return shuffleArray(options);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function checkAnswer(button, selectedOption, correctCountry) {
    if (selectedOption === correctCountry) {
        score++;
        button.style.backgroundColor = 'lightgreen';

        const correctIcon = document.createElement('i');
        correctIcon.className = 'fa fa-check right-icon';
        button.appendChild(correctIcon);

    } else {
        wrongScore++;
        button.style.backgroundColor = 'lightcoral';

        const wrongIcon = document.createElement('i');
        wrongIcon.className = 'fa fa-times wrong-icon';
        button.appendChild(wrongIcon);
    }
    updateScore();
    disableOptions();
}

function disableOptions() {
    const buttons = document.querySelectorAll('.option');

    buttons.forEach(button => {
        button.disabled = true;
    });
    const nextButton = document.querySelector('.next-button');
    
    if (nextButton) {
        nextButton.classList.remove('hidden');
    }
}

function updateScore() {
    correctScoreElement.textContent = score;
    wrongScoreElement.textContent = wrongScore;
}

function showResults() {
    window.location.href = `results.html?score=${score}&totalQuestions=${totalQuestions}`;
}

restartButton.onclick = startQuiz;

startQuiz();
