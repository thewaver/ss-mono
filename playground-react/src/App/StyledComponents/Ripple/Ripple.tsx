import { useEffect, useRef, useState } from "react";

import * as styles from "@thewaver/ss-playground-core/App/StyledComponents/Ripple/Ripple.css";

import type { RippleMark, RippleProps } from "./Ripple.types";

const RIPPLE_DURATION_MS = 600;
const RATIO_TO_PERCENT = 100;

export const PageRipple = (props: RippleProps) => {
    const [marks, setMarks] = useState<RippleMark[]>([]);

    const activation = props.activation;

    const timeoutsRef = useRef(new Set<ReturnType<typeof setTimeout>>());

    const count = activation?.count;

    useEffect(() => {
        const mark = activation;

        if (mark === undefined) return;

        setMarks((prev) => (prev.includes(mark) ? prev : [...prev, mark]));

        const timeout = setTimeout(() => {
            timeoutsRef.current.delete(timeout);
            setMarks((prev) => prev.filter((entry) => entry !== mark));
        }, RIPPLE_DURATION_MS);

        timeoutsRef.current.add(timeout);
    }, [count]);

    useEffect(() => {
        const timeouts = timeoutsRef.current;

        return () => {
            timeouts.forEach(clearTimeout);
            timeouts.clear();
        };
    }, []);

    return (
        <div className={styles.rippleRoot} style={{ color: props.color }} aria-hidden="true">
            {marks.map((mark) => (
                <div
                    key={mark.count}
                    className={styles.rippleMark}
                    style={{
                        left: `${mark.ratio.x * RATIO_TO_PERCENT}%`,
                        top: `${mark.ratio.y * RATIO_TO_PERCENT}%`,
                        animationDuration: `${RIPPLE_DURATION_MS}ms`,
                    }}
                />
            ))}
        </div>
    );
};
