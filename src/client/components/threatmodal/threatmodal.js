import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { STARTING_CARD_MAP } from '../../../utils/constants';
import { getTypeString } from '../../../utils/utils';
import _ from 'lodash';

class ThreatModal extends React.Component {
  static propTypes = {
    playerID: PropTypes.any,
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    moves: PropTypes.any.isRequired,
    names: PropTypes.any.isRequired,
    isOpen: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      mitigation: "",
      showMigitation: false,
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.G.threat.title !== this.props.G.threat.title
      || prevProps.G.threat.description !== this.props.G.threat.description
      || prevProps.G.threat.mitigation !== this.props.G.threat.mitigation) {
      this.setState({
        ...this.state,
        title: this.props.G.threat.title,
        description: this.props.G.threat.description,
        mitigation: this.props.G.threat.mitigation,
      });
    }
  }

  saveThreat() {
    for (let field in ["title", "description", "mitigation"]) {
      if (this.props.G.threat[field] !== this.state[field]) {
        this.props.moves.updateThreat(field, this.state[field]);
      }
    }

    if (!this.props.G.threat.mitigation) {
      this.props.moves.updateThreat("mitigation", "No mitigation provided.")
    }
  }

  addOrUpdate() {
    // update the values from the state
    this.saveThreat();
    this.props.moves.addOrUpdateThreat();
    this.toggleMitigationForm(false);
  }

  updateState(field, value) {
    this.setState({
      ...this.state,
      [field]: value,
    })
  }

  toggleMitigationForm(isShown) {
    this.setState({
      ...this.state,
      showMigitation: isShown,
    });
  }

  isInvalid() {
    return this.props.G.threat.owner !== this.props.playerID ||_.isEmpty(this.state.description) || _.isEmpty(this.state.title);
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen}>
        <Form>
          <ModalHeader toggle={() => this.props.moves.toggleModal()} style={{ width: "100%" }}>
            {(this.props.G.threat.new ? 'Add' : 'Update')} Threat
            {' '}
            &mdash;
            {' '}
            <small className="text-muted">being {(this.props.G.threat.new ? 'added' : 'updated')} by {this.props.names[this.props.G.threat.owner]}</small>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input type="text" name="title" id="title" disabled={this.props.G.threat.owner !== this.props.playerID} autoComplete="off" value={this.state.title} onBlur={(e) => this.props.moves.updateThreat("title", e.target.value)} onChange={(e) => this.updateState("title", e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="type">Threat type</Label>
              <Input type="select" name="type" id="type" disabled={this.props.G.threat.owner !== this.props.playerID} value={this.props.G.threat.type} onChange={(e) => this.props.moves.updateThreat("type", e.target.value)}>
                {
                  Object.keys(STARTING_CARD_MAP[this.props.G.gameMode]).map(suit => (
                    <option value={suit} key={`threat-category-${suit}`}>{getTypeString(suit, this.props.G.gameMode)}</option>
                  ))
                }
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="severity">Severity</Label>
              <Input type="select" name="severity" id="severity" disabled={this.props.G.threat.owner !== this.props.playerID} value={this.props.G.threat.severity} onChange={(e) => this.props.moves.updateThreat("severity", e.target.value)}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input type="textarea" name="description" id="description" disabled={this.props.G.threat.owner !== this.props.playerID} style={{ height: 150 }} value={this.state.description} onBlur={(e) => this.props.moves.updateThreat("description", e.target.value)} onChange={(e) => this.updateState("description", e.target.value)} />
            </FormGroup>
            <FormGroup hidden={this.props.G.threat.owner !== this.props.playerID}>
              <div className="checkbox-item">
                <Input className="pointer" type="checkbox" id="showMitigation" onChange={(e) => this.toggleMitigationForm(e.target.checked)} />
                <Label for="showMitigation">Add a mitigation <em>(optional)</em></Label>
              </div>
            </FormGroup>
            <FormGroup hidden={this.props.G.threat.owner === this.props.playerID && !this.state.showMigitation}>
              <Label for="mitigation">Mitigation</Label>
              <Input type="textarea" name="mitigation" id="mitigation" disabled={this.props.G.threat.owner !== this.props.playerID} style={{ height: 150 }} value={this.state.mitigation} onBlur={(e) => this.props.moves.updateThreat("mitigation", e.target.value)} onChange={(e) => this.updateState("mitigation", e.target.value)} />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="success" className="mr-auto" hidden={this.props.G.threat.owner !== this.props.playerID} onClick={() => this.saveThreat()}>Save</Button>{' '}
            <Button color="primary" disabled={this.isInvalid()} onClick={() => this.addOrUpdate()}>{(this.props.G.threat.new ? 'Save & Add' : 'Save & Update')}</Button>{' '}
            <Button color="secondary" disabled={this.props.G.threat.owner !== this.props.playerID} onClick={() => this.props.moves.toggleModal()}>Cancel</Button>
          </ModalFooter>
          <ModalFooter hidden={this.props.G.threat.owner !== this.props.playerID}>
            <small className="mr-auto text-muted"><b>TIP:</b> Saving would allow other players to view your changes instantly.</small>
          </ModalFooter>
        </Form>
      </Modal>
    )
  }
}

export default ThreatModal;