import { Lens } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/Reveals/LensPage/LensPage.css";
import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";

import type { LensExampleProps } from "../LensPage.types";

type Props = LensExampleProps;

export const PhotoExample = (props: Props) => {
    return (
        <div className={styles.root}>
            <Lens
                zoom={props.zoom}
                radius={props.radius}
                softness={props.softness}
                stepSize={props.stepSize}
                joinRadii={props.joinRadii}
                lameExponents={props.lameExponents}
                isDisabled={props.isDisabled}
                ariaLabel={"A magnifying lens over a picture of a knight"}
                computePoints={props.computePoints}
                renderContent={() => <img className={styles.photo} src={knight_profile} alt={"A knight in armor"} />}
            />
        </div>
    );
};
