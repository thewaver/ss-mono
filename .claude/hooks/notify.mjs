import { spawn } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const BEEP_COUNTS = { ask: 3, announce: 1, quiet: 0 };
const DEFAULT_MODE = "announce";
const PLAY_GAP_MS = 300;
const IDLE_THRESHOLD_MS = 60_000;
const REPEAT_DELAY_MS = 180_000;
const ALERT_LIMIT = 3;
const MAC_SOUND = "/System/Library/Sounds/Glass.aiff";
const MAC_VOLUME = "4";
const WINDOWS_SOUND = "C:\\Windows\\Media\\Windows Notify System Generic.wav";
const WINDOWS_TAIL_MS = 2000;

const [command, ...args] = process.argv.slice(2);

const readSessionId = () => {
    try {
        return JSON.parse(readFileSync(0, "utf8")).session_id ?? "default";
    } catch {
        return "default";
    }
};

const pathsFor = (sessionId) => {
    const base = join(tmpdir(), `claude-notify-${sessionId}`);

    return { stamp: base, mode: `${base}.mode`, alert: `${base}.alert` };
};

const readText = (path) => {
    try {
        return readFileSync(path, "utf8").trim();
    } catch {
        return undefined;
    }
};

const beep = (count) => {
    if (count === 0) return;

    if (process.platform === "darwin") {
        for (let index = 0; index < count; index++) {
            setTimeout(() => spawn("afplay", ["-v", MAC_VOLUME, MAC_SOUND], { stdio: "ignore" }), index * PLAY_GAP_MS);
        }
    } else if (process.platform === "win32") {
        const plays = Array.from(
            { length: count },
            () => `(New-Object Media.SoundPlayer '${WINDOWS_SOUND}').Play(); Start-Sleep -Milliseconds ${PLAY_GAP_MS}`,
        ).join("; ");

        spawn("powershell.exe", ["-NoProfile", "-Command", `${plays}; Start-Sleep -Milliseconds ${WINDOWS_TAIL_MS}`], {
            stdio: "ignore",
        });
    }
};

const startFollowUps = (sessionId, alertId, count, alertsLeft) => {
    if (alertsLeft <= 0) return;

    spawn(
        process.execPath,
        [fileURLToPath(import.meta.url), "follow-up", sessionId, alertId, String(count), String(alertsLeft)],
        {
            detached: true,
            stdio: "ignore",
        },
    ).unref();
};

const followUp = (sessionId, alertId, count, alertsLeft) => {
    const paths = pathsFor(sessionId);

    const tick = (left) => {
        setTimeout(() => {
            const isCurrent = readText(paths.alert) === alertId;
            const hasHeardBack = Number(readText(paths.stamp) ?? 0) > Number(alertId);

            if (!isCurrent || hasHeardBack) return;

            beep(count);

            if (left > 1) tick(left - 1);
        }, REPEAT_DELAY_MS);
    };

    tick(alertsLeft);
};

if (command === "start") {
    writeFileSync(pathsFor(readSessionId()).stamp, String(Date.now()));
} else if (command === "mark") {
    const [mode, sessionId] = args;

    if (Object.hasOwn(BEEP_COUNTS, mode ?? "") && sessionId) writeFileSync(pathsFor(sessionId).mode, mode);
} else if (command === "follow-up") {
    const [sessionId, alertId, count, alertsLeft] = args;

    followUp(sessionId, alertId, Number(count), Number(alertsLeft));
} else {
    const sessionId = readSessionId();
    const paths = pathsFor(sessionId);
    const marked = readText(paths.mode);
    const mode = Object.hasOwn(BEEP_COUNTS, marked ?? "") ? marked : DEFAULT_MODE;

    rmSync(paths.mode, { force: true });

    const count = BEEP_COUNTS[mode];

    if (count > 0) {
        const now = Date.now();
        const alertId = String(now);
        const stamp = Number(readText(paths.stamp) ?? 0);
        const isIdle = now - stamp >= IDLE_THRESHOLD_MS;

        writeFileSync(paths.alert, alertId);

        if (isIdle) beep(count);

        startFollowUps(sessionId, alertId, count, isIdle ? ALERT_LIMIT - 1 : ALERT_LIMIT);
    }
}
