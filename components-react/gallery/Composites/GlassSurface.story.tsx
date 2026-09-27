import type { PartialGlassDefs } from "@thewaver/ss-components";
import { CSSUtils } from "@thewaver/ss-utils";

import { GlassSurface } from "../../src";

const STAGE_STYLE = {
    width: 400,
    height: 300,
    padding: 60,
    boxSizing: "border-box",
    background: "repeating-linear-gradient(45deg, #335 0 20px, #cc8 20px 40px)",
} as const;

const Content = () => <div style={{ width: 280, height: 180, padding: 16 }}>Behind the glass</div>;

export const Default = ({ glassDefs }: { glassDefs?: PartialGlassDefs }) => (
    <div data-testid="stage" style={STAGE_STYLE}>
        <div data-testid="glass">
            <GlassSurface borderRadii={CSSUtils.spreadRadius(24)} glassDefs={glassDefs}>
                <Content />
            </GlassSurface>
        </div>
    </div>
);

export const Edged = () => (
    <div data-testid="stage" style={STAGE_STYLE}>
        <div data-testid="glass">
            <GlassSurface
                borderRadii={CSSUtils.spreadRadius(24)}
                borderWidths={CSSUtils.spreadWidth(3)}
                computeStrokeDefs={() => [{ color: "#FFFFFF", opacity: 0.8 }]}
                glassDefs={{
                    tint: {
                        opacity: 0.4,
                        gradient: {
                            kind: "linear",
                            angle: 45,
                            colors: [{ value: "#FF00FF" }, { value: "#00FFFF" }],
                        },
                    },
                }}
            >
                <Content />
            </GlassSurface>
        </div>
    </div>
);
