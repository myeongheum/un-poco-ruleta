import { ROLES, getCollectionKey, getAutoRemoveKey } from "./store.js";

const participantTemplate = document.getElementById("participantTemplate");

export function renderAll(state) {
    for (const role of ROLES) {
        renderList(state, role);
        renderAutoRemove(state, role);
    }
}

export function renderList(state, role) {
    const listEl = document.querySelector(`[data-list="${role}"]`);
    if (!listEl) return;

    const collection = state[getCollectionKey(role)] ?? [];

    listEl.replaceChildren();
    for (const name of collection) {
        listEl.appendChild(buildItem(role, name));
    }
}

export function renderAutoRemove(state, role) {
    const key = getAutoRemoveKey(role);
    const input = document.querySelector(`[data-auto-remove="${role}"]`);
    if (!input || !key) return;
    input.checked = Boolean(state[key]);
}

function buildItem(role, name) {
    const li = participantTemplate.content.firstElementChild.cloneNode(true);
    li.querySelector(".participant-item__name").textContent = name;

    const removeBtn = li.querySelector(".participant-item__remove");
    removeBtn.dataset.removeRole = role;
    removeBtn.dataset.removeName = name;
    removeBtn.title = `Remove ${name}`;

    return li;
}
