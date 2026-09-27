import { MediaQueryMonitorReactUtils } from "../../src";

export const Default = ({ isDisabled = false }: { isDisabled?: boolean }) => {
    const isWide = MediaQueryMonitorReactUtils.useMediaQuery("(min-width: 800px)", isDisabled);
    const isReduced = MediaQueryMonitorReactUtils.useReducedMotion();

    return (
        <>
            <output data-readout="wide">{String(isWide)}</output>
            <output data-readout="reduced">{String(isReduced)}</output>
        </>
    );
};
