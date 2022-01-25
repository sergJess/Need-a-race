import '../scss/base/base.scss';
import Start from './app/start';
// import StartPage from './app/start-page';

const root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.append(root);
// const startingPage = new StartPage(root);
// startingPage.render();
const startP = new Start(root);
startP.render();
