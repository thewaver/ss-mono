import { Show, createComputed, createMemo, createUniqueId, on, onCleanup, untrack } from "solid-js";

import { MORPH_TEXT_DEFAULTS, MorphTextUtils, MorphTextStyles as styles } from "@thewaver/ss-components";

import { access } from "../../../Utils/propUtils";
import { accessStore } from "../../../Utils/storeUtils";
import type { MorphTextProps } from "./MorphTextSolid.types";

export const MorphText = (props: MorphTextProps) => {
    const filterId = createUniqueId();

    const getText = createMemo(() => access(props.text));

    const getMaxBlurPx = createMemo(() => access(props.maxBlurPx) ?? MORPH_TEXT_DEFAULTS.maxBlurPx);

    const morpher = MorphTextUtils.createMorpher(untrack(getText), {
        getMorphDurationMs: () => untrack(() => access(props.morphDurationMs) ?? MORPH_TEXT_DEFAULTS.morphDurationMs),
        onMorphEnd: (text) => props.onMorphEnd?.(text),
    });

    onCleanup(morpher.stop);

    createComputed(on(getText, (text) => morpher.morphTo(text), { defer: true }));

    const getCurrent = accessStore(morpher, (state) => state.current);

    const getPrevious = accessStore(morpher, (state) => state.previous);

    const getProgress = accessStore(morpher, (state) => state.progress);

    const getFrame = createMemo(() => MorphTextUtils.computeFrame(getProgress(), getMaxBlurPx()));

    const getIsMorphing = () => getPrevious() !== undefined;

    const renderCopy = (getCopyText: () => string) => props.renderText?.(getCopyText) ?? getCopyText();

    return (
        <span class={styles.morphTextRoot} style={{ filter: getIsMorphing() ? `url(#${filterId})` : undefined }}>
            <svg class={styles.morphTextFilterHost} aria-hidden="true">
                <defs>
                    <filter id={filterId}>
                        <feColorMatrix in="SourceGraphic" type="matrix" values={MorphTextUtils.THRESHOLD_MATRIX} />
                    </filter>
                </defs>
            </svg>

            <Show when={getPrevious()}>
                {(getOutgoing) => (
                    <span
                        class={styles.morphTextCopy}
                        style={MorphTextUtils.toCopyStyle(getFrame().outgoing)}
                        aria-hidden="true"
                    >
                        {renderCopy(getOutgoing)}
                    </span>
                )}
            </Show>

            <span
                class={styles.morphTextCopy}
                style={getIsMorphing() ? MorphTextUtils.toCopyStyle(getFrame().incoming) : undefined}
            >
                {renderCopy(getCurrent)}
            </span>
        </span>
    );
};
