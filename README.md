![main-image](https://wsrv.nl/?url=repository-images.githubusercontent.com/282042743/9c891880-fdc0-11ea-8ccc-f3cd9c00e5ae&w=600)

# Dfinity and Reactjs starter template

Dfinity v0.17.0 and Reactjs v18.2.0

## Intro
The DFINITY Foundation is a major contributor to the Internet Computer blockchain.

## How to make it work?
1. Install Nodejs v16.0.0 or higher.
2. Follow [this link](https://internetcomputer.org/docs/current/tutorials/deploy_sample_app#step-1-install-the-internet-computer-ic-sdk) and install Internet computer SDK if you dont already have it.
1. Clone this repo to your machine
2. Rename project name as per your need. For example lets<br> assume you renamed your project to my_app then<br> change these folder names too
```css
src
├── template_backend   --> my_app_backend
└── template_frontend  --> my_app_frontend
```
5. Replace all instance of template_backend with my_app_backend within 'src/my_app_frontend/src/index.jsx' file. 
6. Change template_frontend with my_app_frontend on line 10 within 'webpack.config.js' file. 

## Running the project locally

Test your project locally by using the following commands:

```bash
# Starts the replica, running in the background
dfx start

# Deploys your canisters to the replica and generates your candid interface
dfx deploy # run from different terminal

# Start react frontend with this command
npm start
```

It will start a server at `http://localhost:8080`, proxying API requests to the replica at port 4943.

Enjoy :)

### Note on frontend environment variables

If you are hosting frontend code somewhere without using DFX, you may need to make one of the following adjustments to ensure your project does not fetch the root key in production:

- set`DFX_NETWORK` to `ic` if you are using Webpack
- use your own preferred method to replace `process.env.DFX_NETWORK` in the autogenerated declarations
  - Setting `canisters -> {asset_canister_id} -> declarations -> env_override to a string` in `dfx.json` will replace `process.env.DFX_NETWORK` with the string in the autogenerated declarations
- Write your own `createActor` constructor


## Useful links
- [IC Reference](https://internetcomputer.org/docs/current/references/)
- [IC Guide](https://internetcomputer.org/docs/current/developer-docs/)
- [IC Tutorial](https://internetcomputer.org/docs/current/tutorials/)

## Badges

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/) 
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

## Author
- [@sonukuldeep](https://www.github.com/sonukuldeep)

## 🛠 Skills

[![My Skills](https://skillicons.dev/icons?i=js,ts,html,css,tailwind,sass,nodejs,react,vue,flask,rust,python,php,solidity,mongodb,mysql,prisma,figma,threejs,unity,godot)](https://github.com/sonukuldeep)
