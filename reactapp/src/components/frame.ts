export default class Frame {
  public image: any;
  public src: any;

  constructor(src: any, onLoaded: any) {
    this.image = new Image();
    this.src = src;

    this.image.onload = onLoaded();
    this.image.src = this.src;
  }
}
