Nakama Cocos2d-x javascript
=============

> Cocos2d-x 3.17 javascript client for Nakama server 2.x.

Nakama is an open-source distributed server for social and realtime games. For more information have a look at the [server documentation](https://heroiclabs.com/docs/).

If you encounter any issues with the server you can generate diagnostics for us with `nakama doctor`. Send these to support@heroiclabs.com or [open an issue](https://github.com/heroiclabs/nakama/issues). If you experience any issues with the client, it can be useful to enable trace (`this.client.createSocket(useSSL, true/*verboseLogging*/);`) to produce logs and [open an issue](https://github.com/heroiclabs/nakama-cocos2d-x-javascript/issues).

### Getting Started

#### Prerequisites

To get started using Nakama in Cocos2d-x js, you will need the following:

1. [Cocos2d-x Engine](http://www.cocos2d-x.org/download) 3.17 or greater.
2. A compiler for the platform you are developing on, such as [Visual Studio](https://www.visualstudio.com/vs/community/) on Windows or [XCode](https://developer.apple.com/xcode/download/) on OSX.
3. [nakama-cocos2d-x js](https://github.com/heroiclabs/nakama-cocos2d-x-javascript/releases)

#### Supported platforms

All which cocos2d-x supports.

Tested on follwoing: Windows, Linux, Android, iOS, Mac, Web (HTML5)

#### Setup

To use nakama-cocos2d-x js in your cocos2d-x js project, you'll need to copy the nakama-cocos2d-x files you downloaded into the appropriate place. To do this:

1. Open your cocos2d-x js project folder in Explorer or Finder.
2. Copy `cocos2d-x` engine folder to `frameworks\cocos2d-x` folder
3. Copy `cocos2d-x-3.17\web` to `frameworks\cocos2d-html5` folder
4. Copy the `NakamaSDK` and `ThirdParty` folders from the nakama-cocos2d-x js release you downloaded, into src folder.

Folder structure should be as following:
```
<Your Project Root>
   frameworks
       cocos2d-html5
       cocos2d-x

   src
       NakamaSDK
       ThirdParty
```

4. Now add files to project.json:
    * src/ThirdParty/bluebird.min.js
    * src/NakamaSDK/nakama-js.umd.js

At this point, you are done. Try to build.

#### Build

##### Android
```
cocos run -p android
```

##### iOS
```
cocos run -p ios
```

##### Windows
```
cocos run -p win32
```

##### Linux
```
cocos run -p linux
```

#### Links

[nakama-js git repo](https://github.com/heroiclabs/nakama-js)

[javascript client guide](https://heroiclabs.com/docs/javascript-client-guide)
