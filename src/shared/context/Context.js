import { createContext, useEffect, useState } from 'react';

const ContextStore = createContext();

const ProviderContext = ({ children }) => {
    const [user, setUser] = useState({
        isPresent: false,
        mail: "",
        _id: "",
        username: "",
    })

    return <ContextStore.Provider
        value={{ user, setUser }}
    >
        {children}
    </ContextStore.Provider>
}

export { ContextStore, ProviderContext };