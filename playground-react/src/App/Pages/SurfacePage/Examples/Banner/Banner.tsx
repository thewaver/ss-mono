import { useId } from "react";

import { SVGDefsSamples, Surface } from "@thewaver/ss-components-react";
import type { SurfaceProps } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/SurfacePage/Examples/Banner/Banner.css";
import knight from "@thewaver/ss-playground/App/knight.webp";
import { CSSUtils, type Size2d } from "@thewaver/ss-utils";

const computeDefs = (size: Size2d, element: HTMLElement | undefined, id: string) =>
    SVGDefsSamples.Gradient.Timed.toConfig({ family: "flow_diag_2", defs: { banded: true } }).computeSVGDefs(
        id,
        undefined,
        element,
        {
            getSize: () => size,
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
    borderRadii: CSSUtils.spreadRadius(styles.borderRadius),
    borderWidths: CSSUtils.spreadWidth(4),
    computeStrokeDefs: (size, element) => computeDefs(size, element, id),
    computeFillDefs: (size, element) => [
        ...computeDefs(size, element, id),
        {
            color: "black",
            opacity: 0.5,
        },
    ],
});

export const BannerExample = () => {
    const id = useId();

    return (
        <div className={styles.root}>
            <Surface {...getConfig(id)}>
                <div className={styles.content}>
                    <img className={styles.image} src={knight} style={{ verticalAlign: "middle" }} />
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
