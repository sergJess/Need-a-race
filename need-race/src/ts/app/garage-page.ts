import '../../scss/garage/garage-page.scss';

export default class GaragePage {
  private parent: HTMLElement;

  constructor(parent:HTMLElement) {
    this.parent = parent;
  }

  render():void {
    const carsInner:HTMLElement = document.createElement('div');
    carsInner.classList.add('garage-cars-inner');
  }
}
