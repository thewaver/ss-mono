import { LightCatcher } from "../../src";

export const Default = ({ isDisabled = false, activeRangePx }: { isDisabled?: boolean; activeRangePx?: number }) => (
    <div data-testid="frame" style={{ width: 200, height: 100, margin: 200 }}>
        <LightCatcher
            maxBrightness={2}
            maxLightness={0.4}
            lightRangePx={400}
            activeRangePx={activeRangePx}
            isDisabled={isDisabled}
        >
            <div data-testid="surface" style={{ width: 200, height: 100, background: "#446" }} />
        </LightCatcher>
    </div>
);
