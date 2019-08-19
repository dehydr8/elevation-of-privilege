import React from 'react';
import PropTypes from 'prop-types';
import joint from 'jointjs/index';
import 'jointjs/dist/joint.css'
import '../../jointjs/joint-tm.css'
// eslint-disable-next-line
import Shapes from '../../jointjs/shapes'
import { Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import './model.css';
import Helmet from 'react-helmet';

const SPEED = 20;

class Model extends React.Component {
  static propTypes = {
    model: PropTypes.any,
    selectedDiagram: PropTypes.number.isRequired,
    selectedComponent: PropTypes.string.isRequired,
    onSelectDiagram: PropTypes.func.isRequired,
    onSelectComponent: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      placeholder: React.createRef(),
      graph: new joint.dia.Graph(),
      paper: null,
      dragging: false,
      dragPosition: {
        x: 0,
        y: 0,
      }
    }
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseWheel = this.mouseWheel.bind(this);
  }

  offsetToLocalPoint(offsetX, offsetY, paper) {
    var svgPoint = paper.svg.createSVGPoint();
    svgPoint.x = offsetX;
    svgPoint.y = offsetY;
    var offsetTransformed = svgPoint.matrixTransform(paper.viewport.getCTM().inverse());
    return offsetTransformed;
  }

  mouseWheel(e) {
    e = e.nativeEvent;
    var delta = Math.max(-1, Math.min(1, e.wheelDelta)) / SPEED;
    var newScale = joint.V(this.state.paper.viewport).scale().sx + delta;

    this.state.paper.setOrigin(0, 0); // reset the previous 'translate'
    var p = this.offsetToLocalPoint(e.offsetX, e.offsetY, this.state.paper);
    this.state.paper.scale(newScale, newScale, p.x, p.y);
  }

  mouseMove(e) {
    if (this.state.dragging) {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      this.state.paper.translate(
        x - this.state.dragPosition.x, 
        y - this.state.dragPosition.y
      );
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.model !== prevProps.model || this.props.selectedDiagram !== prevProps.selectedDiagram) {
      this.updateDiagram(this.state.paper);
      this.updateSelection(this.state.paper);
    }

    if (this.props.selectedComponent !== prevProps.selectedComponent) {
      this.updateSelection(this.state.paper);
    }
  }

  updateSelection(paper) {
    // unhighlight all
    for (var k in paper._views){
      if (paper._views.hasOwnProperty(k)) {
        paper._views[k].unhighlight();
      }
    }

    // highlight the selected component
    if (this.props.selectedComponent in paper._views) {
      paper._views[this.props.selectedComponent].highlight();
    }
  }

  updateDiagram(paper) {
    if (this.props.model !== null && paper !== null) {
      this.state.graph.fromJSON(this.props.model.detail.diagrams[this.props.selectedDiagram].diagramJson);
      //paper.fitToContent(1, 1, 10, { allowNewOrigin: "any" });
    }
  }

  componentDidMount() {
    let paper = new joint.dia.Paper({
      el: this.state.placeholder.current,
      width: window.innerWidth,
      height: window.innerHeight,
      model: this.state.graph,
      interactive: false,
      gridSize: 10,
      drawGrid: true,
    });

    this.setState({
      ...this.state,
      paper,
    });
    
    // setup callbacks
    let parent = this;
    paper.on('cell:pointerclick', function(cellView) {
      if (cellView.model.attributes.type === "tm.Boundary")
        return;

      parent.props.onSelectComponent(cellView.model.id);
    });
    paper.on('blank:pointerclick', function() {
      if (parent.props.selectedComponent !== "") {
        parent.props.onSelectComponent("");
      }
    });
    paper.on('blank:pointerdown', function(event, x, y) {
      parent.setState({
        ...parent.state,
        dragging: true,
        dragPosition: {
          x,
          y,
        },
      });
    });
    paper.on('cell:pointerup blank:pointerup', function(event, x, y) {
      parent.setState({
        ...parent.state,
        dragging: false,
        dragPosition: {
          x,
          y,
        },
      });
    });

    // initial render
    this.updateDiagram(paper);
    this.updateSelection(paper);
  }

  render() {
    let content = <div />;

    if (this.props.model === null) {
      content = (
        <h1>No Model</h1>
      );
    } else {
      content = (
        <div>
          <Helmet>
            <title>EoP - {this.props.model.summary.title}</title>
          </Helmet>
          <h1 style={{ padding: "10px 15px" }}>{this.props.model.summary.title}</h1>
          <Nav tabs>
            {this.props.model.detail.diagrams.map((d, idx) => (
            <NavItem key={idx}>
              <NavLink
                className={classnames({ active: this.props.selectedDiagram === idx })}
                onClick={() => this.props.onSelectDiagram(idx)}
              >
                {d.title}
              </NavLink>
            </NavItem>
            ))}
          </Nav>
        </div>
      )
    }

    return (
      <div className="model">
        {content}
        <div className="placeholder" ref={this.state.placeholder} onMouseMove={this.mouseMove} onWheel={this.mouseWheel} />
      </div>
    );
  }
}

export default Model;