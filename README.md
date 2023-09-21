# Audio Shifter

Realtime audio speed changer and pitch shifter web app made with React and powered by [wavesurfer.js](https://wavesurfer-js.org/) and [Tone.js](https://tonejs.github.io/)

The app is available on [https://battistar.github.io/audio-shifter](https://battistar.github.io/audio-shifter).

## Development

### npm

First setup [nvm](https://github.com/nvm-sh/nvm), then move in the main folder, where the `.nvmrc` file are in, and run:

```shell
nvm use
```

Now you can run the application in dev mode:

```shell
npm run dev
```

Open [http://localhost:5173/audio-shifter](http://localhost:5173/audio-shifter) to show it in the browser.

## Deployment

Every push on the master branch, trigger a GitHub action that check the code validity and push a new version on GitHub pages.
