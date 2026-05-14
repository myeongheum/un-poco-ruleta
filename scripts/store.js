const STORAGE_KEY = "unpoco-ruleta-settings";

export const ROLES = ["Leader", "Follower", "Orchestra"];

export const ROLE_SYMBOLS = {
    Leader: "♠",
    Follower: "♥️",
    Orchestra: "♣️",
};

const DEFAULT_STATE = Object.freeze({
    leaders: [],
    followers: [],
    orchestras: [],
    isAutoRemoveLeaders: true,
    isAutoRemoveFollowers: true,
    isAutoRemoveOrchestras: false,
});

export function getCollectionKey(role) {
    if (role === "Leader") return "leaders";
    if (role === "Follower") return "followers";
    if (role === "Orchestra") return "orchestras";
    return null;
}

export function getAutoRemoveKey(role) {
    if (role === "Leader") return "isAutoRemoveLeaders";
    if (role === "Follower") return "isAutoRemoveFollowers";
    if (role === "Orchestra") return "isAutoRemoveOrchestras";
    return null;
}

export function normalizeName(s) {
    if (typeof s !== "string") return "";
    return s.trim().replace(/\s+/g, " ").toLowerCase();
}

export function createState() {
    return {
        leaders: [],
        followers: [],
        orchestras: [],
        isAutoRemoveLeaders: DEFAULT_STATE.isAutoRemoveLeaders,
        isAutoRemoveFollowers: DEFAULT_STATE.isAutoRemoveFollowers,
        isAutoRemoveOrchestras: DEFAULT_STATE.isAutoRemoveOrchestras,
    };
}

export function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return createState();
        const parsed = JSON.parse(raw);
        return normalizeState(parsed);
    } catch (e) {
        console.warn("Failed to load state, using defaults", e);
        return createState();
    }
}

export function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state, null, 2));
    } catch (e) {
        console.error("Failed to save state", e);
    }
}

export function normalizeState(input) {
    const base = createState();
    if (!input || typeof input !== "object") return base;
    return {
        leaders: dedupeStrings(input.leaders),
        followers: dedupeStrings(input.followers),
        orchestras: dedupeStrings(input.orchestras),
        isAutoRemoveLeaders: toBool(input.isAutoRemoveLeaders, base.isAutoRemoveLeaders),
        isAutoRemoveFollowers: toBool(input.isAutoRemoveFollowers, base.isAutoRemoveFollowers),
        isAutoRemoveOrchestras: toBool(input.isAutoRemoveOrchestras, base.isAutoRemoveOrchestras),
    };
}

function dedupeStrings(arr) {
    if (!Array.isArray(arr)) return [];
    const seen = new Set();
    const out = [];
    for (const v of arr) {
        if (!isString(v)) continue;
        const key = normalizeName(v);
        if (key === "" || seen.has(key)) continue;
        seen.add(key);
        out.push(v.trim());
    }
    return out;
}

function isString(v) {
    return typeof v === "string" && v.trim().length > 0;
}

function toBool(v, fallback) {
    return typeof v === "boolean" ? v : fallback;
}
