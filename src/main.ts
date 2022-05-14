import * as EGG from './constants/egg';
import { isMainApp, isOffline } from './helpers/app';
import { appendScript } from './helpers/dom';

if (!isOffline()) {
  (async () => {
    appendScript(EGG.SCRIPT_URL);
    if (isMainApp()) {
      require('./stylesheets/lihkg.scss');
      require('./stylesheets/main.scss');
      const { default: app } = await import('./app');
      app.bootstrap();
      const { default: cloud } = await import('./cloud');
      cloud.bootstrap();
      const ga = await import('./ga');
      ga.bootstrap();
    }
  })();
}
