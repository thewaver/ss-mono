import { For } from "solid-js";

import { access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/PageComponents/Variants/Variants.css";

import { useNextLayerClass } from "../../StyledComponents/Layer/Layer.context";
import { PageLayer } from "../Layer/Layer";
import type { VariantsProps } from "./Variants.types";

export const PageVariants = (props: VariantsProps) => {
    const getNextLayerClass = useNextLayerClass();

    return (
        <div
            class={styles.variantsRoot}
            style={{
                "grid-template-columns": `repeat(auto-fill, minmax(min(100%, ${access(props.minColumnWidth) ?? styles.DEFAULT_MIN_COLUMN_WIDTH}px), 1fr))`,
            }}
        >
            <For each={access(props.items)}>
                {(variant) => (
                    <div
                        class={[styles.variantContainer, getNextLayerClass()].join(" ")}
                        data-variant
                        data-testid={variant.key}
                    >
                        <PageLayer>
                            <div class={styles.variantTitle}>{variant.name}</div>

                            <div class={styles.variantDemo}>{variant.component()}</div>

                            {variant.readout && (
                                <div class={styles.variantReadout} data-readout>
                                    {variant.readout()}
                                </div>
                            )}
                        </PageLayer>
                    </div>
                )}
            </For>
        </div>
    );
};
