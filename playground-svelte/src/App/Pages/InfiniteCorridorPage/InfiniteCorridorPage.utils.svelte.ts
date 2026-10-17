const MS_PER_SECOND = 1000;
const FULL_TURN = 360;

export const createSpinDegrees = (getDegreesPerSecond: () => number, getIsRunning: () => boolean) => {
    let spinDegrees = $state(0);

    $effect(() => {
        const degreesPerSecond = getDegreesPerSecond();

        if (!getIsRunning() || degreesPerSecond === 0) return;

        let frameId: number;
        let lastMs = performance.now();

        const spin = () => {
            const nowMs = performance.now();

            spinDegrees = (spinDegrees + ((nowMs - lastMs) / MS_PER_SECOND) * degreesPerSecond) % FULL_TURN;
            lastMs = nowMs;
            frameId = requestAnimationFrame(spin);
        };

        frameId = requestAnimationFrame(spin);

        return () => cancelAnimationFrame(frameId);
    });

    return () => spinDegrees;
};
