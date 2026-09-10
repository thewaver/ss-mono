import { Formation, PlacementLayoutUtils, access } from "@thewaver/ss-components";

import { PageFormationItem } from "../../../StyledComponents/FormationContent/FormationContent";
import type { FormationExampleProps } from "../FormationPage.types";

type Props = FormationExampleProps;

export const DefaultExample = ({ layoutEntry, shapeKind, ...otherProps }: Props) => {
    return (
        <Formation
            {...otherProps}
            computeLayout={(defs) => PlacementLayoutUtils.toLayoutFn(access(layoutEntry))(defs)}
            renderItem={(getItem, getState) => (
                <PageFormationItem state={getState} shapeKind={shapeKind}>
                    {getItem()}
                </PageFormationItem>
            )}
        />
    );
};
