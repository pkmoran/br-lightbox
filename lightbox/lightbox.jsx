import React, { Component } from 'react';

import './lightbox.scss';

export default class Lightbox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPosition: null, // the current item in the images array
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

    if (isOpen !== prevProps.isOpen) {
      // if we are opening or closing the lightbox, set the current position accordingly
      if (isOpen) {
        this.setState({ currentPosition: 0 });
      } else {
        this.setState({ currentPosition: null });
      }
    }
    if (currentPosition !== prevState.currentPosition && currentPosition !== null) {
      // if the current position changes and isn't null, we are clicking through the images
      // if it is null, we have just closed the lightbox so do nothing

      while (this.imageContainer.firstChild) {
        // remove anything that is in there
        this.imageContainer.removeChild(this.imageContainer.firstChild);
      }

      // create a new image
      const img = new Image();

      // set the src attribute to the current image
      img.src = images[currentPosition].src;

      // give it a class
      img.classList = 'lightbox__image';

      // set the component context so we can use it in the img.onload function
      const component = this;

      // if the images is too big, constrain it
      const maxWidth = document.body.clientWidth * 0.7;
      const maxHeight = document.body.clientHeight * 0.75;

      // once the image has loaded we can access the actual height and width
      img.onload = function() {
        // get the image ratio in case we have to resize it
        // so we can retain the original proportions
        const imageRatio = this.height / this.width;

        if (imageRatio > 1) {
          // the height is larger so we need to constrain the height
          this.height = this.height > maxHeight ? maxHeight : this.height;

          // set the width using the original ratio
          this.width = this.height / imageRatio;
        } else {
          // the width is larger
          this.width = this.width > maxWidth ? maxWidth : this.width;

          // set the height using the original ratio
          this.height = this.width * imageRatio;
        }

        // dynamically set the size of the image container to the actual image size
        component.setState({
          width: this.width,
          height: this.height + 25, // to account for the close button
        });
        // add the image to the container
        component.imageContainer.appendChild(this);
      };
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
      // loop back around to the beginning
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
    if (newPosition <= 0) {
      // loop back around to the end
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
              className='lightbox__previous br-pointer'
              onClick={this.previousImage}
            >
              &lsaquo;
            </div>
            <div>
              <div
                className='lightbox__close br-pointer'
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
              className='lightbox__next br-pointer'
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
