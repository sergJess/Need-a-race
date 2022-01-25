import '../../scss/garage/garage-page.scss';

export default class GaragePage {
  private parent: HTMLElement;

  private garageBlock = document.createElement('div');

  constructor(parent:HTMLElement) {
    this.parent = parent;
  }

  show():void {
    this.garageBlock.classList.remove('garage-block-hide');
  }

  hide():void {
    this.garageBlock.classList.add('garage-block-hide');
  }

  render():void {
    const garageButtonsInner = document.createElement('div');
    garageButtonsInner.classList.add('garage-buttons-inner');
    // block create car
    const garageCarCreate = document.createElement('div');
    garageCarCreate.classList.add('garage-buttons-item');
    const inputCreateName = document.createElement('input');
    inputCreateName.setAttribute('type', 'text');
    inputCreateName.classList.add('garage-buttons-input');
    const inputCreateColor = document.createElement('input');
    inputCreateColor.setAttribute('type', 'color');
    inputCreateColor.setAttribute('value', '#000000');
    inputCreateColor.classList.add('garage-buttons-input');
    const buttonCreate = document.createElement('button');
    buttonCreate.textContent = 'Create';
    garageCarCreate.append(inputCreateName, inputCreateColor, buttonCreate);
    // block update car
    const garageCarUpdate = document.createElement('div');
    garageCarUpdate.classList.add('garage-buttons-item');
    const inputUpdateName = document.createElement('input');
    inputUpdateName.setAttribute('type', 'text');
    inputUpdateName.setAttribute('disabled', 'true');
    inputUpdateName.classList.add('garage-buttons-input');
    const inputUpdateColor = document.createElement('input');
    inputUpdateColor.classList.add('garage-buttons-input');
    inputUpdateColor.setAttribute('type', 'color');
    inputUpdateColor.setAttribute('disabled', 'true');
    const buttonUpdate = document.createElement('button');
    buttonUpdate.textContent = 'Update';
    garageCarUpdate.append(inputUpdateName, inputUpdateColor, buttonUpdate);
    // block Race condition
    const garageRace = document.createElement('div');
    garageRace.classList.add('garage-buttons-item');
    const buttonRace = document.createElement('button');
    buttonRace.textContent = 'Race';
    const buttonResetRace = document.createElement('button');
    buttonResetRace.textContent = 'Reset Race';
    const buttonRandomCars = document.createElement('button');
    buttonRandomCars.textContent = 'Random Cars';
    garageRace.append(buttonRace, buttonResetRace, buttonRandomCars);
    //
    garageButtonsInner.append(garageCarCreate, garageCarUpdate, garageRace);
    const carsInner:HTMLElement = document.createElement('div');
    carsInner.classList.add('garage-cars-inner');
    this.garageBlock.append(garageButtonsInner);
    this.parent.append(this.garageBlock);
  }
}
