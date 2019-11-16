
export type Destination = {
    endpoint: string,
    merchant: string,
    secretKey: string
}

const DEFAULT_DESTINATIONS = [
    {
        endpoint: "https://komoju.com",
        merchant: "UUID HERe",
        secretKey: "secretekye"
    }
]

export const getDestinations = function(): Destination[] {
    const dests = localStorage.getItem("destinations")
    return (dests == undefined) ? DEFAULT_DESTINATIONS : JSON.parse(dests)
}

const setDestinations = function(dests: Destination[]): void {
    localStorage.setItem("destinations", JSON.stringify(dests))
}

export const addDestination = function(dest: Destination): void {
    const dests = getDestinations()
    const found = dests.filter((d) => d.endpoint == dest.endpoint && d.merchant == dest.merchant)[0]

    if(found) {
        found.endpoint = dest.endpoint
        found.merchant = dest.merchant
        found.secretKey = dest.secretKey
    } else {
        dests.push(dest)
    }

    setDestinations(dests)
}

export const deleteDestination = function(endpoint: string, merchant: string): void {
    const dests = getDestinations().filter((d) => d.endpoint != endpoint || d.merchant != merchant)
    setDestinations(dests)
}