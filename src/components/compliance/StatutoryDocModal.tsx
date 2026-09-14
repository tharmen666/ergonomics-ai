import React from 'react';
import { 
  StatutoryDocGeneratorModal, 
  StatutoryDocGeneratorModalProps 
} from '../StatutoryDocGeneratorModal';

export { StatutoryDocGeneratorModal };
export type { StatutoryDocGeneratorModalProps };

// Backwards compatibility alias for existing component imports
export const StatutoryDocModal: React.FC<StatutoryDocGeneratorModalProps> = (props) => {
  return <StatutoryDocGeneratorModal {...props} />;
};
