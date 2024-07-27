import { useKritaApi } from "@renderer/hooks/useKritaHttpApi"
import { useEffect, useMemo, useReducer, useState } from "react"


export function useKritaIcons(icons: string[]) {
    const iconApi = useKritaApi('icon')
    const [base64Icons, setBase64Icons] = useState([] as string[]);
    const [, refresh] = useReducer(x => x + 1, 0)
    useEffect(() => {
        if (!icons || icons.length === 0) {
            return;
        }
        setBase64Icons(_ => new Array(icons.length).fill(''))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(icons)]);

    useEffect(() => {
        if (!icons || icons.length === 0) {
            return;
        }
        for (let i = 0; i < icons.length; i++) {
            const icon = icons[i]
            const cache = localStorage.getItem(`icon:${icon}`)
            if (cache) {
                setBase64Icons(icons => {
                    icons[i] = cache
                    return icons
                })
                continue
            }    

            iconApi({iconName: icons[i]}).then(x => {
                if (!x.ok) {
                    console.error(`icon '${icon}' failed`, x)
                    return
                }

                setBase64Icons(icons => {
                    icons[i] = x.data
                    return icons
                })
                localStorage.setItem(`icon:${icon}`, x.data)
            })
        }
        refresh()
        console.log('icon fetch')
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(icons), iconApi])

    return base64Icons;
}

export function useKritaIcon(icon: string): string {
    const wrapped = useMemo(() => [icon], [icon])
    return useKritaIcons(wrapped)[0]
}
