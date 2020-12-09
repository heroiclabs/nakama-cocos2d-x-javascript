// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Login extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    client: any = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        var serverkey = "defaultkey";
        var host = "127.0.0.1";
        var port = 7350;

        var useSSL = false;
        var timeout = 7000; // ms
        this.client = new nakamajs.Client(serverkey, host, port, useSSL, timeout);
        var self = this;
        let p_:Promise<any> = this.client.authenticateCustom("test_id");
        p_.then(function (sessio) {
            self.label.string = "auth success";
            cc.log(" auth success");
        },
        function (error) {
            self.label.string = "auth error "+error;
            cc.log(" auth error "+JSON.stringify( error));
        }).catch((err) => {
            cc.log(" auth exception "+err);
        });
    }

    // update (dt) {}
}
