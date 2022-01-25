import '../../scss/page/page-starting.scss';

export default class Start {
  private parent: HTMLElement;

  private pageStatus: string = 'garage';

  constructor(parent:HTMLElement) {
    this.parent = parent;
  }

  render(): void {
    const page:HTMLElement = document.createElement('div');
    page.classList.add('page-starting');
    const pageControlInner = document.createElement('div');
    pageControlInner.classList.add('page-control');
    const garageButton = document.createElement('button');
    garageButton.textContent = 'Garage';
    garageButton.classList.add('page-starting-button');
    garageButton.onclick = ():void => {
      if (this.pageStatus === 'garage') {
        return;
      }
      this.pageStatus = 'garage';
    };
    const winnersButton = document.createElement('button');
    winnersButton.textContent = 'Winners';
    winnersButton.classList.add('page-starting-button');
    winnersButton.onclick = ():void => {
      if (this.pageStatus === 'winners') {
        return;
      }
      this.pageStatus = 'winners';
    };
    pageControlInner.append(garageButton, winnersButton);
    page.append(pageControlInner);
    this.parent.append(page);
  }
}
