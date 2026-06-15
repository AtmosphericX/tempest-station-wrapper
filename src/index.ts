/*
              _                             _               _     __   __
         /\  | |                           | |             (_)    \ \ / /
        /  \ | |_ _ __ ___   ___  ___ _ __ | |__   ___ _ __ _  ___ \ V / 
       / /\ \| __| '_ ` _ \ / _ \/ __| '_ \| '_ \ / _ \ '__| |/ __| > <  
      / ____ \ |_| | | | | | (_) \__ \ |_) | | | |  __/ |  | | (__ / . \ 
     /_/    \_\__|_| |_| |_|\___/|___/ .__/|_| |_|\___|_|  |_|\___/_/ \_\
                                     | |                            
                                     |_|                                                                                                                

    Created with ♥ by the AtmosphericX Team (KiyoWx, StarflightWx, & CJ Ziegler)
    Discord: https://atmosphericx-discord.scriptkitty.cafe
    Ko-Fi: https://ko-fi.com/k3yomi
    Documentation: http://localhost/documentation | https://atmosphericx.scriptkitty.cafe/documentation

    Internal Package: @atmosx/tempest-station-wrapper

*/


import { TypeSettings } from "./@types/types.settings";
import { setEventEmit } from "./@modules/@utilities/utilities.setEventEmit";
import { startService } from "./@core/core.start"
import { stopService } from "./@core/core.stop"
import { getClosestStation } from "./@core/core.getNearestStation";
import { createListener } from "./@core/core.createListener";
import { setWarning } from "./@modules/@utilities/utilities.setWarning";


export class Manager { 
    constructor(settings: TypeSettings) { this.trycatch(); startService(settings) }

    on(event: string, callback: () => void) {
        createListener(event, callback)
    }

    trycatch() {
        process.on('uncaughtException', (err: any) => {
            const ignored = ['ETIMEDOUT', 'ECONNRESET', 'EHOSTUNREACH', 'ENOTFOUND', 'ECONNREFUSED', 'EPIPE', 'EADDRINUSE', 'EALREADY', 'EACCES', 'EAGAIN', 'EHOSTDOWN', 'STARTTLS_FAILURE'];
            if (ignored.includes(err?.code)) { 
                setEventEmit({
                    event: `onTempestStation`,
                    metadata: {
                        message: `Tempest Critical Error: ${err?.code ?? 'Unknown error code'}. This may indicate a connection issue.`,
                        data: {},
                        type: `error`,
                        error: true 
                    }
                });
                return; 
            }
            setWarning({message: `Uncaught Exception: ${err instanceof Error ? err.stack || err.message : String(err)}`})
        })
    }
}


export default Manager
export { 
    startService, stopService, getClosestStation
}

