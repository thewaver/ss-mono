import { createContext, useContext } from "react";

import type { NavLinkGroupContextType } from "./NavLink.contextReact.types";

const NavLinkGroupContext = createContext<NavLinkGroupContextType | undefined>(undefined);

export const NavLinkGroupContextProvider = NavLinkGroupContext.Provider;

export const useNavLinkGroupContext = () => useContext(NavLinkGroupContext);
