import { createContext, useState, useMemo } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    // 2. NEW State to hold the list of administrators
    const [adminList, setAdminList] = useState([]);
    const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
    const [adminListError, setAdminListError] = useState(null);

    // 3. NEW Function to fetch the admin list
    // This function will be passed to the context consumers
    const listAdmins = async (page = 1) => {
        setIsLoadingAdmins(true);
        setAdminListError(null);
        try {
            // Placeholder for your actual API call.
            // Replace 'fetch' with your preferred library (e.g., axios)
            const response = await api.get(`/api/v1/users/admin/list-admin/${page}`);
          console.log(response)
            if (!response.ok) {
                // Handle non-200 responses
                throw new Error("Failed to fetch admin list. Access denied or server error.");
            }

            const data = await response.json();
        
            setAdminList(data.users || data); // Adjust based on your API response structure
            return data.users || data; // Return data for immediate use if needed
        } catch (error) {
            console.error("Error listing admins:", error);
            //setAdminListError(error.message);
            setAdminList([]);
            throw error; // Re-throw the error so consuming components can handle it
        } finally {
            setIsLoadingAdmins(false);
        }
    };

    return (
        <UserContext.Provider value={{listAdmins,adminList,listAdmins}}>
            {children}
        </UserContext.Provider>
    );
}