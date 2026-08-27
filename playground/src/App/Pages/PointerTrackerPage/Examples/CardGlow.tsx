import { For, createMemo, createSignal } from "solid-js";

import { PointerTracker } from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";

import * as styles from "../PointerTrackerPage.css";

const CARDS = [
    { title: "Nearest", body: "The glow sits where the pointer is, clamped to this card's own box." },
    { title: "Each its own", body: "Three cards, three readings — one document listener behind all of them." },
    { title: "Fades by range", body: "Past two of its own radii the border stops answering." },
];

const REACH_RADII = 2;
const PERCENT = 100;
const GLOW_RADIUS_PX = 120;

const GlowCard = (props: { title: string; body: string }) => {
    const [getRef, setRef] = createSignal<HTMLElement>();

    const { getReading, getIsPointerPresent } = PointerTracker.create(getRef);

    const getNearness = createMemo(() =>
        getIsPointerPresent() ? MathUtils.clamp01((REACH_RADII - getReading().edgeRatio) / REACH_RADII) : 0,
    );

    const getOrigin = createMemo(() => {
        const reading = getReading();

        return {
            x: MathUtils.clamp01(reading.boxRatio.x) * PERCENT,
            y: MathUtils.clamp01(reading.boxRatio.y) * PERCENT,
        };
    });

    return (
        <div ref={setRef} class={styles.glowCard}>
            <span class={styles.glowCardTitle}>{props.title}</span>
            <span>{props.body}</span>

            <div
                class={styles.glowCardBorder}
                style={{
                    "opacity": getNearness(),
                    "background": `radial-gradient(circle ${GLOW_RADIUS_PX}px at ${getOrigin().x}% ${getOrigin().y}%, hsl(165 100% 60%), transparent)`,
                    "mask": "linear-gradient(black, black) content-box, linear-gradient(black, black)",
                    "mask-composite": "exclude",
                    "-webkit-mask": "linear-gradient(black, black) content-box, linear-gradient(black, black)",
                    "-webkit-mask-composite": "xor",
                }}
            />
        </div>
    );
};

export const CardGlowExample = () => {
    return (
        <div class={styles.glowRow}>
            <For each={CARDS}>{(card) => <GlowCard title={card.title} body={card.body} />}</For>
        </div>
    );
};
