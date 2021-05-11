import React from 'react';
import Helmet from 'react-helmet';
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';
import Footer from '../components/footer/footer';
import Logo from '../components/logo/logo';
import '../styles/about.css';

class About extends React.Component {

  render() {
    return (
      <div>
        <Helmet bodyAttributes={{style: 'background-color : #000'}}/>
        <Container className="about" fluid>
          <Row style={{paddingTop: "20px"}}>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
              <div className="text-center">
                <Logo />
              </div>
              <Card>
                <CardHeader className="text-center">Elevation of Privilege</CardHeader>
                <CardBody>
                  <h1>About</h1>
                  <p>The Elevation of Privilege game is designed to be the easiest way to start looking at your design from a security perspective. It's one way to threat model, intended to be picked up and used by any development group.</p>
                  <p>Because the game uses STRIDE threats, it gives you a framework for thinking, and specific actionable examples of those threats.</p>
                  <h2>STRIDE stands for</h2>
                  <table className="table table-sm">
                    <tbody>
                      <tr>
                        <th scope="row">Spoofing</th>
                        <td>Impersonating something or someone else</td>
                      </tr>
                      <tr>
                        <th scope="row">Tampering</th>
                        <td>Modifying data or code</td>
                      </tr>
                      <tr>
                        <th scope="row">Repudiation</th>
                        <td>Claiming not to have performed an action</td>
                      </tr>
                      <tr>
                        <th scope="row">Information Disclosure</th>
                        <td>Exposing information to someone not authorized to see it</td>
                      </tr>
                      <tr>
                        <th scope="row">Denial of Service</th>
                        <td>Denying or degrading service to users</td>
                      </tr>
                      <tr>
                        <th scope="row">Elevation of Privilege</th>
                        <td>Gain capabilities without proper authorization</td>
                      </tr>
                    </tbody>
                  </table>
                  <h1>Preparing to play</h1>
                  <p>An Elevation of Privilege game is usually initiated for one of a few reasons. Those include because a group of developers has a system or feature to threat model, because someone wants to learn or teach the skill, or because someone has picked up a copy of the game and wants to explore.</p>
                  <p>This is a super-set of all non-game motivations to threat model. In any case, it is important to start with a system to be threat modelled, and an architectural diagram of that system should be available. A whiteboard diagram is ideal if participants agree it is reasonably accurate and it shows programs, data flows and data stores. For this version of the game, players should use a model created on <a target="_blank" rel="noopener noreferrer" href="https://docs.threatdragon.org/">Threat Dragon</a>. If no such model exists, it needs to be created before play starts.</p>
                  <p>Players need a way to track bugs hence using a Threat Dragon model is ideal.</p>
                  <h2>How to play</h2>
                  <p>Play starts by dealing out the entire deck (which is automatically done when the game is created), and ensuring players are familiar with the rules.</p>
                  <h2>Rules</h2>
                  <p>A player (most likely an engineer) developing the system would explain the diagram to everyone playing.</p>
                  <p>Play starts with the player with the 3 of Tampering, and then proceeds clockwise around the table in tricks.</p>
                  <p>The game has two phases, <strong>Play</strong> and <strong>Threat Identification</strong></p>
                  <p>In the <strong>Play</strong> phase, the current player would only be able to navigate through the diagram and/or select components.</p>
                  <p>When a card is dealt, the <strong>Threat Identification</strong> phase begins and players in any order can interact with the model and add threats or pass.</p>
                  <p>After all players pass, only then would the play resume.</p>
                  <p>Each trick is played 'in' the suit that was led. That is, each player must play a card of that suit if they have one. Playing a card consists of reading it aloud, and explaining how it applies to the system being threat modelled and the component affected. The players can record their threat by selecting the component and adding the associated threat.</p>
                  <p>Playing a card where a player knows of a compensating control is less exciting, but still valid, because it allows for discussion of compensating controls, and helps newcomers to threat modelling understand the cycle of discovery and mitigation.</p>
                  <p>If the player has no cards left in the suit that was led, then they may play a card from any suit, the game does that automatically and only valid cards are available to be played. After each player has played a card, the trick is won by the player who has played the highest card in either the suit that was led or in the 'trump' suit, Elevation of Privilege.</p>
                  <p>The highest card is the highest value card played in the suit led, unless there was one or more trump card played. If a trump card has been played, the highest value trump card is the winning card.</p>
                  <p>A point is awarded for every threat identified and for every hand that is won.</p>
                  <p>The final model with the threats can be downloaded at the end of the game.</p>
                  <h1>Credits</h1>
                  <p>The game was originally invented by <a target="_blank" rel="noopener noreferrer" href="https://adam.shostack.org/">Adam Shostack</a> at Microsoft. The <a target="_blank" rel="noopener noreferrer" href="http://download.microsoft.com/download/F/A/E/FAE1434F-6D22-4581-9804-8B60C04354E4/EoP_Whitepaper.pdf">EoP Whitepaper</a> written by Adam can be downloaded which describes the motivation, experience and lessons learned in creating the game.</p>
                  <p>The motivation for creating this online version of the game at Careem was due to a large number of teams working remotely across several geographies and we wanted to scale our method of teaching threat modeling to our engineering teams.</p>
                  <p>The game is built using <a href="https://boardgame.io/">boardgame.io</a>, a framework for developing turn based games. The graphics, icons and card images used in this version were extracted from the original card game built by Microsoft.</p>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col sm="12" md={{ size: 6, offset: 3 }} className="text-center">
              <Footer />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default About;