import * as styles from "@thewaver/ss-playground/App/PageComponents/Variants/Variants.css";

import { useNextLayerClass } from "../../StyledComponents/Layer/Layer.context";
import { PageLayer } from "../Layer/Layer";
import type { VariantsProps } from "./Variants.types";

export const PageVariants = (props: VariantsProps) => {
    const nextLayerClass = useNextLayerClass();

    return (
        <div
            className={styles.variantsRoot}
            style={{
                gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${props.minColumnWidth ?? styles.DEFAULT_MIN_COLUMN_WIDTH}px), 1fr))`,
            }}
        >
            {props.items.map((variant) => (
                <div
                    key={variant.key}
                    className={[styles.variantContainer, nextLayerClass].join(" ")}
                    data-variant=""
                    data-testid={variant.key}
                >
                    <PageLayer>
                        <div className={styles.variantTitle}>{variant.name}</div>

                        <div className={styles.variantDemo}>{variant.component()}</div>

                        {variant.readout && (
                            <div className={styles.variantReadout} data-readout="">
                                {variant.readout()}
                            </div>
                        )}
                    </PageLayer>
                </div>
            ))}
        </div>
    );
};
