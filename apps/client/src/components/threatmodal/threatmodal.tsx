import type { BoardProps } from 'boardgame.io/react';
import _ from 'lodash';
import React, { FC, useCallback, useEffect, useState } from 'react';
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
import {
  getSuitDisplayName,
  getSuits,
  ModelType,
  resolvePlayerName,
} from '@eop/shared';

import type { GameState } from '@eop/shared';

type ThreatModalProps = {
  names: string[];
  isOpen: boolean;
} & Pick<BoardProps<GameState>, 'G' | 'moves' | 'playerID'>;

const ThreatModal: FC<ThreatModalProps> = ({
  playerID,
  G,
  moves,
  names,
  isOpen,
}) => {
  const [title, setTitle] = useState(G.threat.title);
  const [description, setDescription] = useState(G.threat.description);
  const [mitigation, setMitigation] = useState(G.threat.mitigation);
  const [showMitigation, setShowMitigation] = useState(false);

  useEffect(() => {
    setTitle(G.threat.title);
    setDescription(G.threat.description);
    setMitigation(G.threat.mitigation);
  }, [G.threat.title, G.threat.description, G.threat.mitigation]);

  const isPrivacyEnhancedMode = G.modelType === ModelType.PRIVACY_ENHANCED;
  const isOwner = G.threat.owner === playerID;
  const isInvalid = _.isEmpty(title);

  const saveThreat = () => {
    if (G.threat.title !== title) {
      moves.updateThreat('title', title);
    }

    const descriptionToUse = description ?? 'No description provided.';
    if (G.threat.description !== descriptionToUse) {
      moves.updateThreat('description', descriptionToUse);
    }

    if (G.threat.mitigation !== mitigation) {
      moves.updateThreat('mitigation', mitigation);
    }

    if (!G.threat.mitigation) {
      moves.updateThreat('mitigation', 'No mitigation provided.');
    }
  };

  const addOrUpdate = () => {
    // update the values from the state
    saveThreat();
    moves.addOrUpdateThreat();
    setShowMitigation(false);
  };

  const threatDetailModalBody = useCallback(
    () => (
      <ModalBody>
        <FormGroup>
          <Label for="title">Title</Label>
          <Input
            type="text"
            name="title"
            id="title"
            disabled={!isOwner}
            autoComplete="off"
            value={title}
            onBlur={(e) => moves.updateThreat('title', e.target.value)}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="type">Threat type</Label>
          <Input
            type="select"
            name="type"
            id="type"
            disabled={!isOwner}
            value={G.threat.type}
            onChange={(e) => moves.updateThreat('type', e.target.value)}
          >
            {getSuits(G.gameMode).map((suit) => (
              <option value={suit} key={`threat-category-${suit}`}>
                {getSuitDisplayName(G.gameMode, suit)}
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
            disabled={!isOwner}
            value={G.threat.severity}
            onChange={(e) => moves.updateThreat('severity', e.target.value)}
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
            disabled={!isOwner}
            style={{ height: 150 }}
            value={description}
            onBlur={(e) => moves.updateThreat('description', e.target.value)}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormGroup>
        <FormGroup hidden={!isOwner}>
          <div className="checkbox-item">
            <Input
              className="pointer"
              type="checkbox"
              id="showMitigation"
              onChange={(e) => setShowMitigation(e.target.checked)}
            />
            <Label for="showMitigation">
              Add a mitigation <em>(optional)</em>
            </Label>
          </div>
        </FormGroup>
        <FormGroup hidden={isOwner && !showMitigation}>
          <Label for="mitigation">Mitigation</Label>
          <Input
            type="textarea"
            name="mitigation"
            id="mitigation"
            disabled={!isOwner}
            style={{ height: 150 }}
            value={mitigation}
            onBlur={(e) => moves.updateThreat('mitigation', e.target.value)}
            onChange={(e) => setMitigation(e.target.value)}
          />
        </FormGroup>
      </ModalBody>
    ),
    [
      isOwner,
      title,
      G.threat.type,
      G.gameMode,
      G.threat.severity,
      description,
      showMitigation,
      mitigation,
      moves,
    ], // TODO: add eslint rule to check for exhaustive dependencies
  );

  const threatRestrictedDetailModalBody = useCallback(
    () => (
      <ModalBody>
        <FormGroup>
          <Label for="referenceInputField">
            Reference <em>(e.g. link to external bug tracking system)</em>
          </Label>
          <Input
            type="text"
            name="referenceInputField"
            disabled={!isOwner}
            autoComplete="off"
            value={title}
            onBlur={(e) => moves.updateThreat('title', e.target.value)}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormGroup>
      </ModalBody>
    ),
    [isOwner, title, moves],
  );

  return (
    <Modal isOpen={isOpen}>
      <Form>
        <ModalHeader
          toggle={isOwner ? () => moves.toggleModal() : undefined}
          style={{ width: '100%' }}
        >
          {G.threat.new ? 'Add' : 'Update'} Threat &mdash;{' '}
          <small className="text-muted">
            being {G.threat.new ? 'added' : 'updated'} by{' '}
            {resolvePlayerName(G.threat.owner ?? '', names, playerID)}
          </small>
        </ModalHeader>

        {isPrivacyEnhancedMode
          ? threatRestrictedDetailModalBody()
          : threatDetailModalBody()}

        {isOwner && (
          <ModalFooter>
            <Button
              color="primary"
              className="mr-auto"
              disabled={isInvalid}
              onClick={() => addOrUpdate()}
            >
              Save
            </Button>
            <Button color="secondary" onClick={() => moves.toggleModal()}>
              Cancel
            </Button>
          </ModalFooter>
        )}
      </Form>
    </Modal>
  );
};

export default ThreatModal;
