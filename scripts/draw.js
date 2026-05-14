import { saveState, ROLES } from "./store.js";
import { renderList } from "./render.js";
import { openResultDialog } from "./dialog.js";

export function executeDraw(state) {
    if (state.leaders.length === 0 || state.followers.length === 0 || state.orchestras.length === 0) {
        return;
    }

    const pickedLeader = pickRandom(state.leaders);
    const pickedFollower = pickRandom(state.followers);
    const pickedOrchestra = pickRandom(state.orchestras);

    openResultDialog({
        Leader: pickedLeader,
        Follower: pickedFollower,
        Orchestra: pickedOrchestra,
    });

    let changed = false;

    if (state.isAutoRemoveLeaders) {
        state.leaders = state.leaders.filter((n) => n !== pickedLeader);
        changed = true;
    }
    if (state.isAutoRemoveFollowers) {
        state.followers = state.followers.filter((n) => n !== pickedFollower);
        changed = true;
    }
    if (state.isAutoRemoveOrchestras) {
        state.orchestras = state.orchestras.filter((n) => n !== pickedOrchestra);
        changed = true;
    }

    if (changed) {
        saveState(state);
        for (const role of ROLES) {
            renderList(state, role);
        }
    }
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
