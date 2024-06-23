/**
 * The threat models used by OWASP Threat Dragon
 *
 * This type is based on the schema at https://owasp.org/www-project-threat-dragon/assets/schemas/owasp.threat-dragon.schema.V1.json
 */
export interface ThreatDragonModel {
  /**
   * Threat Dragon version used in the model
   */
  version?: string;

  /**
   * Threat model project meta-data
   */
  summary: {
    /**
     * Description of the threat model used for report outputs
     */
    description?: string;
    /**
     * A unique identifier for this main threat model object
     */
    id?: number;
    /**
     * The original creator or overall owner of the model
     */
    owner?: string;
    /**
     * Threat model title
     */
    title: string;
  };
  /**
   * Threat model definition
   */
  detail: {
    /**
     * An array of contributors to the threat model project
     */
    contributors?: Contributor[];
    /**
     * An array of single or multiple threat data-flow diagrams
     */
    diagrams: Diagram[];
  };
}

interface Contributor {
  /**
   * The name of the contributor
   */
  name: string;
}

interface Diagram {
  /**
   * The methodology used by the data-flow diagram
   */
  diagramType: string;
  /**
   * The sequence number of the diagram
   */
  id: number;
  /**
   * The size of the diagram drawing canvas
   */
  size: {
    /**
     * The height of the diagram drawing canvas
     */
    height: number;
    /**
     * The width of the diagram drawing canvas
     */
    width: number;
  };
  /**
   * The path to the thumbnail image for the diagram
   */
  thumbnail: string;
  /**
   * The title of the data-flow diagram
   */
  title: string;
  /**
   * Threat Dragon version used in the diagram
   */
  version?: string;
  /**
   * The data-flow diagram components
   */
  diagramJson: DiagramJson;
  /**
   * The highest diagram number in the threat model
   */
  diagramTop?: number;
  /**
   * The reviewer of the overall threat model
   */
  reviewer?: string;
  /**
   * The highest threat number in the threat model
   */
  threatTop?: number;
}

interface DiagramJson {
  /**
   * The individual diagram components
   */
  cells?: ThreatDragonComponent[];
}

export interface ThreatDragonComponent {
  /**
   * The component display attributes
   */
  attrs: {
    /**
     * The component shape attributes
     */
    '.element-shape'?: {
      /**
       * The component shape display attributes
       */
      class?: string;
    };
    /**
     * The component text
     */
    text?: {
      /**
       * The component text contents
       */
      text: string;
    };
    /**
     * The component text attributes
     */
    '.element-text'?: {
      /**
       * The component text display attributes
       */
      class?: string;
    };
  };
  /**
   * The component rotation angle
   */
  angle?: number;
  /**
   * The component description
   */
  description?: string;
  /**
   * The component flag set if the process handles credit card payment
   */
  handlesCardPayment?: boolean;
  /**
   * The component flag set if the process is part of a retail site
   */
  handlesGoodsOrServices?: boolean;
  /**
   * The component flag set if there are open threats
   */
  hasOpenThreats?: boolean;
  /**
   * The component unique identifier (UUID)
   */
  id: string;
  /**
   * The component flag set if the store contains logs
   */
  isALog?: boolean;
  /**
   * The component flag set if the process is a web application
   */
  isWebApplication?: boolean;
  /**
   * The component flag set if the data flow or store is encrypted
   */
  isEncrypted?: boolean;
  /**
   * The component flag set if the data store uses signatures
   */
  isSigned?: boolean;
  /**
   * The flag set if the component is a trust boundary curve or trust boundary box
   */
  isTrustBoundary?: boolean;
  /**
   * The floating labels used for boundary or data-flow
   */
  labels?: Label[];
  /**
   * The component flag set if it is not in scope
   */
  outOfScope?: boolean;
  /**
   * The component position
   */
  position?: {
    /**
     * The component horizontal position
     */
    x: number;
    /**
     * The component vertical position
     */
    y: number;
    [k: string]: unknown;
  };
  /**
   * The component's level of privilege/permissions
   */
  privilegeLevel?: string;
  /**
   * The component description if out of scope
   */
  reasonOutOfScope?: string;
  /**
   * The component size
   */
  size: {
    /**
     * The component height
     */
    height: number;
    /**
     * The component width
     */
    width: number;
  };
  /**
   * The component curve type, for data flows and boundaries
   */
  smooth?: boolean;
  /**
   * The component curve source
   */
  source?: {
    /**
     * The data-flow source component
     */
    id?: string;
    /**
     * The boundary horizontal curve source
     */
    x?: number;
    /**
     * The boundary vertical curve source
     */
    y?: number;
  };
  /**
   * The component flag set if store contains credentials/PII
   */
  storesCredentials?: boolean;
  /**
   * The component flag set if store is part of a retail web application
   */
  storesInventory?: boolean;
  /**
   * The component curve target
   */
  target?: {
    /**
     * The data-flow target component
     */
    id?: string;
    /**
     * The boundary horizontal curve target
     */
    x?: number;
    /**
     * The boundary vertical curve target
     */
    y?: number;
  };
  /**
   * The threats associated with the component
   */
  threats?: ThreatDragonThreat[];
  type: CellType;
  /**
   * The boundary or data-flow curve points
   */
  vertices?: {
    /**
     * The horizontal value of the curve point
     */
    x: number;
    /**
     * The vertical value of the curve point
     */
    y: number;
  };
  z: number;
}

interface Label {
  /**
   * The label position
   */
  position: number;
  /**
   * The label text attributes
   */
  attrs: {
    /**
     * The text attributes
     */
    text: {
      /**
       * The text size
       */
      'font-size': string;
      /**
       * The text weight
       */
      'font-weight': string;
      /**
       * The text content
       */
      text: string;
    };
  };
}

type CellType =
  | 'tm.Process'
  | 'tm.Store'
  | 'tm.Actor'
  | 'tm.Flow'
  | 'tm.Boundary';

export interface ThreatDragonThreat {
  /**
   * The threat description
   */
  description: string;
  /**
   * The threat mitigation
   */
  mitigation: string;
  /**
   * The threat methodology type
   */
  modelType?: string;
  /**
   * The unique number for the threat
   */
  number?: number;
  /**
   * The custom score/risk for the threat
   */
  score?: string;
  /**
   * The threat severity as High, Medium or Low
   */
  severity: string;
  /**
   * The threat status as NA, Open or Mitigated
   */
  status: Status;
  /**
   * The threat ID as a UUID
   */
  threatId?: string;
  /**
   * The threat title
   */
  title: string;
  /**
   * The threat type, selection according to modelType
   */
  type: string;

  // our custom properties
  owner?: string;
  id?: string;
  game?: string;
}

type Status = 'NA' | 'Open' | 'Mitigated';
