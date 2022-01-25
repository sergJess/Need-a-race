import '../../scss/page/page-starting.scss';
import GaragePage from './garage-page';

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
				page.append(pageControlInner);
    pageControlInner.classList.add('page-control');
    const garageButton = document.createElement('button');
    garageButton.textContent = 'Garage';
    garageButton.classList.add('page-starting-button');
				const garagePage = new GaragePage(page);
    garageButton.onclick = ():void => {
      if (this.pageStatus === 'garage') {
        return;
      }
      this.pageStatus = 'garage';
						garagePage.show();
    };
    const winnersButton = document.createElement('button');
    winnersButton.textContent = 'Winners';
    winnersButton.classList.add('page-starting-button');
    winnersButton.onclick = ():void => {
      if (this.pageStatus === 'winners') {
        return;
      }
      this.pageStatus = 'winners';
						garagePage.hide();
    };
				garagePage.render();
    pageControlInner.append(garageButton, winnersButton);
    this.parent.append(page);
  }
}
