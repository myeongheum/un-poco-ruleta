import {
    loadState,
    saveState,
    getCollectionKey,
    getAutoRemoveKey,
} from "./store.js";
import { renderAll, renderList, renderAutoRemove } from "./render.js";
import { executeDraw } from "./draw.js";
import { exportToFile, setupImport } from "./io.js";

const state = loadState();

renderAll(state);
bindEvents();

function bindEvents() {
    document.querySelectorAll("[data-add]").forEach((btn) => {
        btn.addEventListener("click", () => addParticipant(btn.dataset.add));
    });

    document.querySelectorAll("[data-input]").forEach((input) => {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                addParticipant(input.dataset.input);
            }
        });
    });

    document.addEventListener("click", (e) => {
        const removeBtn = e.target.closest("[data-remove-role]");
        if (removeBtn) {
            removeParticipant(removeBtn.dataset.removeRole, removeBtn.dataset.removeName);
        }
    });

    document.querySelectorAll("[data-auto-remove]").forEach((cb) => {
        cb.addEventListener("change", () => {
            const role = cb.dataset.autoRemove;
            const key = getAutoRemoveKey(role);
            if (!key) return;
            state[key] = cb.checked;
            saveState(state);
            renderAutoRemove(state, role);
        });
    });

    document.getElementById("drawButton").addEventListener("click", () => {
        executeDraw(state);
    });

    document.getElementById("exportButton").addEventListener("click", () => {
        exportToFile(state);
    });

    setupImport((newState) => {
        Object.assign(state, newState);
        saveState(state);
        renderAll(state);
    });
}

function addParticipant(role) {
    const input = document.querySelector(`[data-input="${role}"]`);
    const name = input?.value.trim();
    if (!name) return;

    const key = getCollectionKey(role);
    state[key] = [...state[key], name];
    input.value = "";
    saveState(state);
    renderList(state, role);
    input.focus();
}

function removeParticipant(role, name) {
    const key = getCollectionKey(role);
    const before = state[key];
    state[key] = before.filter((n) => n !== name);
    if (state[key].length === before.length) return;
    saveState(state);
    renderList(state, role);
}
