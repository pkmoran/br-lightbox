import React, { Component } from 'react';

import './lightbox.scss';

export default class Lightbox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPosition: 0, // the current item in the images array
      height: 0, // the height of the current image
      width: 0, // the width of the current image
    };
  }

  componentWillMount() {
    document.addEventListener('keydown', (e) => {
      const ESCAPE_KEY = 27;

      if (this.props.isOpen && e.keyCode === ESCAPE_KEY) {
        this.props.onClose();
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { images, isOpen } = this.props;
    const { currentPosition } = this.state;

    if (isOpen) {
      if (images !== prevProps.images && !!images.length) {
        // remove anything that is in the image container already
        while (this.imageContainer.firstChild) {
          this.imageContainer.removeChild(this.imageContainer.firstChild);
        }

        // set the shown image to the first image in the list
        const img = new Image();
        img.src = images[0].src;
        img.classList = 'lightbox__image';
        const component = this;
        // if the images is too big, constrain it
        const maxWidth = document.body.clientWidth * 0.7;
        const maxHeight = document.body.clientHeight * 0.9;
        img.onload = function() {
          this.width = this.width > maxWidth ? maxWidth : this.width;
          this.height = this.height > maxHeight ? maxHeight : this.height;

          component.setState({
            width: this.width,
            height: this.height,
          });
          component.imageContainer.appendChild(this);
        };
      } else if (currentPosition !== prevState.currentPosition) {
        while (this.imageContainer.firstChild) {
          this.imageContainer.removeChild(this.imageContainer.firstChild);
        }

        const img = new Image();
        img.src = images[currentPosition].src;
        img.classList = 'lightbox__image';
        const component = this;
        // if the images is too big, constrain it
        const maxWidth = document.body.clientWidth * 0.7;
        const maxHeight = document.body.clientHeight * 0.75;
        img.onload = function() {
          const imageRatio = this.height / this.width;
          if (imageRatio > 1) {
            // the height is larger so we need to constrain the height
            this.height = this.height > maxHeight ? maxHeight : this.height;
            this.width = this.height / imageRatio;
          } else {
            this.width = this.width > maxWidth ? maxWidth : this.width;
            this.height = this.width * imageRatio;
          }
          // this.width = this.width > maxWidth ? maxWidth : this.width;
          // this.height = this.height > maxHeight ? maxHeight : this.height;

          component.setState({
            width: this.width + this.width * 0.1,
            height: this.height + this.height * 0.1,
          });
          component.imageContainer.appendChild(this);
        };
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown');
  }

  nextImage = () => {
    const { images } = this.props;
    const { currentPosition } = this.state;
    let newPosition = currentPosition + 1;
    if (newPosition === images.length) {
      newPosition = 0;
    }
    this.setState({
      currentPosition: newPosition,
    });
  }

  previousImage = () => {
    const { images } = this.props;
    const { currentPosition } = this.state;
    let newPosition = currentPosition - 1;
    if (newPosition === 0) {
      newPosition = images.length - 1;
    }
    this.setState({
      currentPosition: newPosition,
    });
  }

  render() {
    const { height, width } = this.state;
    const { isOpen, onClose } = this.props;

    if (isOpen) {
      return (
        <div className='lightbox__container'>
          <div className='lightbox__content'>
            <div
              className='lightbox__previous'
              onClick={this.previousImage}
            >
              &lsaquo;
            </div>
            <div>
              <div
                className='lightbox__close'
                onClick={onClose}
              >
                Close (Esc) <i className='lightbox__x'>&times;</i>
              </div>
              <div
                ref={(div) => { this.imageContainer = div; }}
                className='lightbox__image-container'
                style={{
                  height: height,
                  width: width,
                }}
              />
            </div>
            <div
              className='lightbox__next'
              onClick={this.nextImage}
            >
              &rsaquo;
            </div>
          </div>
          <div className='lightbox__mask'/>
        </div>
      );
    } else {
      return null;
    }
  }
}
