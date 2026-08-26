import { Button, FlipCard } from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import {
    PageFlipCardBack,
    PageFlipCardFront,
    PageFlipCardStack,
} from "../../../StyledComponents/FlipCardContent/FlipCardContent";
import type { FlipCardExampleProps } from "../FlipCardPage.types";

const CARD_SIZE = { width: 220, height: 300 };

type Props = FlipCardExampleProps;

export const DefaultExample = (props: Props) => {
    const [getIsFlipped, setIsFlipped] = props.flippedSignal;

    return (
        <PageFlipCardStack>
            <FlipCard
                flippedSignal={props.flippedSignal}
                axis={props.axis}
                size={() => CARD_SIZE}
                transitionDurationMs={props.transitionDurationMs}
                ariaLabel={"Nine of hearts"}
                renderFront={(getState) => <PageFlipCardFront state={getState}>9 ♥</PageFlipCardFront>}
                renderBack={(getState) => <PageFlipCardBack state={getState}>♠ ♦ ♣</PageFlipCardBack>}
            />

            <Button
                id={"flip"}
                ariaLabel={getIsFlipped() ? "Show the front" : "Show the back"}
                renderContent={(getFlags) => (
                    <PageButtonContent flags={getFlags}>
                        {getIsFlipped() ? "Show the front" : "Show the back"}
                    </PageButtonContent>
                )}
                onClick={() => {
                    setIsFlipped((isFlipped) => !isFlipped);
                }}
            />
        </PageFlipCardStack>
    );
};
