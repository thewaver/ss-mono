import { useId, useState } from "react";
import { createPortal } from "react-dom";

import { Button, SVGDefsSamples, Shape, TrackedGradientDefaults } from "@thewaver/ss-components-react";
import { NO_SAMPLE_KEY } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.css";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { TrackedGradientKnobs } from "../../../../Knobs/TrackedGradients.const";
import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import type { TrackedGradientExampleProps } from "../../SVGGradients.types";

export const ScreenOverlayExample = (props: TrackedGradientExampleProps) => {
    const id = useId();

    const [isShown, setIsShown] = useState(false);

    const computeDefs = (size: Size2d, element: HTMLElement | undefined) => {
        const key = props.configKey;

        if (key === NO_SAMPLE_KEY) return [];

        const defaults = TrackedGradientDefaults.DEFAULTS_BY_FAMILY[key] as Record<string, unknown>;
        const values = props.configDefs;
        const scaledValues = Object.fromEntries(
            TrackedGradientKnobs.OVERLAY_SCALED_KEYS.filter((name) => name in defaults).map((name) => [
                name,
                ((values[name] ?? defaults[name]) as number) * TrackedGradientKnobs.OVERLAY_SCALE_FACTOR,
            ]),
        );

        return SVGDefsSamples.Gradient.Tracked.toConfig({
            family: key,
            defs: { ...values, ...scaledValues },
        } as SVGDefsSamples.Gradient.Tracked.Entry)
            .computeSVGDefs(`overlay-${id}`, undefined, element, {
                getSize: () => size,
                colors: props.colors,
                blurWidth: props.blurWidth,
            })
            .filter((def) => def.gradientOrPattern);
    };

    return (
        <>
            <Button
                renderContent={(flags) => (
                    <PageButtonContent flags={flags}>Track the pointer across the screen</PageButtonContent>
                )}
                onClick={() => setIsShown(true)}
            />

            {isShown &&
                createPortal(
                    <div>
                        <div className={styles.screenOverlay}>
                            <Shape
                                computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
                                computeFillDefs={computeDefs}
                                renderChildren={() => <div className={styles.screenOverlayBox} />}
                            />
                        </div>

                        <div className={styles.screenOverlayClose}>
                            <Button
                                renderContent={(flags) => (
                                    <PageButtonContent flags={flags}>Close pointer-tracking overlay</PageButtonContent>
                                )}
                                onClick={() => setIsShown(false)}
                            />
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
};
