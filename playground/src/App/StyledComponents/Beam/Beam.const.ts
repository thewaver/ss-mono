const UNSCALED = 1;
const MS_PER_SECOND = 1000;

export const BEAM_DASH_PX = 24;

export const BEAM_SPEED_PX_PER_SECOND = 160;

export const computeBeamLengthPx = (path: SVGPathElement) => {
    const matrix = path.getCTM();
    const scale = matrix ? Math.hypot(matrix.a, matrix.b) : UNSCALED;

    return path.getTotalLength() * scale;
};

export const computeBeamDurationMs = (lengthPx: number) => (lengthPx / BEAM_SPEED_PX_PER_SECOND) * MS_PER_SECOND;

export const computeBeamMotion = (opts: {
    lengthPx: number;
    startPx: number;
    totalPx: number;
    direction: "forward" | "backward";
}) => {
    const periodPx = opts.totalPx + BEAM_DASH_PX;
    const fromPx = opts.direction === "backward" ? -(opts.startPx + opts.lengthPx) : BEAM_DASH_PX + opts.startPx;

    return {
        dashArray: `${BEAM_DASH_PX}px ${periodPx - BEAM_DASH_PX}px`,
        fromPx,
        toPx: opts.direction === "backward" ? fromPx + periodPx : fromPx - periodPx,
        durationMs: computeBeamDurationMs(periodPx),
    };
};

export const observeBeamLength = (path: SVGPathElement, onLengthPx: (lengthPx: number) => void) => {
    const observer = new ResizeObserver(() => onLengthPx(computeBeamLengthPx(path)));

    observer.observe(path.ownerSVGElement ?? path);

    return () => observer.disconnect();
};
