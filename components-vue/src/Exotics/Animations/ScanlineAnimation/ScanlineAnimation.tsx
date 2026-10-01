import { defineComponent } from "vue";

import { SCANLINE_ANIMATION_DEFAULTS } from "@thewaver/ss-components";

import { declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import { CellAnimation } from "../CellAnimation/CellAnimation";
import type { ScanlineAnimationProps } from "./ScanlineAnimation.types";

export const ScanlineAnimation = defineComponent(
    (props: ScanlineAnimationProps) => {
        const playback = useTwoWay(props, "playback", true);
        const progress = useTwoWay(props, "progress", 0);

        return () => {
            const isVertical = (props.orientation ?? SCANLINE_ANIMATION_DEFAULTS.orientation) === "vertical";

            return (
                <CellAnimation
                    {...{
                        ...forwardProps(props, CellAnimation),
                        "playback": playback.value,
                        "onUpdate:playback": (isPlaying: boolean) => {
                            playback.value = isPlaying;
                        },
                        "progress": progress.value,
                        "onUpdate:progress": (value: number) => {
                            progress.value = value;
                        },
                    }}
                    cellCount={isVertical ? { row: 1, col: props.lineCount } : { row: props.lineCount, col: 1 }}
                    computeCellAnimation={props.computeScanlineAnimation}
                />
            );
        };
    },
    {
        name: "ScanlineAnimation",
        props: declareProps<ScanlineAnimationProps>({
            "src": null,
            "ariaLabel": null,
            "sizeAnchor": null,
            "animationDurationMs": null,
            "animationIterationCount": null,
            "animationIterationDelayMs": null,
            "playback": Boolean,
            "onUpdate:playback": null,
            "progress": null,
            "onUpdate:progress": null,
            "finalFrame": null,
            "computeCellWeights": null,
            "computeRootAnimation": null,
            "onIterationEnd": null,
            "onAnimationEnd": null,
            "lineCount": null,
            "orientation": null,
            "computeScanlineAnimation": null,
        }),
    },
);
