const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { React, getModule } = require('powercord/webpack');
const button = require('./button');
module.exports = class YoutubePopout extends Plugin {
  isYouTubeLink (url) {
    return (/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(\?\S*)?$/gi).test(
      url
    );
  }

  getYouTubeVideoID (url) {
    const regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length == 11 ? match[1] : false;
  }

  startPlugin () {
    this.loadStylesheet('style.scss');
    this.element = document.createElement('div');
    this.element.classList.add('playerContainer');
    document.getElementById('app-mount').appendChild(this.element);
    const Anchor = getModule(m => m?.default?.displayName === 'Anchor', false);
    inject('youtube-link', Anchor, 'default', (args, res) => {
      if (!args[0].href || args[0]?.className?.includes('iconWrapper-21idzA')) {
        return res;
      } // discord is a garbage peice of software
      if (this.isYouTubeLink(args[0].href)) {
        //console.log(res.props.children);
        res.props.children = [ res.props.children ];
        res.props.children.push(React.createElement(button, { id: this.getYouTubeVideoID(args[0].href) }));
      }
      //console.log(args, res);
      return res;
    }, false);
    Anchor.default.displayName = 'Anchor';
  }

  pluginWillUnload () {
    uninject('youtube-link');
    document.getElementById('app-mount').removeChild(document.querySelector('.playerContainer'));
  }
};
