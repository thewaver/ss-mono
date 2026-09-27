import { type ReactNode, useState } from "react";

import { ScrambleText, type ScrambleTextController } from "../../src";

const HEADLINE = "SYSTEM ONLINE";
const LINE = "DECRYPTING PAYLOAD FROM THE ARCHIVE";
const STATUSES = ["CONNECTING", "HANDSHAKE", "AUTHORIZED", "STREAMING", "IDLE"];
const BUILDS = ["Build 1.4.2 ready", "Build 1.4.3 ready", "Build 1.4.3 RC1 ready", "Build 1.5.0 ready"];
const BOX_WIDTH = 320;
const ROLLS_PER_CHARACTER = 6;
const RUN_MULTIPLIER = 4;
const MIN_INTERVAL_MS = 12;

const Box = ({ testId, children }: { testId: string; children: ReactNode }) => (
    <div data-testid={testId}>
        <div data-demo={testId} style={{ width: BOX_WIDTH, fontSize: 28, fontFamily: "monospace" }}>
            {children}
        </div>
    </div>
);

export const Default = () => {
    const [settleDurationMs, setSettleDurationMs] = useState(1000);
    const [settleText, setSettleText] = useState("1000");
    const [headline, setHeadline] = useState<ScrambleTextController>();
    const [sequential, setSequential] = useState<ScrambleTextController>();
    const [statusIndex, setStatusIndex] = useState(0);
    const [buildIndex, setBuildIndex] = useState(0);

    const runDurationMs = settleDurationMs * RUN_MULTIPLIER;
    const churnDurationMs = runDurationMs / Math.max(LINE.length - 1, 1);
    const sequentialIntervalMs = Math.max(churnDurationMs / ROLLS_PER_CHARACTER, MIN_INTERVAL_MS);

    return (
        <>
            <input
                id="settleDurationMs"
                type="number"
                value={settleText}
                onChange={(event) => setSettleText(event.currentTarget.value)}
                onBlur={() => setSettleDurationMs(Number(settleText))}
            />

            <Box testId="headline">
                <ScrambleText text={HEADLINE} settleDurationMs={settleDurationMs} onMount={setHeadline} />
            </Box>
            <button id="runItAgain" type="button" onClick={() => headline?.restartAnimation()}>
                Run it again
            </button>

            <Box testId="sequential">
                <ScrambleText
                    text={LINE}
                    settleDurationMs={runDurationMs}
                    churnDurationMs={churnDurationMs}
                    scrambleIntervalMs={sequentialIntervalMs}
                    onMount={setSequential}
                />
            </Box>
            <button id="revealAgain" type="button" onClick={() => sequential?.restartAnimation()}>
                Reveal again
            </button>

            <Box testId="swap">
                <ScrambleText text={STATUSES[statusIndex]!} settleDurationMs={settleDurationMs} />
            </Box>
            <button
                id="nextStatus"
                type="button"
                onClick={() => setStatusIndex((index) => (index + 1) % STATUSES.length)}
            >
                Next status
            </button>

            <Box testId="changedOnly">
                <ScrambleText text={BUILDS[buildIndex]!} changedOnly={true} settleDurationMs={settleDurationMs} />
            </Box>
            <button id="nextBuild" type="button" onClick={() => setBuildIndex((index) => (index + 1) % BUILDS.length)}>
                Next build
            </button>
        </>
    );
};
