import { createUniqueId } from "solid-js";

import { SVGDefsSamples, Surface } from "@thewaver/ss-components";
import type { SurfaceProps } from "@thewaver/ss-components";
import { CSSUtils, type Size2d } from "@thewaver/ss-utils";

import knight from "../../../../knight.webp";

import * as styles from "./Banner.css";

const computeDefs = (getSize: () => Size2d, getRef: () => HTMLElement | undefined, id: string) =>
    SVGDefsSamples.Gradient.Timed.toConfig({ family: "flow_diag_2", defs: { banded: true } }).computeSVGDefs(
        id,
        undefined,
        getRef,
        {
            getSize,
            animationDurationMs: 4000,
            colors: {
                background: "#282420",
                primary: "#FFFF00",
                secondary: "#C0C000",
                tertiary: "#808000",
            },
        },
    );

const getConfig = (id: string): SurfaceProps => ({
    borderRadii: () => CSSUtils.spreadRadius(styles.borderRadius),
    borderWidths: () => CSSUtils.spreadWidth(4),
    computeStrokeDefs: (getSize, getRef) => computeDefs(getSize, getRef, id),
    computeFillDefs: (getSize, getRef) => [
        ...computeDefs(getSize, getRef, id),
        {
            color: "black",
            opacity: 0.5,
        },
    ],
});

export const BannerExample = () => {
    const id = createUniqueId();

    return (
        <div class={styles.root}>
            <Surface {...getConfig(id)}>
                <div class={styles.content}>
                    <img class={styles.image} src={knight} style={{ "vertical-align": "middle" }} />
                    <span>
                        <b>{"Alert! Alert!"}</b>
                        <br />
                        {"Sir Face pleads for your attention!!"}
                    </span>
                </div>
            </Surface>
        </div>
    );
};
