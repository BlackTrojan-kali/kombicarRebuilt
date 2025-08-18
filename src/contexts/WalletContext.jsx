import { createContext } from "react";

const WalletContext = createContext({})

const WalletContextProvider = ({children})=>{
    const [account,setAccount] = useState();

    return(
        <WalletContext.Provider value={account}>
            {children}
        </WalletContext.Provider>
    )
}