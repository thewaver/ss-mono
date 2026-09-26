import { For } from "solid-js";

import { access } from "@thewaver/ss-components";

import { PageLayer } from "../Layer/Layer";
import type { VariantsProps } from "./Variants.types";

import * as styles from "./Variants.css";

export const PageVariants = (props: VariantsProps) => {
    return (
        <div
            class={styles.variantsRoot}
            style={{
                "grid-template-columns": `repeat(auto-fill, minmax(min(100%, ${access(props.minColumnWidth) ?? styles.DEFAULT_MIN_COLUMN_WIDTH}px), 1fr))`,
            }}
        >
            <For each={access(props.items)}>
                {(variant) => (
                    <div class={styles.variantContainer} data-variant data-testid={variant.key}>
                        <PageLayer level={1}>
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
