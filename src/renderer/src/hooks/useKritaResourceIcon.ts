import { useKritaApi } from "@renderer/hooks/useKritaHttpApi"
import { useEffect, useState } from "react"

function useKritaResourceIcon(resourceType: string, resourceName: string): string {
    const [base64, setBase64] = useState('')
    const iconApi = useKritaApi('resource-icon')
    
    useEffect(() => {
        if (resourceType === '' || resourceName === '') {
            return
        }
        const cache = localStorage.getItem(`resource-${resourceType}:${resourceName}`)
        if (cache) {
            setBase64(cache)
            return
        }    

        iconApi({resourceType, resourceName}).then(x => {
            if (!x.ok) {
                console.error(`resource '${resourceType}${resourceName}' failed`, x)
                return
            }
            setBase64(x.data)
            localStorage.setItem(`resource-${resourceType}:${resourceName}`, x.data)
        })
    }, [resourceType, resourceName, iconApi])
    return base64
}

export default useKritaResourceIcon