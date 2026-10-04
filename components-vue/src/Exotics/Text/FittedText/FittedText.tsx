import { defineComponent, shallowRef } from "vue";

import { FITTED_TEXT_DEFAULTS, FittedTextStyles, FittedTextUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../../Utils/effectUtils";
import { declareProps } from "../../../Utils/propUtils";
import { useStableList } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { FittedTextProps } from "./FittedText.types";

export const FittedText = defineComponent(
    (props: FittedTextProps) => {
        const rootRef = shallowRef<HTMLDivElement>();

        const lines = useStableList(() => props.lines);

        const getLineHeightRatio = () => props.lineHeightRatio ?? FITTED_TEXT_DEFAULTS.lineHeightRatio;

        const layout = FittedTextUtils.createLayout({
            getLines: () => lines.value,
            getLineHeightRatio,
        });

        const fontSizes = useStore(layout, (state) => state.fontSizes);

        watchAfterRender([rootRef], ([root]) => (root ? layout.observe(root) : undefined));

        watchAfterRender([lines, getLineHeightRatio], () => {
            layout.update();
        });

        watchAfterRender([], () => {
            props.onMount?.({ update: layout.update });
        });

        return () => {
            const lineHeightRatio = getLineHeightRatio();

            return (
                <div ref={rootRef} class={FittedTextStyles.fittedTextRoot}>
                    {lines.value.map((line, index) => (
                        <span
                            key={index}
                            class={FittedTextStyles.fittedTextLine}
                            style={{ fontSize: `${fontSizes.value[index] ?? 0}px`, lineHeight: lineHeightRatio }}
                        >
                            {line}
                        </span>
                    ))}
                </div>
            );
        };
    },
    {
        name: "FittedText",
        props: declareProps<FittedTextProps>({
            lines: null,
            lineHeightRatio: null,
            onMount: null,
        }),
    },
);
