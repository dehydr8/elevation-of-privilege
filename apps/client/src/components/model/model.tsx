import classnames from 'classnames';
import * as joint from 'jointjs';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import Helmet from 'react-helmet';

import 'jointjs/dist/joint.css';

import '../../jointjs/joint-tm.css';
import '../../jointjs/shapes';

import './model.css';

import type { ThreatDragonModel } from '@eop/shared';

const SCROLL_SPEED = 1000;

type ModelProps = {
  model: ThreatDragonModel;
  selectedDiagram: number;
  selectedComponent: string;
  onSelectDiagram: (id: number) => void;
  onSelectComponent: (id: string) => void;
};

const Model: FC<ModelProps> = ({
  model,
  selectedDiagram,
  selectedComponent,
  onSelectDiagram,
  onSelectComponent,
}) => {
  const [graph] = useState(
    new joint.dia.Graph({}, { cellNamespace: joint.shapes }),
  );

  const createPaper = useCallback(
    (el?: HTMLElement) =>
      new joint.dia.Paper({
        el,
        width: window.innerWidth,
        height: window.innerHeight,
        model: graph,
        interactive: false,
        gridSize: 10,
        drawGrid: true,
      }),
    [graph],
  );

  const [paper, setPaper] = useState(createPaper());

  const placeholderRef = useCallback(
    (el: HTMLElement | null) => {
      if (el !== null) {
        setPaper(createPaper(el));
      }
    },
    [createPaper],
  );

  const [dragging, setDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    graph.fromJSON(model.detail.diagrams[selectedDiagram].diagramJson);
    //paper.fitToContent(1, 1, 10, { allowNewOrigin: "any" });
  }, [graph, model, selectedDiagram]);

  useEffect(() => {
    // unhighlight all
    paper.model.getElements().forEach((e) => {
      paper.findViewByModel(e).unhighlight();
    });
    paper.model.getLinks().forEach((e) => {
      paper.findViewByModel(e).unhighlight();
    });

    // highlight the selected component
    const selectedComponentView = paper.findViewByModel(selectedComponent);
    if (selectedComponentView) {
      selectedComponentView.highlight();
    }
  }, [paper, selectedComponent]);

  useEffect(() => {
    const onCellPointerClick = (cellView: joint.dia.CellView) => {
      if (cellView.model.attributes.type !== 'tm.Boundary') {
        onSelectComponent(cellView.model.id.toString());
      }
    };

    const onBlankPointerClick = () => {
      onSelectComponent('');
    };

    const setDragPositionScaled = (x: number, y: number) => {
      const scale = joint.V(paper.layers).scale();
      setDragPosition({ x: x * scale.sx, y: y * scale.sy });
    };

    const onBlankPointerDown = (
      event: joint.dia.Event,
      x: number,
      y: number,
    ) => {
      setDragging(true);
      setDragPositionScaled(x, y);
    };

    const stopDragging = (x: number, y: number) => {
      setDragging(false);
      setDragPositionScaled(x, y);
    };

    const onCellPointerUp = (
      cellView: joint.dia.CellView,
      event: joint.dia.Event,
      x: number,
      y: number,
    ) => {
      stopDragging(x, y);
    };

    const onBlankPointerUp = (event: joint.dia.Event, x: number, y: number) => {
      stopDragging(x, y);
    };

    paper.on('cell:pointerclick', onCellPointerClick);
    paper.on('blank:pointerclick', onBlankPointerClick);
    paper.on('blank:pointerdown', onBlankPointerDown);
    paper.on('cell:pointerup', onCellPointerUp);
    paper.on('blank:pointerup', onBlankPointerUp);

    return () => {
      paper.off('cell:pointerclick', onCellPointerClick);
      paper.off('blank:pointerclick', onBlankPointerClick);
      paper.off('blank:pointerdown', onBlankPointerDown);
      paper.off('cell:pointerup', onCellPointerUp);
      paper.off('blank:pointerup', onBlankPointerUp);
    };
  }, [paper, onSelectComponent]);

  const mouseWheel = useCallback(
    ({ nativeEvent: e }: React.WheelEvent) => {
      const delta = -e.deltaY / SCROLL_SPEED;
      const newScale = joint.V(paper.layers).scale().sx + delta;
      paper.translate(0, 0);
      const p = offsetToLocalPoint(e.offsetX, e.offsetY, paper);
      paper.scale(newScale, newScale, p.x, p.y);
    },
    [paper],
  );

  const mouseMove = useCallback(
    ({ nativeEvent: e }: React.MouseEvent) => {
      if (dragging) {
        const x = e.offsetX;
        const y = e.offsetY;
        paper.translate(x - dragPosition.x, y - dragPosition.y);
      }
    },
    [dragging, paper, dragPosition.x, dragPosition.y],
  );

  return (
    <div className="model">
      <div>
        <Helmet>
          <title>EoP - {model.summary.title}</title>
        </Helmet>
        <h1 style={{ padding: '10px 15px' }}>{model.summary.title}</h1>
        <Nav tabs>
          {model.detail.diagrams.map((d, idx) => (
            <NavItem key={idx}>
              <NavLink
                className={classnames({
                  active: selectedDiagram === idx,
                })}
                onClick={() => onSelectDiagram(idx)}
              >
                {d.title}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </div>
      <div
        className="placeholder"
        ref={placeholderRef}
        onMouseMove={mouseMove}
        onWheel={mouseWheel}
      />
    </div>
  );
};

export default Model;

const offsetToLocalPoint = (
  offsetX: number,
  offsetY: number,
  paper: joint.dia.Paper,
) => {
  // Finds mouse position in unscaled version
  const svgPoint = paper.svg.createSVGPoint();
  svgPoint.x = offsetX;
  svgPoint.y = offsetY;
  const offsetTransformed = svgPoint.matrixTransform(
    paper.layers.getCTM()?.inverse(),
  );
  return offsetTransformed;
};
