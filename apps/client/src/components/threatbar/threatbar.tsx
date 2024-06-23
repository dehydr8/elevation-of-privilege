import { getComponentName, getSuitDisplayName } from '@eop/shared';
import {
  faBolt,
  faEdit,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import nl2br from 'react-nl2br';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardText,
  Col,
  Collapse,
  Row,
} from 'reactstrap';
import confirm from 'reactstrap-confirm';

import ThreatModal from '../threatmodal/threatmodal';

import './threatbar.css';

import type {
  GameState,
  ThreatDragonModel,
  ThreatDragonThreat,
} from '@eop/shared';
import type { BoardProps } from 'boardgame.io/react';
import type { FC } from 'react';

type ThreatbarProps = {
  model?: ThreatDragonModel;
  active: boolean;
  names: string[];
  isInThreatStage: boolean;
} & Pick<BoardProps<GameState>, 'G' | 'moves' | 'playerID'>;

const Threatbar: FC<ThreatbarProps> = ({
  playerID,
  model,
  G,
  moves,
  active,
  names,
  isInThreatStage,
}) => {
  const getSelectedComponent = () => {
    if (G.selectedComponent === '' || model === undefined) {
      return undefined;
    }

    const diagram = model.detail.diagrams[G.selectedDiagram].diagramJson;
    return diagram.cells?.find((cell) => cell.id === G.selectedComponent);
  };

  const getThreatsForSelectedComponent = (): ThreatDragonThreat[] => {
    const component = getSelectedComponent();

    return (
      component?.threats?.map((threat, index) => ({
        ...threat,
        // add ids if they are missing
        id: threat.id ?? `${index}`,
      })) ?? []
    );
  };

  const getIdentifiedThreatsForSelectedComponent = () =>
    Object.values(
      G.identifiedThreats[G.selectedDiagram]?.[G.selectedComponent] ?? {},
    );

  const threats = getThreatsForSelectedComponent().reverse();
  const identifiedThreats =
    getIdentifiedThreatsForSelectedComponent().reverse();
  const component = getSelectedComponent();
  const componentName = getComponentName(component);

  return (
    <div className="threat-bar" hidden={G.selectedComponent === ''}>
      <Card>
        <CardHeader>
          Threats for {componentName}{' '}
          {/* @ts-expect-error @fortawesome/react-fontawesome uses an older version of @fortawesome/fontawesome-svg-core (1.3.0), which makes the types incompatible. It still works correctly at runtime. */}
          <FontAwesomeIcon style={{ float: 'right' }} icon={faBolt} />
        </CardHeader>
        <CardBody className="threat-container">
          {playerID && (
            <Button
              color="primary"
              size="lg"
              block
              disabled={
                G.selectedComponent === '' ||
                !isInThreatStage ||
                G.passed.includes(playerID) ||
                !active
              }
              onClick={() => moves.toggleModal()}
            >
              {/* @ts-expect-error @fortawesome/react-fontawesome uses an older version of @fortawesome/fontawesome-svg-core (1.3.0), which makes the types incompatible. It still works correctly at runtime. */}
              <FontAwesomeIcon icon={faPlus} /> Add Threat
            </Button>
          )}
          <hr />
          {identifiedThreats.map((val, idx) => (
            <Card key={idx}>
              <CardHeader
                className="hoverable"
                onClick={() => moves.selectThreat(val.id)}
              >
                <strong>{val.title}</strong>
                <Row>
                  <Col xs="6">
                    <small>
                      {val.type !== undefined
                        ? getSuitDisplayName(G.gameMode, val.type)
                        : ''}
                    </small>
                  </Col>
                  <Col xs="3">
                    <small>{val.severity}</small>
                  </Col>
                  <Col xs="3">
                    <small className="float-right">
                      &mdash;{' '}
                      {val.owner !== undefined
                        ? names[Number.parseInt(val.owner)]
                        : ''}
                    </small>
                  </Col>
                </Row>
              </CardHeader>
              <Collapse isOpen={G.selectedThreat === val.id}>
                <CardBody>
                  <CardText>{nl2br(val.description)}</CardText>
                  <hr />
                  <CardText>{nl2br(val.mitigation)}</CardText>
                </CardBody>
                <CardFooter hidden={val.owner !== playerID}>
                  <Row>
                    <Col xs="6">
                      <Button
                        block
                        onClick={() => moves.toggleModalUpdate(val)}
                      >
                        {/* @ts-expect-error @fortawesome/react-fontawesome uses an older version of @fortawesome/fontawesome-svg-core (1.3.0), which makes the types incompatible. It still works correctly at runtime. */}
                        <FontAwesomeIcon icon={faEdit} /> Update
                      </Button>
                    </Col>
                    <Col xs="6">
                      <Button
                        block
                        color="danger"
                        onClick={() =>
                          confirm().then((result) => {
                            if (result) {
                              moves.deleteThreat(val);
                            }
                          })
                        }
                      >
                        {/* @ts-expect-error @fortawesome/react-fontawesome uses an older version of @fortawesome/fontawesome-svg-core (1.3.0), which makes the types incompatible. It still works correctly at runtime. */}
                        <FontAwesomeIcon icon={faTrash} /> Remove
                      </Button>
                    </Col>
                  </Row>
                </CardFooter>
              </Collapse>
            </Card>
          ))}
          {identifiedThreats.length <= 0 && (
            <em className="text-muted">
              No threats identified for this component yet.
            </em>
          )}
          <hr />
          {threats.map((val: ThreatDragonThreat, idx: number) => (
            <Card key={idx}>
              <CardHeader
                className="hoverable"
                onClick={() => moves.selectThreat(val.id)}
              >
                <strong>{val.title}</strong>
                <Row>
                  <Col xs="6">
                    <small>{val.type}</small>
                  </Col>
                  <Col xs="3">
                    <small>{val.severity}</small>
                  </Col>
                  <Col xs="3">
                    <small className="float-right">
                      &mdash;{' '}
                      {typeof val.owner !== 'undefined' ? val.owner : 'NA'}
                    </small>
                  </Col>
                </Row>
              </CardHeader>
              <Collapse isOpen={G.selectedThreat === val.id}>
                <CardBody>
                  <CardText>{nl2br(val.description)}</CardText>
                  <hr />
                  <CardText>{nl2br(val.mitigation)}</CardText>
                </CardBody>
              </Collapse>
            </Card>
          ))}
          {threats.length <= 0 && (
            <em className="text-muted">
              No existing threats for this component.
            </em>
          )}
        </CardBody>
      </Card>
      <ThreatModal
        isOpen={G.threat.modal}
        G={G}
        playerID={playerID}
        moves={moves}
        names={names}
      />
    </div>
  );
};

export default Threatbar;
