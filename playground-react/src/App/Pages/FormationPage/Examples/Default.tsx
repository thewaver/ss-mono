import { useMemo } from "react";

import { Formation, PlacementLayoutUtils, ProximityEffectUtils } from "@thewaver/ss-components-react";

import { PageFormationItem } from "../../../StyledComponents/FormationContent/FormationContent";
import type { FormationExampleProps } from "../FormationPage.types";

type Props = FormationExampleProps;

export const DefaultExample = ({ layoutEntry, effectEntry, shapeKind, ...otherProps }: Props) => {
    const computeLayout = useMemo(() => PlacementLayoutUtils.toLayoutFn(layoutEntry), [layoutEntry]);

    const computeEffect = useMemo(
        () => (effectEntry === undefined ? undefined : ProximityEffectUtils.toEffectFn(effectEntry)),
        [effectEntry],
    );

    return (
        <Formation
            {...otherProps}
            computeLayout={computeLayout}
            computeEffect={computeEffect}
            renderItem={(item, state) => (
                <PageFormationItem state={state} shapeKind={shapeKind}>
                    {item}
                </PageFormationItem>
            )}
        />
    );
};
