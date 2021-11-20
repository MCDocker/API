# An API for MCDocker
This API handles MCDocker accounts, uploaded containers and Microsoft Authentication. Without this MCDocker would lose most of its features.

## Setting up
An important file is required when setting up. The file required needs to be called `.env` and have the following properties inside:
```
Insert template
```
After that you can follow these steps
1. Make sure you have [yarn](https://www.npmjs.com/package/yarn) installed
2. Install all packages using the command `yarn` inside the workspace
3. Run either `yarn dev` for a hot-reload or `yarn start`. In production purposes it should be ran using the compiled output provided by `tsc`.

