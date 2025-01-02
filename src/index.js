import app from './app.js'
import config from './config.js'

app.listen(config.PORT, () => {
  console.log(`Serwer działa na porcie ${config.PORT}`);
});

