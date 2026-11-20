import { useMemo } from "react";

import { Formation, PlacementLayoutUtils, ProximityEffectUtils } from "@thewaver/ss-components-react";

import { PageFormationItem } from "../../../StyledComponents/FormationContent/FormationContent";
import type { FormationExampleProps } from "../FormationPageReact.types";

type Props = FormationExampleProps;

export const DefaultExample = (props: Props) => {
    const { layoutEntry, effectEntry, shapeKind, ...otherProps } = props;

    const computeLayout = useMemo(() => PlacementLayoutUtils.toLayoutFn(props.layoutEntry), [props.layoutEntry]);

    const computeEffect = useMemo(
        () => (props.effectEntry === undefined ? undefined : ProximityEffectUtils.toEffectFn(props.effectEntry)),
        [props.effectEntry],
    );

    return (
        <Formation
            {...otherProps}
            computeLayout={computeLayout}
            computeEffect={computeEffect}
            renderItem={(item, state) => (
                <PageFormationItem state={state} shapeKind={props.shapeKind}>
                    {item}
                </PageFormationItem>
            )}
        />
    );
};
