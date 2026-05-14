import { ROLE_SYMBOLS } from "./store.js";

const FLIP_DURATION_MS = 2000;

const dialogEl = document.getElementById("resultDialog");
const cardsContainer = document.getElementById("resultCards");
const statusEl = document.getElementById("statusText");
const closeBtn = document.getElementById("closeButton");
const cardTemplate = document.getElementById("cardTemplate");

let revealIndex = 0;
let cardElements = [];
let isCloseEnabled = false;
let closeButtonTimer = null;

closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeDialog();
});

dialogEl.addEventListener("click", () => {
    revealNext();
});

document.addEventListener("keydown", (e) => {
    if (dialogEl.hidden) return;
    if (e.key === "Escape" && isCloseEnabled) closeDialog();
});

export function openResultDialog({ Leader, Follower, Orchestra }) {
    cancelCloseButtonTimer();
    revealIndex = 0;
    isCloseEnabled = false;
    statusEl.textContent = "Please Click to Reveal";
    closeBtn.hidden = true;

    cardsContainer.replaceChildren();
    cardElements = [];

    const entries = [
        ["Leader", Leader],
        ["Follower", Follower],
        ["Orchestra", Orchestra],
    ];

    for (const [role, name] of entries) {
        const card = buildCard(role, name);
        cardsContainer.appendChild(card);
        cardElements.push(card);
    }

    dialogEl.hidden = false;
}

function buildCard(role, name) {
    const card = cardTemplate.content.firstElementChild.cloneNode(true);
    card.dataset.role = role;
    card.dataset.flipped = "false";
    card.querySelector(".card__role").textContent = role;
    card.querySelector(".card__name").textContent = name;
    card.querySelector(".card__symbol").textContent = ROLE_SYMBOLS[role] ?? "";
    return card;
}

function revealNext() {
    if (isCloseEnabled) return;
    if (revealIndex >= cardElements.length) return;

    cardElements[revealIndex].dataset.flipped = "true";
    revealIndex++;

    if (revealIndex >= cardElements.length) {
        isCloseEnabled = true;
        statusEl.textContent = "The Destiny is Set.";
        closeButtonTimer = setTimeout(() => {
            closeBtn.hidden = false;
            closeButtonTimer = null;
        }, FLIP_DURATION_MS);
    }
}

function closeDialog() {
    cancelCloseButtonTimer();
    dialogEl.hidden = true;
}

function cancelCloseButtonTimer() {
    if (closeButtonTimer !== null) {
        clearTimeout(closeButtonTimer);
        closeButtonTimer = null;
    }
}
