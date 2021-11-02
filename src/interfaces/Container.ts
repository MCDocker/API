interface Client {
    dataUrl: string,
    name: string,
    javaVersion: number,
    mainClass: string,
    startupArguments: string,
    type: string,
}

interface Mod {

}

interface Container {
    name: string,
    client: Client,
    id: string,
    mods: Mod[],
    user_id?: number | string
}

export default Container;
