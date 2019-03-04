Nakama Cocos2d-x JavaScript Example
=============

> Cocos2d-x 3.17 javascript client example

Nakama is an open-source distributed server for social and realtime games. For more information have a look at the [server documentation](https://heroiclabs.com/docs/).

If you encounter any issues with the server you can generate diagnostics for us with `nakama doctor`. Send these to support@heroiclabs.com or [open an issue](https://github.com/heroiclabs/nakama/issues). If you experience any issues with the client, it can be useful to enable trace (`this.client.createSocket(useSSL, true/*verboseLogging*/);`) to produce logs and [open an issue](https://github.com/heroiclabs/nakama-cocos2d-x-javascript/issues).

### Getting Started

#### Prerequisites

To get started using Nakama in Cocos2d-x js, you will need the following:

1. [Cocos2d-x Engine](http://www.cocos2d-x.org/download) 3.17 or greater.
2. A compiler for the platform you are developing on, such as [Visual Studio](https://www.visualstudio.com/vs/community/) on Windows or [XCode](https://developer.apple.com/xcode/download/) on OSX.

#### Supported platforms

All which cocos2d-x supports.

Tested on following: Windows, Linux, Android, iOS, Mac, Web (HTML5)

#### Setup

To build example:

1. Copy `cocos2d-x-3.17` engine folder to `frameworks\cocos2d-x` folder
2. Copy `cocos2d-x-3.17/web` to `frameworks/cocos2d-html5` folder

Folder structure should be as following:
```
example/
   frameworks/
       cocos2d-html5/
       cocos2d-x/

   src/
       NakamaSDK/
           ThirdParty/
```

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

[Cocos2d JS client guide](https://heroiclabs.com/docs/cocos2d-js-client-guide)

[Nakama JS git repo](https://github.com/heroiclabs/nakama-js)
