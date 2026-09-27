import { createContext, useContext, useState } from "react";

const WizardStatusContext = createContext(null);

export function WizardStatusProvider({ children }) {
  const [wizardActive, setWizardActive] = useState(false);

  return (
    <WizardStatusContext.Provider value={{ wizardActive, setWizardActive }}>
      {children}
    </WizardStatusContext.Provider>
  );
}

export function useWizardStatus() {
  const ctx = useContext(WizardStatusContext);
  if (!ctx) {
    throw new Error("useWizardStatus must be used inside WizardStatusProvider");
  }
  return ctx;
}