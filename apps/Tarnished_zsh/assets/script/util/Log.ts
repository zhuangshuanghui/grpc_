export class Log
{
    showlog : boolean = true;

    public static LogInfo(info : any)
    {
        if (typeof (info) == "string")
        {
            console.log(info);
        }
        else
        {
            let kkmsg = JSON.stringify(info);
            console.log(kkmsg);
        }
    }

    public static LogDebug(msg : any)
    {
        if (typeof (msg) == "string")
        {
            console.debug(msg);
        }
        else
        {
            let kkmsg = JSON.stringify(msg);
            console.debug(kkmsg);
        }
    }

    public static LogError(error : any)
    {
        if (typeof (error) == "string")
        {
            console.error(error);
        }
        else
        {
            let kkmsg = JSON.stringify(error);
            console.error(kkmsg);
        }
    }

    public static LogWarning(warning : any)
    {
        if (typeof (warning) == "string")
        {
            console.warn(warning);
        }
        else {
            let kkmsg = JSON.stringify(warning);
            console.warn(kkmsg);
        }
    }
}