import {Client} from 'dishttp';
import {check} from "./commands/check.js";
import {invalidate} from "./commands/invalidate.js";
import {ping} from "./commands/ping.js";
import {stats} from "./commands/stats.js";

const client = new Client();

client.handlers.addHandlers([
    ping,
    check,
    invalidate,
    stats,
]);

export { client };
export default client.export();
