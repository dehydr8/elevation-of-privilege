import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { getSuitDisplayName, getSuits } from '../../../utils/cardDefinitions';

class ThreatModal extends React.Component {
  static get propTypes() {
    return {
      playerID: PropTypes.any,
      G: PropTypes.any.isRequired,
      ctx: PropTypes.any.isRequired,
      moves: PropTypes.any.isRequired,
      names: PropTypes.any.isRequired,
      isOpen: PropTypes.bool.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      mitigation: '',
      showMitigation: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.G.threat.title !== this.props.G.threat.title ||
      prevProps.G.threat.description !== this.props.G.threat.description ||
      prevProps.G.threat.mitigation !== this.props.G.threat.mitigation
    ) {
      this.setState({
        title: this.props.G.threat.title,
        description: this.props.G.threat.description,
        mitigation: this.props.G.threat.mitigation,
      });
    }
  }

  saveThreat() {
    for (let field in ['title', 'description', 'mitigation']) {
      if (this.props.G.threat[field] !== this.state[field]) {
        this.props.moves.updateThreat(field, this.state[field]);
      }
    }

    if (!this.props.G.threat.mitigation) {
      this.props.moves.updateThreat('mitigation', 'No mitigation provided.');
    }
  }

  addOrUpdate() {
    // update the values from the state
    this.saveThreat();
    this.props.moves.addOrUpdateThreat();
    this.toggleMitigationField(false);
  }

  toggleMitigationField(isShown) {
    this.setState({
      showMitigation: isShown,
    });
  }

  get isInvalid() {
    return _.isEmpty(this.state.description) || _.isEmpty(this.state.title);
  }

  get isOwner() {
    return this.props.G.threat.owner === this.props.playerID;
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen}>
        <Form>
          <ModalHeader
            toggle={
              this.isOwner ? () => this.props.moves.toggleModal() : undefined
            }
            style={{ width: '100%' }}
          >
            {this.props.G.threat.new ? 'Add' : 'Update'} Threat &mdash;{' '}
            <small className="text-muted">
              being {this.props.G.threat.new ? 'added' : 'updated'} by{' '}
              {this.props.names[this.props.G.threat.owner]}
            </small>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                type="text"
                name="title"
                id="title"
                disabled={!this.isOwner}
                autoComplete="off"
                value={this.state.title}
                onBlur={(e) =>
                  this.props.moves.updateThreat('title', e.target.value)
                }
                onChange={(e) => this.setState({ title: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label for="type">Threat type</Label>
              <Input
                type="select"
                name="type"
                id="type"
                disabled={!this.isOwner}
                value={this.props.G.threat.type}
                onChange={(e) =>
                  this.props.moves.updateThreat('type', e.target.value)
                }
              >
                {getSuits(this.props.G.gameMode).map((suit) => (
                  <option value={suit} key={`threat-category-${suit}`}>
                    {getSuitDisplayName(this.props.G.gameMode, suit)}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="severity">Severity</Label>
              <Input
                type="select"
                name="severity"
                id="severity"
                disabled={!this.isOwner}
                value={this.props.G.threat.severity}
                onChange={(e) =>
                  this.props.moves.updateThreat('severity', e.target.value)
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                disabled={!this.isOwner}
                style={{ height: 150 }}
                value={this.state.description}
                onBlur={(e) =>
                  this.props.moves.updateThreat('description', e.target.value)
                }
                onChange={(e) => this.setState({ description: e.target.value })}
              />
            </FormGroup>
            <FormGroup hidden={!this.isOwner}>
              <div className="checkbox-item">
                <Input
                  className="pointer"
                  type="checkbox"
                  id="showMitigation"
                  onChange={(e) => this.toggleMitigationField(e.target.checked)}
                />
                <Label for="showMitigation">
                  Add a mitigation <em>(optional)</em>
                </Label>
              </div>
            </FormGroup>
            <FormGroup hidden={this.isOwner && !this.state.showMitigation}>
              <Label for="mitigation">Mitigation</Label>
              <Input
                type="textarea"
                name="mitigation"
                id="mitigation"
                disabled={!this.isOwner}
                style={{ height: 150 }}
                value={this.state.mitigation}
                onBlur={(e) =>
                  this.props.moves.updateThreat('mitigation', e.target.value)
                }
                onChange={(e) => this.setState({ mitigation: e.target.value })}
              />
            </FormGroup>
          </ModalBody>
          {this.isOwner && (
            <ModalFooter>
              <Button
                color="primary"
                className="mr-auto"
                disabled={this.isInvalid}
                onClick={() => this.addOrUpdate()}
              >
                Save
              </Button>
              <Button
                color="secondary"
                onClick={() => this.props.moves.toggleModal()}
              >
                Cancel
              </Button>
            </ModalFooter>
          )}
        </Form>
      </Modal>
    );
  }
}

export default ThreatModal;
