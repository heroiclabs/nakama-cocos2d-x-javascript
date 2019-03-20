Nakama Cocos2d-x JavaScript client
========================

> Cocos2d-x JavaScript client for Nakama server.

[Nakama](https://github.com/heroiclabs/nakama) is an open-source server designed to power modern games and apps. Features include user accounts, chat, social, matchmaker, realtime multiplayer, and much [more](https://heroiclabs.com).

This client implements the full API and socket options with the server. It's written in TypeScript with minimal dependencies to be compatible with all modern browsers and Cocos2d-x.

Full documentation is online - https://heroiclabs.com/docs/cocos2d-js-client-guide

## Supported Cocos2d-x and platforms

Any Cocos2d-x version should work. Tested on Cocos2d-x 3.17 and 3.17.1.

Supported all platforms which Cocos2d-x supports.

## Getting Started

You'll need to setup the server and database before you can connect with the client. The simplest way is to use Docker but have a look at the [server documentation](https://github.com/heroiclabs/nakama#getting-started) for other options.

1. Install and run the servers. Follow these [instructions](https://heroiclabs.com/docs/install-docker-quickstart).

2. Download latest release from the GitHub <a href="https://github.com/heroiclabs/nakama-cocos2d-x-javascript/releases/latest" target="\_blank">releases page</a>. which contains the Nakama-js module with UMD module loader and polyfill library.

3. Extract downloaded archive to your `src` folder.

4. Import into your `project.json`:

```json
"jsList" : [
  ...
  "src/NakamaSDK/ThirdParty/polyfill.min.js",
  "src/NakamaSDK/nakama-js.umd.js"
]
```

5. Use the connection credentials to build a client object.

    ```js
    var serverkey = "defaultkey";
    var host = "127.0.0.1";
    var port = 7350;
    var useSSL = false; // enable if server is run with an SSL certificate
    var timeout = 7000; // ms

    var client = new nakamajs.Client(serverkey, host, port, useSSL, timeout);
    ```

## Usage

The client object has many methods to execute various features in the server or open realtime socket connections with the server.

### Authenticate

There's a variety of ways to [authenticate](https://heroiclabs.com/docs/authentication) with the server. Authentication can create a user if they don't already exist with those credentials. It's also easy to authenticate with a social profile from Google Play Games, Facebook, Game Center, etc.

```js
const email = "hello@example.com";
const password = "somesupersecretpassword";

client.authenticateEmail({
  email: email,
  password: password
}).then(function(session) {
        cc.log("Authenticated successfully. User id:", session.user_id);
        // Store session token for quick reconnects.
        cc.sys.localStorage.setItem("nakamaToken", session.token);
    },
    function(error) {
        cc.error("authenticate failed:", JSON.stringify(error));
    });
```

### Sessions

When authenticated the server responds with an auth token (JWT) which contains useful properties and gets deserialized into a `Session` object.

```js
cc.log(session.token); // raw JWT token
cc.log(session.userId);
cc.log(session.username);
cc.log("Session has expired?", session.isexpired(Date.now() / 1000));
const expiresat = session.expires_at;
cc.log("Session will expire at", new Date(expiresat * 1000).toISOString());
```

It is recommended to store the auth token from the session and check at startup if it has expired. If the token has expired you must reauthenticate. The expiry time of the token can be changed as a setting in the server.

```js
// Assume we've stored the auth token in localStorage.
const authtoken = cc.sys.localStorage.getItem("nkauthtoken");
const session = nakamajs.Session.restore(authtoken);
if (session.isexpired(Date.now() / 1000)) {
    cc.log("Session has expired. Must reauthenticate.");
}
```

### Requests

The client includes lots of builtin APIs for various features of the game server. These can be accessed with the methods which return Promise objects. It can also call custom logic as RPC functions on the server. These can also be executed with a socket object.

All requests are sent with a session object which authorizes the client.

```js
client.getAccount(session)
  .then(function(account) {
        cc.log(account.user.id);
        cc.log(account.user.username);
        cc.log(account.wallet);
    },
    function(error) {
        cc.error("get account failed:", JSON.stringify(error));
    });
```

### Socket

The client can create one or more sockets with the server. Each socket can have it's own event listeners registered for responses received from the server.

```js
const secure = false; // enable if server is run with an SSL certificate
const trace = false;
const socket = client.createSocket(secure, trace);

socket.ondisconnect = function (event) {
  cc.log("Disconnected from the server. Event:", JSON.stringify(event));
};

socket.connect(session)
  .then(
     function() {
         cc.log("connected");
     },
     function(error) {
         cc.log("connect failed:", JSON.stringify(error));
     }
  );
```

There's many messages for chat, realtime, status events, notifications, etc. which can be sent or received from the socket.

```js
socket.onchannelmessage = function (channelMessage) {
  cc.log("Received chat message:", JSON.stringify(channelMessage));
};

const roomname = "mychannel";
socket.send({ channel_join: {
    type: 1, // 1 = room, 2 = Direct Message, 3 = Group
    target: roomname,
    persistence: false,
    hidden: false
} })
  .then(
      function(response) {
          cc.log("Successfully joined channel:", response.channel.id);
          
          // now send message
          const message = { "hello": "world" };
          socket.send({ channel_message_send: {
              channel_id: response.channel.id,
              content: message
          } });
      },
      function(error) {
          cc.error("join channel failed:", JSON.stringify(error));
      }
  );
```

## Contribute

The development roadmap is managed as GitHub issues and pull requests are welcome. If you're interested to enhance the code please open an issue to discuss the changes or drop in and discuss it in the [community chat](https://gitter.im/heroiclabs/nakama).

### Source Builds

Please follow [Nakama JS Client](https://github.com/heroiclabs/nakama-js)

### License

This project is licensed under the [Apache-2 License](https://github.com/heroiclabs/nakama-js/blob/master/LICENSE).

## Special Thanks

Thanks to [@dimon4eg](https://github.com/dimon4eg) for this excellent support on developing Nakama C++, Cocos2d-x and Unreal client libraries.

Thanks to [@Taylor Hakes](https://github.com/taylorhakes) for his excellent work on [promise-polyfill](https://github.com/taylorhakes/promise-polyfill) project.
