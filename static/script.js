let foundEggs = 0;
const totalEggs = 21;
let countdownInterval;
let taskStatus = {
    weekday: false,
    math1: false,
    math2: false,
    math3: false,
    math4: false,
    math5: false,
    imageGuess: false,        // Status für die Frage mit dem Bild-Datum
    imageOrder: false,
    giftBoxOpened: false    // Status für die Frage mit der Bild-Reihenfolge
};

document.getElementById("found-eggs-count").textContent = 0;
document.getElementById("total-eggs-count").textContent = 21;
let mathAnswers = {}; // Objekt zum Speichern der Antworten für die Fragen

function startGame() {
    document.getElementById("tasks-container").classList.remove("hidden");
    document.getElementById("end-button").classList.remove("hidden");
    document.getElementById("start-button").classList.add("hidden");

    generateMathQuestions(); // Generiert zufällige Mathematikfragen
    startReactionTest(); // Startet den Reaktionstest

    document.getElementById("image-guess-container").classList.remove("hidden");
    document.getElementById("ordering-question-container").classList.remove("hidden");
    document.getElementById("gift-boxes-container").classList.remove("hidden");

    let timeLeft = 120; // 2 Minuten in Sekunden
    updateCountdownDisplay(timeLeft);

    countdownInterval = setInterval(() => {
        timeLeft--;
        updateCountdownDisplay(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            endGame(true); // Zeit abgelaufen
        }
    }, 1000);
}


// Funktion zum Generieren zufälliger Mathematikfragen
function generateMathQuestions() {
    for (let i = 1; i <= 5; i++) {
        const num1 = Math.floor(Math.random() * 50) + 1; // Zufällige Zahl zwischen 1 und 50
        const num2 = Math.floor(Math.random() * 50) + 1; // Zufällige Zahl zwischen 1 und 50
        let question, answer;

        // Abwechselnde Operationen
        switch (i) {
            case 1:
                question = `${num1} + ${num2}`;
                answer = num1 + num2;
                break;
            case 2:
                question = `${num1} - ${num2}`;
                answer = num1 - num2;
                break;
            case 3:
                question = `${num1} * ${num2}`;
                answer = num1 * num2;
                break;
            case 4:
                question = `${num1 * 2} / 2`; // Division mit einem garantierten ganzzahligen Ergebnis
                answer = num1;
                break;
            case 5:
                question = `(${num1} + ${num2}) * 2`;
                answer = (num1 + num2) * 2;
                break;
        }

        // Speichert die Frage und Antwort
        document.getElementById(`question-${i}`).textContent = `${i + 1}. Was ist ${question}?`;
        mathAnswers[`math${i}`] = answer; // Antwort speichern
    }
}

