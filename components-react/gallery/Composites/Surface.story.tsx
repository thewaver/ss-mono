import { useId } from "react";

import { CSSUtils } from "@thewaver/ss-utils";

import { SVGGradientDefsReactUtils, Surface } from "../../src";

export const Card = () => (
    <div data-testid="card" style={{ width: 240, margin: 40 }}>
        <Surface
            borderRadii={CSSUtils.spreadRadius(20)}
            borderWidths={CSSUtils.spreadWidth(2)}
            computeFillDefs={() => [{ color: "#223344", opacity: 0.5 }]}
            computeStrokeDefs={() => [{ color: "#FFFFFF" }]}
        >
            <img alt="" width={240} height={120} style={{ display: "block", background: "#888" }} />
        </Surface>
    </div>
);

export const Borderless = () => (
    <div data-testid="card" style={{ width: 240, margin: 40 }}>
        <Surface
            borderRadii={CSSUtils.spreadRadius(20)}
            borderWidths={CSSUtils.spreadWidth(0)}
            computeFillDefs={() => [{ color: "#223344" }]}
            computeStrokeDefs={() => [{ color: "#FFFFFF" }]}
        >
            <span>Borderless</span>
        </Surface>
    </div>
);

export const Avatar = () => {
    const strokeId = useId();

    return (
        <div data-testid="avatar" style={{ width: 120, height: 120, margin: 40 }}>
            <Surface
                borderRadii={CSSUtils.spreadRadius(60)}
                borderWidths={CSSUtils.spreadWidth(4)}
                computeStrokeDefs={() => [
                    {
                        gradientOrPattern: {
                            id: strokeId,
                            renderDefsElement: () =>
                                SVGGradientDefsReactUtils.computeLinearGradient({
                                    id: strokeId,
                                    angle: 45,
                                    colors: [{ value: "#FFFF00" }, { value: "#00FFFF" }, { value: "#FF00FF" }],
                                }),
                        },
                    },
                ]}
            >
                <img alt="" width={120} height={120} style={{ display: "block", background: "#888" }} />
            </Surface>
        </div>
    );
};

export const Squircle = () => (
    <div data-testid="squircle" style={{ width: 120, height: 120, margin: 40 }}>
        <Surface
            borderRadii={CSSUtils.spreadRadius(40)}
            borderWidths={CSSUtils.spreadWidth(0)}
            lameExponents={CSSUtils.spreadCornerShape(2)}
            computeFillDefs={() => [{ color: "#223344" }]}
        >
            <div style={{ width: 120, height: 120 }} />
        </Surface>
    </div>
);
