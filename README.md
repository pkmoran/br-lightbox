# Simple React Lightbox
A very simple image lightbox react component

# Example usage
```jsx
  <Lightbox
    isOpen={imageLightboxOpen}
    images={
      [
        { src: '<some-valid-img-src>' }
      ]
    }
    onClose={this.closeImages}
  />
```

# Options

| Prop | Type | Required | Description |
|:----:|:----:|:--------:|:----------:|
|isOpen| bool | yes      | Whether or not the lightbox is open|
|images|array | yes      | Array of image objects for the lightbox. Object must have a `src` property that is a valid src for an `<img>` tag. All other properties are ignored for now.
|onClose|func|yes|Callback to close the lightbox|
