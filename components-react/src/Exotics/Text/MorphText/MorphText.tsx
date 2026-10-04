import { useEffect, useId, useLayoutEffect, useState } from "react";

import { MORPH_TEXT_DEFAULTS, MorphTextStyles, MorphTextUtils } from "@thewaver/ss-components";

import { useLatest } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { MorphTextProps } from "./MorphText.types";

export const MorphText = (props: MorphTextProps) => {
    const filterId = useId();

    const maxBlurPx = props.maxBlurPx ?? MORPH_TEXT_DEFAULTS.maxBlurPx;

    const latest = useLatest({
        morphDurationMs: props.morphDurationMs ?? MORPH_TEXT_DEFAULTS.morphDurationMs,
        onMorphEnd: props.onMorphEnd,
    });

    const [morpher] = useState(() =>
        MorphTextUtils.createMorpher(props.text, {
            getMorphDurationMs: () => latest.current.morphDurationMs,
            onMorphEnd: (text) => latest.current.onMorphEnd?.(text),
        }),
    );

    const state = useStore(morpher);

    useLayoutEffect(() => {
        morpher.morphTo(props.text);
    }, [morpher, props.text]);

    useEffect(() => morpher.stop, [morpher]);

    const frame = MorphTextUtils.computeFrame(state.progress, maxBlurPx);
    const isMorphing = state.previous !== undefined;
    const renderCopy = (text: string) => (props.renderText ? props.renderText(text) : text);

    return (
        <span
            className={MorphTextStyles.morphTextRoot}
            style={{ filter: isMorphing ? `url(#${filterId})` : undefined }}
        >
            <svg className={MorphTextStyles.morphTextFilterHost} aria-hidden="true">
                <defs>
                    <filter id={filterId}>
                        <feColorMatrix in="SourceGraphic" type="matrix" values={MorphTextUtils.THRESHOLD_MATRIX} />
                    </filter>
                </defs>
            </svg>

            {state.previous !== undefined && (
                <span
                    key={`outgoing-${state.previous}`}
                    className={MorphTextStyles.morphTextCopy}
                    style={MorphTextUtils.toCopyStyle(frame.outgoing)}
                    aria-hidden="true"
                >
                    {renderCopy(state.previous)}
                </span>
            )}

            <span
                key={"incoming"}
                className={MorphTextStyles.morphTextCopy}
                style={isMorphing ? MorphTextUtils.toCopyStyle(frame.incoming) : undefined}
            >
                {renderCopy(state.current)}
            </span>
        </span>
    );
};
