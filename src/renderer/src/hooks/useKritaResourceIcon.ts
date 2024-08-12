import { useKritaApi } from "@renderer/hooks/useKritaHttpApi"
import { useEffect, useMemo, useReducer, useState } from "react"


export function useKritaResourceIcons(icons: [resourceType: string, resourceName: string][]) {
    const iconApi = useKritaApi('resource-icon')
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
            const [resourceName, resourceType] = icons[i]
            const cache = localStorage.getItem(`resource-${resourceType}:${resourceName}`)
            if (cache) {
                setBase64Icons(icons => {
                    icons[i] = cache
                    return icons
                })
                continue
            }    

            iconApi({resourceType: icons[i][0], resourceName: icons[i][1]}).then(x => {
                if (!x.ok) {
                    console.error(`icon 'resource-${resourceType}:${resourceName}' failed`, x)
                    return
                }

                setBase64Icons(icons => {
                    icons[i] = x.data
                    return icons
                })
                localStorage.setItem(`resource-${resourceType}:${resourceName}`, x.data)
            })
        }
        refresh()
        console.log('icon fetch')
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(icons), iconApi])

    return base64Icons;
}

export function useKritaResourceIcon(resourceType: string, resourceName: string): string {
    const wrapped = useMemo(() => [[resourceType,resourceName] as [string,string]], [resourceType,resourceName])
    return useKritaResourceIcons(wrapped)[0]
}
