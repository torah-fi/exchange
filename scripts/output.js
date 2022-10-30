const {openSync, closeSync, appendFileSync, existsSync, mkdirSync} = require('fs');


const baseLogdir = "./deployment_logs/";


class Item {
    constructor(tag, value) {
        this.tag = tag;
        this.value = value;
    }

    toString() {
        return this.tag + "：" + this.value;
    }
}

const writeLogs = async (realName, _items = []) => {
    if (_items.length <= 0) {
        return;
    }
    let _date = new Date();
    let day = dateFormat("YYYY-mm-dd", _date);
    let fullDay = dateFormat("YYYY-mm-dd HH:MM:SS", _date);

    let title = process.env.TITLE
    let items = [];
    items.push("");
    items.push("==========================    " + title + "     ==========================")
    items.push("========================== " + fullDay.toString() + " ==========================")
    for (let datum of _items) {
        items.push(datum);
    }
    items.push("=========================================================================");
    items.push("");

    let dir = baseLogdir + day.toString() + "/";
    if (!existsSync(dir)) {
        mkdirSync(dir);
    }
    let fd;
    for (let val of items) {
        try {
            fd = openSync(dir + realName, 'a');
            appendFileSync(fd, val.toString() + "\n", 'utf8');
        } catch (err) {
            throw err
        } finally {
            if (fd !== undefined)
                closeSync(fd);
        }
    }
}


const dateFormat = (fmt, date) => {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),
        "m+": (date.getMonth() + 1).toString(),
        "d+": date.getDate().toString(),
        "H+": date.getHours().toString(),
        "M+": date.getMinutes().toString(),
        "S+": date.getSeconds().toString()
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }
    return fmt;
}

module.exports = {
    writeLogs,
    Item
}