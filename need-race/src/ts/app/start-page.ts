import '../../scss/start-page/start-page.scss';
import generateCarSvg from '../common/generate-car-svg';

interface getCars{
  name: string;
  color: string;
  id: number,
  status? : string
}
interface getEngine{
  velocity: number;
  distance: number
}
interface updatingCar{
  name: string;
  color: string;
}
async function createCar(url:string, data:updatingCar): Promise<getCars> {
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  return response.json();
}
async function deleteCar(url: string):Promise<Response> {
  const response = await fetch(url, { method: 'DELETE' });
  return response;
}
async function getCarsModel(url: string):Promise<getCars[]> {
  const response = await fetch(url);
  return response.json();
}
async function updateCar(url: string, data:updatingCar, id?: string):Promise<getCars> {
  const urlLink = new URL(url);
  if (id) {
    urlLink.searchParams.append('id', `${id}`);
  }
  const response = await fetch(`${urlLink}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const returnedData = await response.json();
  return returnedData;
}
async function isEngineBroken(url: string, id: string, status:string):Promise<Response> {
  const urlLink = new URL(url);
  if (status && id) {
    urlLink.searchParams.append('id', id);
    urlLink.searchParams.append('status', status);
  }
  const response = await fetch(`${urlLink}`, { method: 'PATCH' });
  return response;
}
async function getEngineCars<T>(url: string, method: string, op1?: string, op1Val?: string, op2?: string, op2Val?: string):Promise<T> {
  const urlLink = new URL(url);
  if (op1 && op1Val) {
    urlLink.searchParams.append(`${op1}`, `${op1Val}`);
  }
  if (op2 && op2Val) {
    urlLink.searchParams.append(`${op2}`, `${op2Val}`);
  }
  const response = await fetch(`${urlLink}`, { method: `${method}` });
  return response.json();
}
export default class StartPage {
  private parent:HTMLElement;

  private startPageInner = document.createElement('div');

  private modalWindow = document.createElement('div');

  constructor(parent: HTMLElement) {
    this.parent = parent;
  }

  public destroy(): void {
    this.startPageInner.remove();
  }

  public render(): void {
    this.startPageInner.classList.add('start-page-inner');
    this.modalWindow.classList.add('modal-hidden', 'modal-window');
    this.startPageInner.append(this.modalWindow);
    this.modalWindow.setAttribute('race', 'undone');
    const title = document.createElement('h2');
    title.classList.add('start-page-title');
    title.textContent = 'Async Race';
    const mainButtons = document.createElement('div');
    mainButtons.classList.add('main-buttons');
    const buttonGarage = document.createElement('button');
    buttonGarage.classList.add('nav-button');
    buttonGarage.textContent = 'To Garage';
    const buttonWinners = document.createElement('button');
    buttonWinners.textContent = 'To Winners';
    buttonWinners.classList.add('nav-button');
    mainButtons.append(buttonGarage, buttonWinners);
    const carsInner = document.createElement('div');
    const garageControls = document.createElement('div');
    garageControls.classList.add('garage-controls');
    const controlItemCreate = document.createElement('div');
    controlItemCreate.classList.add('control-item');
    const inputNameCreate = document.createElement('input');
    inputNameCreate.oninput = (): void => {
      inputNameCreate.setAttribute('value', inputNameCreate.value);
    };
    inputNameCreate.classList.add('garage-input');
    inputNameCreate.setAttribute('type', 'text');
    const inputColorCreate = document.createElement('input');
    inputColorCreate.setAttribute('type', 'color');
    inputColorCreate.setAttribute('value', '#000000');
    inputColorCreate.onchange = (): void => {
      inputColorCreate.setAttribute('value', inputColorCreate.value);
    };
    const buttonCreate = document.createElement('button');
    buttonCreate.textContent = 'Create Car';
    buttonCreate.classList.add('car-button');
    const controlItemUpdate = document.createElement('div');
    controlItemUpdate.classList.add('control-item');
    const inputNameUpdate = document.createElement('input');
    inputNameUpdate.classList.add('garage-input');
    inputNameUpdate.setAttribute('type', 'text');
    inputNameUpdate.setAttribute('disabled', 'true');
    inputNameUpdate.oninput = (): void => {
      inputNameUpdate.setAttribute('value', inputNameUpdate.value);
    };
    const inputColorUpdate = document.createElement('input');
    inputColorUpdate.setAttribute('type', 'color');
    inputColorUpdate.setAttribute('disabled', 'true');
    inputColorUpdate.setAttribute('value', '#000000');
    inputColorUpdate.onchange = (): void => {
      inputColorUpdate.setAttribute('value', inputColorUpdate.value);
    };
    const buttonUpdate = document.createElement('button');
    buttonUpdate.setAttribute('disabled', 'true');
    buttonUpdate.textContent = 'Update';
    buttonUpdate.classList.add('car-button');
    buttonCreate.onclick = (): void => {
      if (inputColorCreate.value && inputNameCreate.value) {
        const responseCreate = createCar('http://127.0.0.1:3000/garage', { name: `${inputNameCreate.value}`, color: `${inputColorCreate.value}` });
        responseCreate.then((responseCreating) => {
          this.createCarBlock(carsInner, responseCreating.id, `${responseCreating.name}`, `${responseCreating.color}`, inputColorUpdate, inputNameUpdate, buttonUpdate);
        });
      }
    };
    controlItemUpdate.append(inputNameUpdate, inputColorUpdate, buttonUpdate);
    controlItemCreate.append(inputNameCreate, inputColorCreate, buttonCreate);
    const controlItemRace = document.createElement('div');
    controlItemRace.classList.add('control-item');
    const buttonRace = document.createElement('button');
    buttonRace.textContent = 'Race';
    buttonRace.classList.add('car-button');
    buttonRace.onclick = (): void => {
      buttonRace.setAttribute('disabled', 'true');
      const allCars = this.startPageInner.querySelectorAll('.car-block-inner');
      for (let i = 0; i < allCars.length; i += 1) {
        const startButton = allCars[i].querySelector('.car-button-start');
        if (startButton) {
          const eventClick = new Event('click', { bubbles: true });
          startButton.dispatchEvent(eventClick);
        }
      }
    };
    const buttonRaceReset = document.createElement('button');
    buttonRaceReset.classList.add('car-button');
    buttonRaceReset.onclick = (): void => {
      buttonRace.removeAttribute('disabled');
      this.modalWindow.setAttribute('race', 'undone');
      this.modalWindow.classList.add('modal-hidden');
      this.modalWindow.textContent = '';
      const allCars = this.startPageInner.querySelectorAll('.car-block-inner');
      for (let i = 0; i < allCars.length; i += 1) {
        const stopButton = allCars[i].querySelector('.car-button-stop');
        if (stopButton) {
          const eventClick = new Event('click', { bubbles: true });
          stopButton.dispatchEvent(eventClick);
        }
      }
    };
    buttonRaceReset.textContent = 'Reset Race';
    controlItemRace.append(buttonRace, buttonRaceReset);
    garageControls.append(controlItemCreate, controlItemUpdate, controlItemRace);
    const res = getCarsModel('http://127.0.0.1:3000/garage');
    carsInner.classList.add('cars-inner');
    res.then((data: getCars[]): void => {
      for (let i = 0; i < data.length; i += 1) {
        const carBlockWrapper = document.createElement('div');
        const carBlockInner = document.createElement('div');
        carBlockInner.classList.add('car-block-inner');
        carBlockInner.setAttribute('data-id', `${data[i].id}`);
        carBlockInner.setAttribute('data-color', `${data[i].color}`);
        const carButtonSelect = document.createElement('button');
        carButtonSelect.textContent = 'Select';
        carButtonSelect.classList.add('car-button');
        const carButtonRemove = document.createElement('button');
        carButtonRemove.classList.add('car-button');
        carButtonRemove.textContent = 'Remove';
        carButtonRemove.onclick = (): void => {
          const deletedCar = carBlockInner.querySelector('.car-block-img');
          if (deletedCar) {
            const responseDelete = deleteCar(`http://127.0.0.1:3000/garage/${deletedCar.getAttribute('id')}`);
            responseDelete.then((deleteResponse) => {
              if (deleteResponse.ok) {
                carBlockInner.remove();
              }
            });
          }
        };
        const carName = document.createElement('h3');
        carName.classList.add('car-name');
        carName.textContent = `${data[i].name}`;
        const carTopInner = document.createElement('div');
        carTopInner.classList.add('car-top-inner');
        const carButtonsControl = document.createElement('div');
        carButtonsControl.classList.add('car-buttons-control');
        const carButtonStart = document.createElement('button');
        carButtonStart.classList.add('car-button-control', 'car-button-start');
        carButtonStart.textContent = 'A';
        const carButtonBack = document.createElement('button');
        carButtonBack.classList.add('car-button-control', 'car-button-stop');
        carButtonBack.textContent = 'B';
        carButtonBack.setAttribute('disabled', 'true');
        carButtonsControl.append(carButtonStart, carButtonBack);
        const carBlock = document.createElement('div');
        carBlock.classList.add('car-block-img');
        carBlock.setAttribute('id', `${data[i].id}`);
        carBlock.setAttribute('status', '');
        carButtonSelect.onclick = (): void => {
          inputColorUpdate.removeAttribute('disabled');
          buttonUpdate.removeAttribute('disabled');
          inputNameUpdate.removeAttribute('disabled');
          if (carName.textContent) {
            inputNameUpdate.value = carName.textContent;
          }
          if (carBlockInner.getAttribute('data-color')) {
            inputColorUpdate.setAttribute('value', `${carBlockInner.getAttribute('data-color')}`);
          }
          inputNameUpdate.setAttribute('data-id', `${carBlock.getAttribute('id')}`);
        };
        carBlock.innerHTML = generateCarSvg(`${data[i].color}`);
        carBlock.setAttribute('car-name', `${data[i].name}`);
        let animationSwitcher = 0;
        let phase = 0;
        carButtonStart.onclick = ():void => {
          carButtonStart.setAttribute('disabled', 'true');
          const engineControl = getEngineCars<getEngine>('http://127.0.0.1:3000/engine/', 'PATCH', 'id', `${data[i].id}`, 'status', 'started');
          carBlock.setAttribute('status', 'started');
          engineControl.then((d) => {
            const svgImg = carBlock.querySelector('svg');
            carButtonBack.removeAttribute('disabled');
            const finalLine = document.body.getBoundingClientRect().width - (svgImg!.getBoundingClientRect().width + 50);
            const moveCar = () => {
              phase += d.velocity * 0.5;
              carBlock.style.transform = `translate(${Math.min((phase) / 10, finalLine)}px)`;
              animationSwitcher = window.requestAnimationFrame(moveCar);
              if (finalLine < phase / 10) {
                window.cancelAnimationFrame(animationSwitcher);
                carBlock.setAttribute('status', 'stopped');
                carBlock.setAttribute('engine', 'good');
                carBlock.setAttribute('time', `${finalLine / (d.velocity * 0.5)}`);
                if (this.modalWindow.getAttribute('race') === 'undone') {
                  this.modalWindow.setAttribute('race', 'done');
                  this.modalWindow.classList.remove('modal-hidden');
                  this.modalWindow.textContent = `${Math.trunc(Number(carBlock.getAttribute('time')) / 10)}s - the winner ${carBlock.getAttribute('car-name')}`;
                }
              }
            };
            carBlock.setAttribute('status', 'drive');
            const carsEngine = carBlockInner.querySelector('.car-block-img');
            if (carsEngine) {
              const responseEngine = isEngineBroken('http://127.0.0.1:3000/engine/', `${carsEngine.getAttribute('id')}`, 'drive');
              responseEngine.then((engineResponse: Response) => {
                if (engineResponse.status === 500) {
                  window.cancelAnimationFrame(animationSwitcher);
                  carBlock.setAttribute('status', 'stopped');
                  carBlock.setAttribute('engine', 'broken');
                  throw new Error('Engine is broken, the car is stopped');
                }
              }).catch((error: Error) => {
                console.log(error);
              });
            }
            window.requestAnimationFrame(moveCar);
          });
        };
        carButtonBack.onclick = ():void => {
          carButtonBack.setAttribute('disabled', 'true');
          carButtonStart.removeAttribute('disabled');
          phase = 0;
          carBlock.setAttribute('status', '');
          window.cancelAnimationFrame(animationSwitcher);
          carBlock.style.transform = 'translate(0px)';
        };
        buttonUpdate.onclick = (): void => {
          inputColorUpdate.setAttribute('disabled', 'true');
          inputNameUpdate.setAttribute('disabled', 'true');
          buttonUpdate.setAttribute('disabled', 'true');
          const carUpdated = updateCar(`http://127.0.0.1:3000/garage/${inputNameUpdate.getAttribute('data-id')}`, {
            name: `${inputNameUpdate.value}`,
            color: `${inputColorUpdate.value}`,
          });
          carUpdated.then((updates: getCars) => {
            const car = carsInner.querySelector(`div[data-id='${inputNameUpdate.getAttribute('data-id')}']`);
            if (car) {
              const carImage = car.querySelector('.car-block-img');
              const carMark = car.querySelector('.car-name');
              if (carImage) {
                carImage.innerHTML = generateCarSvg(`${updates.color}`);
              }
              if (carMark) {
                carMark.textContent = `${updates.name}`;
              }
            }
          });
        };
        carTopInner.append(carButtonSelect, carButtonRemove, carName);
        carBlockWrapper.append(carTopInner, carButtonsControl, carBlock);
        carBlockInner.append(carBlockWrapper);
        carsInner.append(carBlockInner);
      }
    }).catch((err:Error) => { console.error(err); });
    this.startPageInner.append(title, mainButtons, garageControls, carsInner);
    this.parent.append(this.startPageInner);
  }

  createCarBlock(parent: HTMLElement, id: number, name: string, color: string, inputColorUpdate:HTMLElement, inputNameUpdate:HTMLElement, buttonUpdate:HTMLElement): void {
    const carBlockWrapper = document.createElement('div');
    const carBlockInner = document.createElement('div');
    carBlockInner.classList.add('car-block-inner');
    carBlockInner.setAttribute('data-id', `${id}`);
    carBlockInner.setAttribute('data-color', `${color}`);
    const carButtonSelect = document.createElement('button');
    carButtonSelect.textContent = 'Select';
    carButtonSelect.classList.add('car-button');
    const carButtonRemove = document.createElement('button');
    carButtonRemove.classList.add('car-button');
    carButtonRemove.textContent = 'Remove';
    carButtonRemove.onclick = (): void => {
      const deletedCar = carBlockInner.querySelector('.car-block-img');
      if (deletedCar) {
        const responseDelete = deleteCar(`http://127.0.0.1:3000/garage/${deletedCar.getAttribute('id')}`);
        responseDelete.then((deleteResponse) => {
          if (deleteResponse.ok) {
            carBlockInner.remove();
          }
        });
      }
    };
    const carName = document.createElement('h3');
    carName.classList.add('car-name');
    carName.textContent = `${name}`;
    const carTopInner = document.createElement('div');
    carTopInner.classList.add('car-top-inner');
    const carButtonsControl = document.createElement('div');
    carButtonsControl.classList.add('car-buttons-control');
    const carButtonStart = document.createElement('button');
    carButtonStart.classList.add('car-button-control', 'car-button-start');
    carButtonStart.textContent = 'A';
    const carButtonBack = document.createElement('button');
    carButtonBack.classList.add('car-button-control', 'car-button-stop');
    carButtonBack.textContent = 'B';
    carButtonBack.setAttribute('disabled', 'true');
    carButtonsControl.append(carButtonStart, carButtonBack);
    const carBlock = document.createElement('div');
    carBlock.classList.add('car-block-img');
    carBlock.setAttribute('id', `${id}`);
    carBlock.setAttribute('status', '');
    carBlock.setAttribute('car-name', `${name}`);
    carButtonSelect.onclick = ():void => {
      inputColorUpdate.removeAttribute('disabled');
      buttonUpdate.removeAttribute('disabled');
      inputNameUpdate.removeAttribute('disabled');
      if (carName.textContent) {
        inputNameUpdate.setAttribute('value', `${carName.textContent}`);
      }
      if (carBlockInner.getAttribute('data-color')) {
        inputColorUpdate.setAttribute('value', `${carBlockInner.getAttribute('data-color')}`);
      }
      inputNameUpdate.setAttribute('data-id', `${carBlock.getAttribute('id')}`);
    };
    carBlock.innerHTML = generateCarSvg(`${color}`);
    let animationSwitcher = 0;
    let phase = 0;
    carButtonStart.onclick = ():void => {
      carButtonStart.setAttribute('disabled', 'true');
      const engineControl = getEngineCars<getEngine>('http://127.0.0.1:3000/engine/', 'PATCH', 'id', `${id}`, 'status', 'started');
      carBlock.setAttribute('status', 'started');
      engineControl.then((d) => {
        const svgImg = carBlock.querySelector('svg');
        carButtonBack.removeAttribute('disabled');
        const finalLine = document.body.getBoundingClientRect().width - (svgImg!.getBoundingClientRect().width + 50);
        const moveCar = () => {
          phase += d.velocity * 0.45;
          carBlock.style.transform = `translate(${Math.min((phase) / 10, finalLine)}px)`;
          animationSwitcher = window.requestAnimationFrame(moveCar);
          if (finalLine < phase / 10) {
            window.cancelAnimationFrame(animationSwitcher);
            carBlock.setAttribute('status', 'stopped');
            carBlock.setAttribute('engine', 'good');
            carBlock.setAttribute('time', `${finalLine / (d.velocity * 0.5)}`);
            if (this.modalWindow.getAttribute('race') === 'undone') {
              this.modalWindow.setAttribute('race', 'done');
              this.modalWindow.classList.remove('modal-hidden');
              this.modalWindow.textContent = `${Math.trunc(Number(carBlock.getAttribute('time')) / 10)}s - the winner ${carBlock.getAttribute('car-name')}`;
            }
          }
        };
        carBlock.setAttribute('status', 'drive');
        const carsEngine = carBlockInner.querySelector('.car-block-img');
        if (carsEngine) {
          const responseEngine = isEngineBroken('http://127.0.0.1:3000/engine/', `${carsEngine.getAttribute('id')}`, 'drive');
          responseEngine.then((engineResponse: Response) => {
            if (engineResponse.status === 500) {
              window.cancelAnimationFrame(animationSwitcher);
              carBlock.setAttribute('status', 'stopped');
              carBlock.setAttribute('engine', 'broken');
            }
          });
        }
        window.requestAnimationFrame(moveCar);
      });
    };
    carButtonBack.onclick = ():void => {
      carButtonBack.setAttribute('disabled', 'true');
      carButtonStart.removeAttribute('disabled');
      phase = 0;
      carBlock.setAttribute('status', '');
      window.cancelAnimationFrame(animationSwitcher);
      carBlock.style.transform = 'translate(0px)';
    };
    carTopInner.append(carButtonSelect, carButtonRemove, carName);
    carBlockWrapper.append(carTopInner, carButtonsControl, carBlock);
    carBlockInner.append(carBlockWrapper);
    parent.append(carBlockInner);
  }
}
