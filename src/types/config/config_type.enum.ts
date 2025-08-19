
type key = "HISTORYFREC" | "HISTORYSWITCH" 

interface ConfigType {
    key: key,
    value: string
}

export { ConfigType }