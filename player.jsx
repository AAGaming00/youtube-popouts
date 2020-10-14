const { React, ReactDOM, getModuleByDisplayName } = require('powercord/webpack');
const { Icon } = require('powercord/components')
module.exports = class Player extends React.Component {
  constructor (props) {
    super(props);
    this.state = { width: window.innerWidth,
    height: window.innerHeight,
    closing: false, render: true };
    this.el = document.createElement('div');
    this.playContainer = document.querySelector('.playerContainer')
  }

  componentDidMount () {
    this.updateWindowDimensions();
    this.playContainer.appendChild(this.el);
    window.addEventListener('resize', this.updateWindowDimensions);
    //console.log(this.el)
  }

  componentWillUnmount () {
    this.playContainer.removeChild(this.el);
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ ...this.state, width: window.innerWidth,
      height: window.innerHeight });
  }

  close() {
    this.setState({ ...this.state, closing: true });
    setTimeout(() => {
    this.setState({ ...this.state, render: false });
    this.componentWillUnmount()
    }, 300);
  }

  render () {
    const Draggable = getModuleByDisplayName('Draggable', false);
    return ReactDOM.createPortal(
        <>
      {this.state.render ? 
        <Draggable
            dragAnywhere = {true}
            className = 'pictureInPictureWindow-1B5qSe playerDrag'
            maxX = {this.state.width}
            maxY = {this.state.height}
            initialX= {50}
            initialY= {50}
        >
          <div className={`playerContent ${this.state.closing ? 'playerClose' : ''}`}>
            <div className='playerTitle'>
                <div onClick={() => this.close()}>
                    <Icon style={{float: 'right', color: '#ffffff'}} name="Close"/>
                </div>
            </div>
            <iframe className="playerVideo" width="400" height="225" src={`https://www.youtube.com/embed/${this.props.id}?autoplay=1`} frameBorder="0" allowFullScreen="" sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"/>
          </div>
        </Draggable> : null}
        </>,
        this.el)
  }
};
