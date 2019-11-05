import { Component, HTMLProps } from "react";
import React from "react";
import { Identicon } from "icbint";

interface IdenticonProps extends HTMLProps<HTMLElement> {
  identicon: Identicon;
  computingSize: number;
}

export class IdenticonComponent extends Component<IdenticonProps> {
  canvas: HTMLCanvasElement | undefined | null;
  size: number;

  constructor(props: IdenticonProps) {
    super(props);
    this.size = 0;
  }

  componentDidMount() {
    this.updateCanvas();
    window.addEventListener("resize", this.updateCanvas);
  }

  updateCanvas() {
    if (this.canvas) {
      const ctx = this.canvas.getContext("2d");
      const size = this.props.computingSize;
      this.canvas.width = size;
      this.canvas.height = size;
      this.props.identicon.drawOnCanvasContext(ctx, size);
    }
  }

  render() {
    return (
      <canvas className={this.props.className} ref={ref => (this.canvas = ref)}>
        Drawing of an Identicon
      </canvas>
    );
  }
}
