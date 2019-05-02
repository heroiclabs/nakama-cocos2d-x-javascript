/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var HelloWorldLayer = cc.Layer.extend({
    sprite: null,
    nakamaLogo: null,
    label: null,
    session: null,
    client: null,
    socket: null,
    chat_room_id: null,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.label = new cc.LabelTTF("Hello World", "Arial", 38);
        // position the label on the center of the screen
        this.label.x = size.width / 2;
        this.label.y = size.height / 2 + 200;
        // add the label as a child to this layer
        this.addChild(this.label, 5);

        // add "HelloWorld" splash screen
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width * 0.7,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);
        
        // add "Nakama" logo
        this.nakamaLogo = new cc.Sprite(res.NakamaLogo_png);
        this.nakamaLogo.attr({
            x: size.width * 0.3,
            y: size.height / 2
        });
        this.addChild(this.nakamaLogo, 0);

        var serverkey = "defaultkey";
        var host = "127.0.0.1";
        var port = 7350;
        var useSSL = false;
        var timeout = 7000; // ms

        this.client = new nakamajs.Client(serverkey, host, port, useSSL, timeout);

        if (this.restoreSession()) {
            this.onValidSession();
        }
        else
            this.loginWithDevice();

        return true;
    },

    loginWithDevice : function() {
        var deviceId = this.getDeviceId();
        cc.log("authenticateDevice deviceId: " + deviceId);
        var self = this;

        this.client.authenticateDevice({ id: deviceId, create: true/*, username: username*/ })
            .then(function(session) {
                    //cc.log("authenticate succeeded! session = " + JSON.stringify(session));
                    cc.log("authenticate succeeded!");
                    cc.sys.localStorage.setItem("nakamaToken", session.token);
                    self.session = session;
                    self.onValidSession();
                },
                function(error) {
                    cc.log("authenticate failed: " + JSON.stringify(error));
                });
    },

    restoreSession : function() {
        var token = cc.sys.localStorage.getItem("nakamaToken");
        if (token) {
            this.session = nakamajs.Session.restore(token);
            var currentTimeInSec = new Date() / 1000;

            if (this.session.isexpired(currentTimeInSec)) {
                cc.log("session expired");
                this.session = null;
                cc.sys.localStorage.setItem("nakamaToken", "");
            }
        }

        if (this.session) {
            cc.log("session is restored");
        }

        return !!this.session;
    },

    getDeviceId : function () {
        var device_id = cc.sys.localStorage.getItem("deviceId");
        if (!device_id) {
            // generate device id
            device_id = this.uuidv4();
            cc.sys.localStorage.setItem("deviceId", device_id);
        }

        return device_id;
    },

    uuidv4 : function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    onValidSession : function () {
        const expiresat = this.session.expires_at;
        cc.log("Session will expire at", new Date(expiresat * 1000).toISOString());
        this.connect();
    },

    connect : function () {
        if (!this.session) {
            cc.log("no session");
            return;
        }

        if (this.socket) {
            cc.log("already connected");
            return;
        }

        var self = this;
        const useSSL = false;
        const verboseLogging = false;
        const createStatus = false;

        this.socket = this.client.createSocket(useSSL, verboseLogging);
        this.socket.connect(this.session, createStatus)
            .then(
                function() {
                    cc.log("connected");
                    self.onSocketConnected();
                },
                function(error) {
                    cc.log("connect failed:", JSON.stringify(error));
                }
            );
    },

    onSocketConnected : function() {
        var self = this;

        this.socket.onchannelmessage = (msg) => {
            //cc.log("Received chat message: " + JSON.stringify(msg));
            cc.log(msg.username + ": " + msg.content.m);
            self.label.setString(msg.username + ": " + msg.content.m);
        };

        this.socket.ondisconnect = (event) => {
            cc.log("Disconnected from the server. event: " + JSON.stringify(event));
            this.socket = null;
        };

        this.socket.send({ channel_join: {
                type: 1, // 1 = room, 2 = Direct Message, 3 = Group
                target: "chat-room",
                persistence: false,
                hidden: false
            } })
            .then(
                function(response) {
                    self.chat_room_id = response.channel.id;
                    cc.log("join chat ok. " + JSON.stringify(response));
                    self.sendChatMessage("Hey dude!");
                },
                function(error) {
                    cc.log("join chat failed:", JSON.stringify(error));
                }
            );
    },

    sendChatMessage : function(text) {
        if (!this.socket) {
            cc.log("no socket");
            return;
        }

        this.socket.send({ channel_message_send: {
                channel_id: this.chat_room_id,
                content: { "m": text }
            } });
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

