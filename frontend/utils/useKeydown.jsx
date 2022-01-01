// useEventListener from https://github.com/donavon/use-event-listener

import { useRef, useEffect } from 'react'

const useEventListener = (
    eventName,
    handler,
    element = global,
    options = {}
) => {
    const savedHandler = useRef()
    const { capture, passive, once } = options

    useEffect(() => {
        savedHandler.current = handler
    }, [handler])

    useEffect(() => {
        const isSupported = element && element.addEventListener
        if (!isSupported) {
            return
        }

        const eventListener = (event) => savedHandler.current(event)
        const opts = { capture, passive, once }
        element.addEventListener(eventName, eventListener, opts)
        return () => {
            element.removeEventListener(eventName, eventListener, opts)
        }
    }, [eventName, element, capture, passive, once])
}

const useKeydown = (key, handler) => useEventListener('keydown', (e) => {
    if (e.key === key) {
        handler(e)
    }
})

export default useKeydown