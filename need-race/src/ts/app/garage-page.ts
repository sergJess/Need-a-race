import '../../scss/garage/garage-page.scss';
import generateCarSvg from '../common/generate-car-svg';
import {
  createCar, Engine, getAllCars, CarsParametrs,
} from '../api/api';
import {
  URL_LINK, COEF_SPEED, FINISH_LINE_PADDING, PAGE_LIMIT,
} from '../common/constants';

export default class GaragePage {
  private parent: HTMLElement;

  private garageBlock = document.createElement('div');

  private pageNumber = document.createElement('span');

  private totalCars = document.createElement('span');

  private carsInner:HTMLElement = document.createElement('div');

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
    this.garageBlock.classList.add('garage-block');
    const garageButtonsInner = document.createElement('div');
    garageButtonsInner.classList.add('garage-buttons-inner');
    // block create car
    const garageCarCreate = document.createElement('div');
    garageCarCreate.classList.add('garage-buttons-item');
    const inputCreateName = document.createElement('input');
    inputCreateName.setAttribute('type', 'text');
    inputCreateName.classList.add('garage-buttons-input');
    inputCreateName.oninput = (): void => {
      inputCreateName.setAttribute('value', inputCreateName.value);
    };
    const inputCreateColor = document.createElement('input');
    inputCreateColor.setAttribute('type', 'color');
    inputCreateColor.setAttribute('value', '#000000');
    inputCreateColor.classList.add('garage-buttons-input');
    inputCreateColor.onchange = (): void => {
      inputCreateColor.setAttribute('value', inputCreateColor.value);
    };
    const buttonCreate = document.createElement('button');
    buttonCreate.textContent = 'Create';
    buttonCreate.onclick = (): void => {
      if (inputCreateName.getAttribute('value')) {
        const responseCreate = createCar(`${URL_LINK}/garage`, { name: `${inputCreateName.value}`, color: `${inputCreateColor.value}` });
        responseCreate.then((createResponse) => {
          this.createCarBlock(this.carsInner, `${createResponse.name}`, `${createResponse.color}`, `${createResponse.id}`);
        });
      }
    };
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
    buttonRace.onclick = (): void => {
      const dataCars = getAllCars(`${URL_LINK}/garage`);
      dataCars.then((data) => {
        console.log(data);
        data.json().then((res) => {
          console.log(res);
        });
      });
    };
    const buttonResetRace = document.createElement('button');
    buttonResetRace.textContent = 'Reset Race';
    const buttonRandomCars = document.createElement('button');
    buttonRandomCars.textContent = 'Random Cars';
    garageRace.append(buttonRace, buttonResetRace, buttonRandomCars);
    //
    garageButtonsInner.append(garageCarCreate, garageCarUpdate, garageRace);
    // car page number and total cars
    const pageNumberTitle = document.createElement('h2');
    pageNumberTitle.classList.add('garage-page-title');
    pageNumberTitle.textContent = 'Page:';
    pageNumberTitle.append(this.pageNumber);
    const pageTotalCars = document.createElement('h2');
    pageTotalCars.classList.add('garage-page-title');
    pageTotalCars.textContent = 'Total cars:';
    pageTotalCars.append(this.totalCars);
    // load default cars
    this.renderDefaultCars(this.carsInner);
    this.carsInner.classList.add('garage-cars-inner');
    this.garageBlock.append(garageButtonsInner, pageNumberTitle, pageTotalCars, this.carsInner);
    this.parent.append(this.garageBlock);
  }

  createCarBlock(parent:HTMLElement, name:string, color:string, id:string): void {
    const carBlock = document.createElement('div');
    carBlock.classList.add('garage-car-block');
    carBlock.setAttribute('data-id', `${id}`);
    carBlock.setAttribute('data-status', 'started');
    // car images
    const carImage = document.createElement('div');
    carImage.classList.add('car-image');
    carImage.innerHTML = generateCarSvg(color);
    // car buttons inner
    const carButtonsInner = document.createElement('div');
    carButtonsInner.classList.add('garage-car-buttons-inner');
    const buttonCarSelect = document.createElement('button');
    buttonCarSelect.classList.add('car-button');
    buttonCarSelect.textContent = 'Select';
    buttonCarSelect.onclick = (): void => {};
    const carButtonRemove = document.createElement('button');
    carButtonRemove.classList.add('car-button');
    carButtonRemove.textContent = 'Remove';
    carButtonRemove.onclick = (): void => {};
    const carName = document.createElement('h3');
    carName.classList.add('car-title');
    carName.textContent = name;
    carButtonsInner.append(buttonCarSelect, carButtonRemove, carName);
    // car buttons engine
    const carButtonsEngine = document.createElement('div');
    carButtonsEngine.classList.add('garage-car-buttons-inner');
    const buttonStartEngine = document.createElement('button');
    buttonStartEngine.textContent = 'A';
    let animationSwitcher = 0;
    let phase = 0;
    buttonStartEngine.onclick = (): void => {
      buttonStartEngine.setAttribute('disabled', 'true');
      const startEngineResponse = Engine(`${URL_LINK}/engine`, `${carBlock.getAttribute('data-id')}`, `${carBlock.getAttribute('data-status')}`);
      startEngineResponse.then((responseStart:Response):void => {
        if (responseStart.status === 200) {
          const responseEngine = responseStart.json();
          responseEngine.then((engineResponse):void => {
            const svgCar = carBlock.querySelector('svg');
            const fullDistance = document.body.getBoundingClientRect().width - (svgCar!.getBoundingClientRect().width + FINISH_LINE_PADDING);
            const moveCar = () => {
              phase += engineResponse.velocity * COEF_SPEED;
              carImage.style.transform = `translate(${Math.min((phase) / 10, fullDistance)}px)`;
              animationSwitcher = window.requestAnimationFrame(moveCar);
              if (fullDistance < phase / 10) {
                window.cancelAnimationFrame(animationSwitcher);
                carBlock.setAttribute('data-status', 'stopped');
                carBlock.setAttribute('data-engine', 'good');
                carBlock.setAttribute('data-time', `${fullDistance / (engineResponse.velocity * COEF_SPEED)}`);
                // if (this.modalWindow.getAttribute('race') === 'undone') {
                //   this.modalWindow.setAttribute('race', 'done');
                //   this.modalWindow.classList.remove('modal-hidden');
                //   this.modalWindow.textContent = `${Math.trunc(Number(carBlock.getAttribute('time')) / 10)}s - the winner ${carBlock.getAttribute('car-name')}`;
                // }
              }
            };
            carBlock.setAttribute('data-status', 'drive');
            const isEngineBroken = Engine(`${URL_LINK}/engine`, `${carBlock.getAttribute('data-id')}`, `${carBlock.getAttribute('data-status')}`);
            window.requestAnimationFrame(moveCar);
            isEngineBroken.then((responseIsEngineBroken):void => {
              if (responseIsEngineBroken.status === 500) {
                window.cancelAnimationFrame(animationSwitcher);
                carBlock.setAttribute('data-status', 'stopped');
                carBlock.setAttribute('data-engine', 'broken');
              }
            }).catch((error: Error) => { console.log(error); });
          });
        }
      });
    };
    const buttonStopEngine = document.createElement('button');
    buttonStopEngine.textContent = 'B';
    buttonStopEngine.onclick = (): void => {
      buttonStartEngine.removeAttribute('disabled');
      carBlock.setAttribute('data-status', 'stopped');
      phase = 0;
      window.cancelAnimationFrame(animationSwitcher);
      const stoppedEngine = Engine(`${URL_LINK}/engine`, `${carBlock.getAttribute('data-id')}`, `${carBlock.getAttribute('data-status')}`);
      stoppedEngine.then((responseStopped):void => {
        responseStopped.json().then(():void => {
          carBlock.setAttribute('data-status', 'started');
          carImage.style.transform = `translate(${(phase)}px)`;
        });
      });
    };
    carButtonsEngine.append(buttonStartEngine, buttonStopEngine);
    //
    carBlock.append(carButtonsInner, carButtonsEngine, carImage);
    parent.append(carBlock);
  }

  renderDefaultCars(parent: HTMLElement): void {
    const response = getAllCars(`${URL_LINK}/garage`, '1', `${PAGE_LIMIT}`);
    response.then((responseDefault: Response):void => {
      responseDefault.json().then((responseData:CarsParametrs[]):void => {
        for (let i = 0; i < responseData.length; i += 1) {
          this.createCarBlock(parent, `${responseData[i].name}`, `${responseData[i].color}`, `${responseData[i].id}`);
        }
      });
    });
  }
}
