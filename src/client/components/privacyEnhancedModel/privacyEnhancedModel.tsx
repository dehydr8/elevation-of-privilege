import type React from 'react';
import './privacyEnhancedModel.css';

interface PrivacyEnhancedModelProps {
  modelReference?: string;
}

const PrivacyEnhancedModel: React.FC<PrivacyEnhancedModelProps> = ({
  modelReference,
}) => {
  if (modelReference) {
    return (
      <div className="model modelContainer">
        <h2>Threat Modelling</h2>
        <p>
          {modelReference && (
            <>
              <p>
                The model is hosted externally:&nbsp;
                <a href={modelReference}>{modelReference}</a>
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