function updateCountdownDisplay(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById("countdown-display").textContent = `Zeit: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function endGame(timeExpired = false) {
    clearInterval(countdownInterval);

    if (foundEggs === maxEasterEggs) {
        displayWinMessage(); // Zeigt die Gewinnmeldung an, wenn alle Eggs gefunden wurden
    } else {
        const message = timeExpired ? "Zeit abgelaufen! Du hast nicht alle Easter Eggs gefunden." : "Du hast das Spiel beendet, aber nicht alle Easter Eggs gefunden.";
        alert(message);
        resetGame();
    }

    clearEasterEggs(); // Entfernt alle verbleibenden Easter Eggs vom Bildschirm
}


// Spiel zurücksetzen
function resetGame() {
    document.getElementById("tasks-container").classList.add("hidden");
    document.getElementById("end-button").classList.add("hidden");
    document.getElementById("start-button").classList.remove("hidden");
    document.getElementById("countdown-display").textContent = "Zeit: 2:00";
    foundEggs = 0;
    taskStatus = { weekday: false, math1: false, math2: false, math3: false, math4: false, math5: false };
    mathAnswers = {}; // Antworten zurücksetzen
    document.getElementById("found-eggs-count").textContent = foundEggs;

    // Eingabefelder leeren
    for (let i = 1; i <= 5; i++) {
        const input = document.getElementById(`math-answer-${i}`);
        if (input) {
            input.value = "";
        }
    }

    // Alle Aufgaben anzeigen
    document.getElementById("math-tasks-container").classList.remove("hidden");
    const tasks = document.querySelectorAll(".task");
    tasks.forEach((task) => {
        task.classList.remove("hidden");
    });

    // Container für Easter Eggs leeren
    document.getElementById("easterEggContainer").innerHTML = "";
}

// Funktion zur Anzeige eines Easter Eggs
function showEasterEgg() {
    const egg = document.createElement("div");
    egg.classList.add("easter-egg");
    egg.innerHTML = "🐣";
    egg.style.left = Math.random() * (document.body.clientWidth - 50) + "px";
    egg.style.top = Math.random() * (document.body.clientHeight - 50) + "px";
    egg.style.fontSize = "2em";
    egg.style.cursor = "pointer";
    egg.addEventListener("click", () => {
        egg.style.display = "none";
        incrementEggCounter();
    });
    document.body.appendChild(egg);
}

// Funktion zum Inkrementieren des lokalen Egg-Zählers
const maxEasterEggs = 21;

function incrementEggCounter() {
    foundEggs += 1;
    document.getElementById("found-eggs-count").textContent = foundEggs;
    if (foundEggs >= maxEasterEggs) {
        displayFinalButton(); // Zeigt die Gewinnmeldung an
    }
}

// Zeigt den finalen Button an, wenn alle Easter Eggs gefunden wurden
function displayFinalButton() {
    document.getElementById("infotxt").classList.add("hidden");
    document.getElementById("tasks-container").classList.add("hidden");
    document.getElementById("egg-counter").classList.add("hidden");
    document.getElementById("countdown-display").classList.add("hidden");
    document.getElementById("end-button").classList.add("hidden");
    document.getElementById("final-container").classList.remove("hidden");
}

// Funktion zum Entfernen aller verbleibenden Easter Eggs
function clearEasterEggs() {
    const easterEggs = document.querySelectorAll(".easter-egg, .floating-image");
    easterEggs.forEach(egg => egg.remove());
}

// Zeigt die finale Nachricht an
function showFinalMessage() {
    document.getElementById("final-button").classList.add("hidden");
    document.getElementById("final-message").classList.remove("hidden");
}

let reactionStartTime; // Speichert den Startzeitpunkt
let reactionTimeout; // Timeout für das 500-Millisekunden-Zeitlimit

// Funktion zum Starten des Reaktionstests
function startReactionTest() {
    const reactionContainer = document.getElementById("reaction-test");
    const reactionButton = document.getElementById("reaction-button");
    const resultText = document.getElementById("reaction-result");

    // Setzt das Spiel zurück
    reactionContainer.classList.remove("hidden");
    resultText.textContent = "";
    reactionButton.classList.add("hidden");

    // Wartet ein zufälliges Zeitintervall zwischen 1 und 3 Sekunden
    const randomDelay = Math.random() * 2000 + 1000;
    setTimeout(() => {
        reactionButton.classList.remove("hidden"); // Zeigt den Button an
        reactionStartTime = new Date().getTime(); // Speichert den Startzeitpunkt

        // Setzt ein 500-Millisekunden-Zeitlimit
        reactionTimeout = setTimeout(() => {
            reactionButton.classList.add("hidden"); // Versteckt den Button
            resultText.textContent = "Zu langsam! Versuche es nochmal!";
            startReactionTest(); // Startet den Test erneut
        }, 500); // 500 Millisekunden Zeitlimit
    }, randomDelay);
}

// Funktion, die beim Klicken auf den Reaktions-Button aufgerufen wird
function handleReactionClick() {
    const reactionButton = document.getElementById("reaction-button");
    const resultText = document.getElementById("reaction-result");

    const reactionEndTime = new Date().getTime(); // Endzeitpunkt
    const reactionTime = reactionEndTime - reactionStartTime; // Berechnete Reaktionszeit

    clearTimeout(reactionTimeout); // Entfernt das Zeitlimit, da der Benutzer geklickt hat
    reactionButton.classList.add("hidden"); // Versteckt den Button

    if (reactionTime <= 500) {
        // Erfolgreiche Reaktion innerhalb des Zeitlimits
        resultText.textContent = `Reaktionszeit: ${reactionTime} ms - Gut gemacht! Ein Easter Egg wurde aktiviert!`;
        showEasterEgg(); // Zeigt ein Easter Egg an
    } else {
        // Falls das Zeitlimit überschritten wurde
        resultText.textContent = "Zu langsam! Versuche es nochmal!";
        startReactionTest(); // Startet den Test erneut
    }
}

// Richtige Antwort für das Bild
const correctMonth = "Oktober"; // Beispielmonat (Schreiben Sie den Monat groß, um eine einheitliche Überprüfung zu ermöglichen)

// Funktion zur Überprüfung der Eingabe
function checkImageGuess() {
if (taskStatus.imageGuess) {
        document.getElementById("image-guess-result").textContent = "Diese Aufgabe wurde bereits gelöst!";
        return;
    }

    const userMonth = document.getElementById("guess-month").value.trim();

    const resultText = document.getElementById("image-guess-result");

    if (userMonth.toLowerCase() === correctMonth.toLowerCase()) {
        resultText.textContent = "Richtig! Das Bild wurde im " + correctMonth + " aufgenommen.";
        showEasterEgg(); // Zeigt ein Easter Egg an
        taskStatus.imageGuess = true; // Markiert die Frage als gelöst
    } else {
        resultText.textContent = "Leider falsch. Versuche es nochmal!";
    }
}

const correctOrder = ["image1", "image2", "image3", "image4", "image5"]; // Richtige Reihenfolge
let draggedElement = null; // Variable für das aktuell gezogene Element

// Initialisiert die Drag-and-Drop-Funktionalität
function initializeDragAndDrop() {
    const images = document.querySelectorAll(".draggable-image");
    images.forEach((image) => {
        image.addEventListener("dragstart", dragStart);
        image.addEventListener("dragover", dragOver);
        image.addEventListener("drop", drop);
    });
}

// Funktion zur Bestätigung der Geschenkbox-Auswahl
function confirmGiftSelection(boxNumber) {
if (taskStatus.giftBoxOpened) {
        alert("Du hast bereits eine Geschenkbox geöffnet! Du kannst keine weitere öffnen.");
        return;
    }
    const userConfirmed = confirm("Möchtest du wirklich diese Geschenkbox öffnen?");

    if (userConfirmed) {
        taskStatus.giftBoxOpened = true;

        switch (boxNumber) {
            case 1:
                showFloatingImages("/static/peppa.jpg", 8); // Zeigt 8 Peppa Pig-Bilder
                break;
            case 2:
                showFloatingImages("/static/hello.jpg", 8); // Zeigt 8 Hello Kitty-Bilder
                break;
            case 3:
                showFloatingImages("/static/aduni.jpg", 8); // Zeigt 8 Bilder des Benutzers
                break;
        }

        // Markiert die Box als gelöst
        taskStatus[`giftBox${boxNumber}Selected`] = true;
    }
}

// Funktion zum Anzeigen der schwebenden Bilder an zufälligen Positionen
function showFloatingImages(imageSrc, count) {
    const container = document.createElement("div");
    container.style.position = "relative";
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
        const floatingImage = document.createElement("img");
        floatingImage.src = imageSrc;
        floatingImage.classList.add("floating-image");

        // Zufällige Positionierung der Bilder auf der Seite
        floatingImage.style.left = Math.random() * (window.innerWidth - 50) + "px"; // Breite anpassen
        floatingImage.style.top = Math.random() * (window.innerHeight - 50) + "px"; // Höhe anpassen

        // Event-Handler zum Zählen der geklickten Bilder
        floatingImage.addEventListener("click", () => {
            floatingImage.style.display = "none"; // Entfernt das Bild beim Klicken
            incrementEggCounter(); // Zählt das Bild als "Easter Egg"
        });

        container.appendChild(floatingImage);
    }
}

function dragStart(event) {
    draggedElement = event.target;
    event.target.classList.add("dragging");

    // Erstellen eines Ghost-Images und verhindern, dass das Originalbild vergrößert wird
    const ghostImage = document.createElement("img");
    ghostImage.src = draggedElement.src;
    ghostImage.style.width = "50px"; // Setzen Sie die gewünschte Ghost-Image-Größe
    ghostImage.style.height = "auto";
    document.body.appendChild(ghostImage);

    // Ghost-Image als Drag-Bild setzen und anschließend entfernen
    event.dataTransfer.setDragImage(ghostImage, 25, 25);
    setTimeout(() => ghostImage.remove(), 0); // Entfernt das Ghost-Image sofort

    event.dataTransfer.setData("text/plain", event.target.id); // Stellt sicher, dass das Element im Drop erkannt wird
}


function dragOver(event) {
    event.preventDefault();
    const container = document.getElementById("image-order-container");
    const afterElement = getDragAfterElement(container, event.clientX);
    if (afterElement == null) {
        container.appendChild(draggedElement);
    } else {
        container.insertBefore(draggedElement, afterElement);
    }
}

function drop(event) {
    event.target.classList.remove("dragging");
    draggedElement = null;
}

// Hilfsfunktion, um die Position des gezogenen Elements im Container zu bestimmen
function getDragAfterElement(container, x) {
    const draggableElements = [...container.querySelectorAll(".draggable-image:not(.dragging)")];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Überprüft, ob die Reihenfolge der Bilder korrekt ist
function checkImageOrder() {
 if (taskStatus.imageOrder) {
        document.getElementById("ordering-result").textContent = "Diese Aufgabe wurde bereits gelöst!";
        return;
    }
    const images = document.querySelectorAll("#image-order-container .draggable-image");
    const userOrder = Array.from(images).map((img) => img.id);

    const resultText = document.getElementById("ordering-result");

    if (JSON.stringify(userOrder) === JSON.stringify(correctOrder)) {
        resultText.textContent = "Richtig! Du hast die Bilder in der korrekten Reihenfolge angeordnet. Sechs Easter Eggs wurden aktiviert!";

        // Zeigt sechs Easter Eggs an
        for (let i = 0; i < 6; i++) {
            showEasterEgg();
        }
        taskStatus.imageOrder = true; // Markiert die Frage als gelöst

    } else {
        resultText.textContent = "Leider ist die Reihenfolge falsch. Versuche es nochmal!";
    }
}


// Startet Drag-and-Drop-Funktionalität, wenn die Seite geladen wird
document.addEventListener("DOMContentLoaded", initializeDragAndDrop);




// Fragen- und Aufgabenlogik
function checkWeekday(day) {
    if (!taskStatus.weekday && day === "freitag") {
        alert("Richtig! Ein Easter Egg ist aktiviert!");
        showEasterEgg();
        taskStatus.weekday = true;
    } else if (taskStatus.weekday) {
        alert("Diese Frage wurde bereits gelöst!");
    } else {
        alert("Falsch, versuch es nochmal!");
    }
}

// Überprüft die Antwort jeder Matheaufgabe
function checkMathAnswer(taskNumber) {
    const userAnswer = parseInt(document.getElementById(`math-answer-${taskNumber}`).value);
    const correctAnswer = mathAnswers[`math${taskNumber}`];

    if (!taskStatus[`math${taskNumber}`] && userAnswer === correctAnswer) {
        alert("Richtig! Ein weiteres Easter Egg ist aktiviert!");
        showEasterEgg();
        taskStatus[`math${taskNumber}`] = true;
    } else if (taskStatus[`math${taskNumber}`]) {
        alert("Diese Frage wurde bereits gelöst!");
    } else {
        alert("Falsch, versuch es nochmal!");
    }
}
