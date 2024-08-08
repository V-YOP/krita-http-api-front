import { app, shell, BrowserWindow, ipcMain, Tray, Menu, screen } from 'electron'
import { readFile } from 'fs/promises'
import { join } from 'path'

const KRA_HISTORY = join(app.getPath('home'), '.kra_history', 'history')
const DAY_DURATION = 24 * 60 * 60 * 1000

export async function getTodaySeconds(): Promise<number> {
    const fileContent = await readFile(KRA_HISTORY, 'utf-8')
    const datas = fileContent.split(/\r?\n/).map(x=>x.trim()).filter(x=>x && x!=='').map(x => {
        const xs = x.split('##')
        return [new Date(xs[0]), +xs[3]]
    })
    function getBelongDate(date: Date) {
        if (date.getHours() <= 6) {
            date = new Date(+date - DAY_DURATION)
        }
        return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    }
    function toYYMMDD(date) {
        const year = date.getFullYear().toString().substring(2)
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = (date.getDate()).toString().padStart(2, '0')
        return `${year}${month}${day}`
    }
    
    const dateSums = groupByAnd(datas, x => toYYMMDD(getBelongDate(x[0])), arr => Math.round(arr.reduce((acc, [,x]) => acc + x, 0)))
    
    const today = dateSums[toYYMMDD(getBelongDate(new Date()))] ?? 0
    return today
}
// @ts-ignore
function groupByAnd(arr, f, m) {
    const res = {}
    for (const item of arr) {
        const key = f(item)
        if (!res[key]) res[key] = []
        res[key].push(item)
    }
    for (const key of Object.keys(res)) {
        res[key] = m(res[key])
    }
    return res
}