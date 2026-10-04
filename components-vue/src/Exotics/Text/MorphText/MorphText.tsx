import { type SlotsType, computed, defineComponent, onScopeDispose, useId, watch } from "vue";

import { MORPH_TEXT_DEFAULTS, MorphTextStyles, MorphTextUtils } from "@thewaver/ss-components";

import { declareProps } from "../../../Utils/propUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { MorphTextProps, MorphTextSlots } from "./MorphText.types";

export const MorphText = defineComponent(
    (props: MorphTextProps, { slots }: SlotsContext<MorphTextSlots>) => {
        const filterId = useId();

        const morpher = MorphTextUtils.createMorpher(props.text, {
            getMorphDurationMs: () => props.morphDurationMs ?? MORPH_TEXT_DEFAULTS.morphDurationMs,
            onMorphEnd: (text) => props.onMorphEnd?.(text),
        });

        onScopeDispose(morpher.stop);

        watch(
            () => props.text,
            (text) => morpher.morphTo(text),
        );

        const state = useStore(morpher);

        const frame = computed(() =>
            MorphTextUtils.computeFrame(state.value.progress, props.maxBlurPx ?? MORPH_TEXT_DEFAULTS.maxBlurPx),
        );

        const renderCopy = (text: string) => (slots.renderText ? slots.renderText(text) : text);

        return () => {
            const { current, previous } = state.value;
            const isMorphing = previous !== undefined;

            return (
                <span
                    class={MorphTextStyles.morphTextRoot}
                    style={{ filter: isMorphing ? `url(#${filterId})` : undefined }}
                >
                    <svg class={MorphTextStyles.morphTextFilterHost} aria-hidden="true">
                        <defs>
                            <filter id={filterId}>
                                <feColorMatrix
                                    in="SourceGraphic"
                                    type="matrix"
                                    values={MorphTextUtils.THRESHOLD_MATRIX}
                                />
                            </filter>
                        </defs>
                    </svg>

                    {previous !== undefined && (
                        <span
                            key={`outgoing-${previous}`}
                            class={MorphTextStyles.morphTextCopy}
                            style={MorphTextUtils.toCopyStyle(frame.value.outgoing)}
                            aria-hidden="true"
                        >
                            {renderCopy(previous)}
                        </span>
                    )}

                    <span
                        key="incoming"
                        class={MorphTextStyles.morphTextCopy}
                        style={isMorphing ? MorphTextUtils.toCopyStyle(frame.value.incoming) : undefined}
                    >
                        {renderCopy(current)}
                    </span>
                </span>
            );
        };
    },
    {
        name: "MorphText",
        slots: Object as SlotsType<MorphTextSlots>,
        props: declareProps<MorphTextProps>({
            text: null,
            morphDurationMs: null,
            maxBlurPx: null,
            onMorphEnd: null,
        }),
    },
);
