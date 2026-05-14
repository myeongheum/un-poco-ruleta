import { normalizeState } from "./store.js";

const FILE_NAME = "AppSettings.json";

export function exportToFile(state) {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = FILE_NAME;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

export function setupImport(onLoad) {
    const importBtn = document.getElementById("importButton");
    const fileInput = document.getElementById("importFile");
    if (!importBtn || !fileInput) return;

    importBtn.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const parsed = JSON.parse(text);
            const normalized = normalizeState(parsed);
            onLoad(normalized);
        } catch (err) {
            alert(`JSON 불러오기 실패: ${err.message}`);
        } finally {
            fileInput.value = "";
        }
    });
}
