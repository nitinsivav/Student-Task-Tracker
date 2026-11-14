const userFiles = {
  student: "/js/data/student.json",
  teacher: "/js/data/teacher.json"
};

const AuthService = {
    auth : async (role, username, password) => {
        const userFile = userFiles[role];
        if (!userFile) {
            throw new Error(`Invalid role: ${role}`);
        }

        const response = await fetch(userFile);

        if(!response.ok) {
            throw new Error(`Failed to fetch user data for role: ${role}`);
        }

        const users = await response.json();

        const isAuthenticated = users.some((currentUser) => {
        return (
            currentUser.name === username.trim() &&
            currentUser.pass === password
        );
        });

        return isAuthenticated;

        // const user =  users.find((currentUser) => {
        //     return (
        //         currentUser.username === username.trim() &&
        //         currentUser.password === password
        //     );
        // });
        
        // return user;
    }
}

export default AuthService;