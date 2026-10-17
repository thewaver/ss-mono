import { useEffect, useState } from "react";

const MS_PER_SECOND = 1000;
const FULL_TURN = 360;

export const useSpinDegrees = (degreesPerSecond: number, isRunning: boolean) => {
    const [spinDegrees, setSpinDegrees] = useState(0);

    useEffect(() => {
        if (!isRunning || degreesPerSecond === 0) return;

        let frameId: number;
        let lastMs = performance.now();

        const spin = () => {
            const nowMs = performance.now();

            setSpinDegrees((degrees) => (degrees + ((nowMs - lastMs) / MS_PER_SECOND) * degreesPerSecond) % FULL_TURN);
            lastMs = nowMs;
            frameId = requestAnimationFrame(spin);
        };

        frameId = requestAnimationFrame(spin);

        return () => cancelAnimationFrame(frameId);
    }, [degreesPerSecond, isRunning]);

    return spinDegrees;
};
