import { FrameRateMonitorReactUtils } from "../../src";

export const Default = () => {
    const { current } = FrameRateMonitorReactUtils.useFrameRate();

    return <output data-readout="current">{current > 0 ? "counting" : "zero"}</output>;
};
