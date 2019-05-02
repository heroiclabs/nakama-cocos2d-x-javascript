## Release Instructions

### New releases

Release for Cocos2d-x JS should be made after the nakama-js release (https://github.com/heroiclabs/nakama-js/releases).

Download `nakama-js.umd.js` from https://github.com/heroiclabs/nakama-js/releases

Copy `nakama-js.umd.js` to `NakamaSDK`.

Copy `README.md` and `CHANGELOG.md` to `NakamaSDK`.

Release folder structure:
```
NakamaSDK/
├── ThirdParty/
│   └── polyfill.min.js
├── nakama-js.umd.js
├── LICENSE
├── CHANGELOG.md
└── README.md
```

### Full release workflow

The development team use these steps to build and upload a release.

1. Make archive from `NakamaSDK` folder and name it `nakama-cocos2d-js-x.x.x.zip`

2. Login and create a [new draft release](https://github.com/heroiclabs/nakama-cocos2d-x-javascript/releases/new) on GitHub.

3. Repeat the changelog in the release description.

4. Attach `nakama-cocos2d-js-x.x.x.zip`

5. Publish the release.
