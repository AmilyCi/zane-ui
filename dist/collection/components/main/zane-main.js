import { h, Host } from "@stencil/core";
import { useNamespace } from "../../hooks";
const ns = useNamespace('main');
export class ZaneMain {
    render() {
        return (h(Host, { key: '7762ce61dceb394572f07d1f4e960c712e196d76', class: ns.b() }, h("slot", { key: '72a8596d94e85985ff48258c44e353469588e1b6' })));
    }
    static get is() { return "zane-main"; }
    static get originalStyleUrls() {
        return {
            "$": ["zane-main.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["zane-main.css"]
        };
    }
}
