import { Show, createUniqueId } from "solid-js";
import { Portal } from "solid-js/web";

import { Button, SVGDefsSamples, Shape, TrackedGradientDefaults, access } from "@thewaver/ss-components";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { TrackedGradientKnobs } from "../../../Knobs/TrackedGradients.const";
import { NO_SAMPLE_KEY } from "../../../PageComponents/SampleGroups/SampleGroups.const";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import type { TrackedGradientOverlayProps } from "../SVGGradients.types";

import * as styles from "../SVGGradients.css";

export const TrackedGradientOverlay = (props: TrackedGradientOverlayProps) => {
    const id = createUniqueId();

    const computeDefs = (getSize: () => Size2d, getRef: () => HTMLElement | undefined) => {
        const key = access(props.configKey);

        if (key === NO_SAMPLE_KEY) return [];

        const defaults = TrackedGradientDefaults.DEFAULTS_BY_FAMILY[key] as Record<string, unknown>;
        const values = access(props.configDefs);
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
            .computeSVGDefs(`overlay-${id}`, undefined, getRef, {
                getSize,
                colors: access(props.colors),
                blurWidth: access(props.blurWidth),
            })
            .filter((def) => def.gradientOrPattern);
    };

    return (
        <Show when={access(props.isShown)}>
            <Portal>
                <div class={styles.screenOverlay}>
                    <Shape
                        computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
                        computeFillDefs={computeDefs}
                        renderChildren={() => <div class={styles.screenOverlayBox} />}
                    />
                </div>

                <div class={styles.screenOverlayClose}>
                    <Button
                        renderContent={(getFlags) => (
                            <PageButtonContent flags={getFlags}>Close pointer-tracking overlay</PageButtonContent>
                        )}
                        onClick={async () => {
                            props.onClose();
                        }}
                    />
                </div>
            </Portal>
        </Show>
    );
};
