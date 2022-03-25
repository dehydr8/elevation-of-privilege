import {
  faBolt,
  faEdit,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
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
  ListGroup,
  ListGroupItem,
  Row,
} from 'reactstrap';
import confirm from 'reactstrap-confirm';
import { getSuitDisplayName } from '../../../utils/cardDefinitions';
import { getComponentName } from '../../../utils/utils';
import ThreatModal from '../threatmodal/threatmodal';
import './threatbar.css';

class Threatbar extends React.Component {
  static get propTypes() {
    return {
      playerID: PropTypes.any,
      model: PropTypes.any,
      G: PropTypes.any.isRequired,
      ctx: PropTypes.any.isRequired,
      moves: PropTypes.any.isRequired,
      active: PropTypes.bool.isRequired,
      names: PropTypes.any.isRequired,
      isInThreatStage: PropTypes.bool,
    };
  }

  static get defaultProps() {
    return {
      isInThreatStage: false,
    };
  }

  getSelectedComponent() {
    if (this.props.G.selectedComponent === '' || this.props.model === null) {
      return null;
    }

    let diagram =
      this.props.model.detail.diagrams[this.props.G.selectedDiagram]
        .diagramJson;
    for (let i = 0; i < diagram.cells.length; i++) {
      let cell = diagram.cells[i];
      if (cell.id === this.props.G.selectedComponent) {
        return cell;
      }
    }

    return null;
  }

  getThreatsForSelectedComponent() {
    let threats = [];
    if (this.props.G.selectedComponent === '' || this.props.model === null) {
      return threats;
    }

    let diagram =
      this.props.model.detail.diagrams[this.props.G.selectedDiagram]
        .diagramJson;
    for (let i = 0; i < diagram.cells.length; i++) {
      let cell = diagram.cells[i];
      if (this.props.G.selectedComponent !== '') {
        if (cell.id === this.props.G.selectedComponent) {
          if (Array.isArray(cell.threats)) {
            // fix threat ids
            for (let j = 0; j < cell.threats.length; j++) {
              if (!('id' in cell.threats[j])) {
                cell.threats[j].id = j + '';
              }
            }
            return cell.threats;
          }
        }
      } else {
        /*
        if (Array.isArray(cell.threats)) {
          threats = threats.concat(cell.threats);
        }
        */
      }
    }
    return threats;
  }

  getIdentifiedThreatsForSelectedComponent() {
    let threats = [];
    if (this.props.G.selectedDiagram in this.props.G.identifiedThreats) {
      if (
        this.props.G.selectedComponent in
        this.props.G.identifiedThreats[this.props.G.selectedDiagram]
      ) {
        for (let k in this.props.G.identifiedThreats[
          this.props.G.selectedDiagram
        ][this.props.G.selectedComponent]) {
          let t =
            this.props.G.identifiedThreats[this.props.G.selectedDiagram][
              this.props.G.selectedComponent
            ][k];
          threats.push(t);
        }
      }
    }

    return threats;
  }

  render() {
    const threats = [...this.getThreatsForSelectedComponent()].reverse();
    const identifiedThreats = [
      ...this.getIdentifiedThreatsForSelectedComponent(),
    ].reverse();
    const component = this.getSelectedComponent();
    const componentName = getComponentName(component);

    return (
      <div
        className="threat-bar"
        hidden={this.props.G.selectedComponent === ''}
      >
        <Card>
          <CardHeader>
            Threats for {componentName}{' '}
            <FontAwesomeIcon style={{ float: 'right' }} icon={faBolt} />
          </CardHeader>
          <CardBody className="threat-container">
            {this.props.playerID && (
              <Button
                color="primary"
                size="lg"
                block
                disabled={
                  this.props.G.selectedComponent === '' ||
                  !this.props.isInThreatStage ||
                  this.props.G.passed.includes(this.props.playerID) ||
                  !this.props.active
                }
                onClick={() => this.props.moves.toggleModal()}
              >
                <FontAwesomeIcon icon={faPlus} /> Add Threat
              </Button>
            )}
            <div hidden={component !== null && component.type !== 'tm.Flow'}>
              <hr />
              <Card>
                <CardHeader>Flow Data Elements</CardHeader>
                <ListGroup flush>
                  {component !== null &&
                    Array.isArray(component.dataElements) &&
                    component.dataElements.map((val, idx) => (
                      <ListGroupItem className="thin-list-group-item" key={idx}>
                        {val}
                      </ListGroupItem>
                    ))}
                  {component !== null &&
                    !Array.isArray(component.dataElements) && (
                      <ListGroupItem>
                        <em>No data elements defined</em>
                      </ListGroupItem>
                    )}
                </ListGroup>
              </Card>
            </div>
            <hr />
            {identifiedThreats.map((val, idx) => (
              <Card key={idx}>
                <CardHeader
                  className="hoverable"
                  onClick={() => this.props.moves.selectThreat(val.id)}
                >
                  <strong>{val.title}</strong>
                  <Row>
                    <Col xs="6">
                      <small>
                        {getSuitDisplayName(this.props.G.gameMode, val.type)}
                      </small>
                    </Col>
                    <Col xs="3">
                      <small>{val.severity}</small>
                    </Col>
                    <Col xs="3">
                      <small className="float-right">
                        &mdash; {this.props.names[val.owner]}
                      </small>
                    </Col>
                  </Row>
                </CardHeader>
                <Collapse isOpen={this.props.G.selectedThreat === val.id}>
                  <CardBody>
                    <CardText>{nl2br(val.description)}</CardText>
                    <hr />
                    <CardText>{nl2br(val.mitigation)}</CardText>
                  </CardBody>
                  <CardFooter hidden={val.owner !== this.props.playerID}>
                    <Row>
                      <Col xs="6">
                        <Button
                          block
                          onClick={() =>
                            this.props.moves.toggleModalUpdate(val)
                          }
                        >
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
                                this.props.moves.deleteThreat(val);
                              }
                            })
                          }
                        >
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
            {threats.map((val, idx) => (
              <Card key={idx}>
                <CardHeader
                  className="hoverable"
                  onClick={() => this.props.moves.selectThreat(val.id)}
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
                <Collapse isOpen={this.props.G.selectedThreat === val.id}>
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
          isOpen={this.props.G.threat.modal}
          G={this.props.G}
          ctx={this.props.ctx}
          playerID={this.props.playerID}
          moves={this.props.moves}
          names={this.props.names}
        />
      </div>
    );
  }
}

export default Threatbar;
