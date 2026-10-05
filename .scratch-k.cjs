const fs = require("fs");
const rep = (f, a, b) => {
    let s = fs.readFileSync(f, "utf8");
    if (!s.includes(a)) throw new Error("miss " + f + " :: " + a.slice(0, 80));
    fs.writeFileSync(f, s.replace(a, b));
};
const E = "playground-solid/src/App/Pages/TypewriterPage/Examples/Karaoke.tsx";
rep(
    E,
    `import { Button, Range, Typewriter } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
`,
    `import { Button, Range, Typewriter } from "@thewaver/ss-components-solid";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageRangeContent } from "../../../StyledComponents/RangeContent/RangeContent";
import type { TypewriterKaraokeExampleProps } from "../TypewriterPage.types";
`,
);
rep(
    E,
    `export const KaraokeExample = () => {`,
    `type Props = TypewriterKaraokeExampleProps;

export const KaraokeExample = (props: Props) => {`,
);
rep(
    E,
    `        <div class={styles.karaokeStack}>
            <div class={styles.karaokeLine}>
                <Typewriter
                    progress={[getProgress, setProgress]}
                    playback={[getIsPlaying, setIsPlaying]}
                    computeAnimationName={() => styles.typewriterSweep}
                    animationDelayMs={() => CHARACTER_DELAY_MS}
                    animationDurationMs={() => CHARACTER_DURATION_MS}
                    onAnimationEnd={() => setIsPlaying(false)}
                >
                    {LYRIC}
                </Typewriter>
            </div>
`,
    `        <div class={styles.karaokeStack}>
            <PageMeasureBox width={props.width} padding={() => MEASURE_BOX_PADDING}>
                <div class={styles.karaokeLine}>
                    <Typewriter
                        progress={[getProgress, setProgress]}
                        playback={[getIsPlaying, setIsPlaying]}
                        computeAnimationName={() => styles.typewriterSweep}
                        animationDelayMs={() => CHARACTER_DELAY_MS}
                        animationDurationMs={() => CHARACTER_DURATION_MS}
                        onAnimationEnd={() => setIsPlaying(false)}
                    >
                        {LYRIC}
                    </Typewriter>
                </div>
            </PageMeasureBox>
`,
);
const P = "playground-solid/src/App/Pages/TypewriterPage/TypewriterPage.tsx";
rep(
    P,
    `                component: () => (
                    <PageMeasureBox width={getTextContainerWidth} padding={() => MEASURE_BOX_PADDING}>
                        <KaraokeExample />
                    </PageMeasureBox>
                ),`,
    `                component: () => <KaraokeExample width={getTextContainerWidth} />,`,
);
const T = "playground-solid/src/App/Pages/TypewriterPage/TypewriterPage.types.ts";
rep(
    T,
    `export type TypewriterPhrasesExampleProps = TypewriterExampleProps &
    AccessorProps<{
        width: number;
    }>;`,
    `export type TypewriterPhrasesExampleProps = TypewriterExampleProps &
    AccessorProps<{
        width: number;
    }>;

export type TypewriterKaraokeExampleProps = AccessorProps<{
    width: number;
}>;`,
);
