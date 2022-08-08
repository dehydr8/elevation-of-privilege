import type React from 'react';
import './privacyEnhancedModel.css';

interface PrivacyEnhancedModelProps {
  modelRef?: string;
}

const PrivacyEnhancedModel: React.FC<PrivacyEnhancedModelProps> = ({
  modelRef,
}) => {
  if (modelRef) {
    return (
      <div className="model modelContainer">
        <h2>Threat Modelling</h2>
        <p>
          {modelRef && (
            <>
              <p>
                The model is hosted externally:&nbsp;
                <a href={modelRef}>{modelRef}</a>
                {/* Note: React takes care about sanitization of user input above to prevent XSS */}
              </p>
            </>
          )}
        </p>
      </div>
    );
  }

  return <></>;
};

export default PrivacyEnhancedModel;
