import config from "../config"

export class AuthService {

    async getUser() {
        try {
            const response = await fetch(`${config.PRODUCTION_API_URL}/users/me`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || 'Error while fetching notes.');
            } else {
                return data.data;
            }   

        } catch(error: any) {
            console.log(error.message || 'Error while fetching notes.');
            throw error;  
        }
    }

    signupWithGoogle() {
        try {
            window.location.href = `${config.PRODUCTION_API_URL}/users/signupWithGoogle`;
        } catch (error) {
            console.error('Error while initiating Google signup:', error);
            throw error;
        }
    }

    async createAccount({name, email, username, dob, password}: {name: string, email: string, username: string, dob: string, password: string}) {
        try {
            const response = await fetch(`${config.PRODUCTION_API_URL}/users/signup`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name, email, username, dob, password})
            });

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || 'Error while creating Account.');
            } else {
                const userData = await this.login({username, password});
                if(userData) return userData;
            }   

        } catch (error) {
            console.log('Error while signing up.');
            throw error;
        }
    }
      
    async login({username, password}: {username: string, password: string}) {
        try {
            const response = await fetch(`${config.PRODUCTION_API_URL}/users/signin`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password})
            });

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || 'Invalid email or OTP.');
            } else {
                // localStorage.setItem('token', data.data.accessToken);
                return data.data.user;
            }   

        } catch(error) {
            console.log('Error while logging in.');
            throw error;  
        }
    }

    async logout() {
        try {
            const response = await fetch(`${config.PRODUCTION_API_URL}/users/signout`, {
                method: 'POST',
                credentials: 'include',
            });

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || 'Error while logging out');
            } else {
                return true;
            }
        } catch (error) {
            console.log('Error while logging out.'); 
            throw error;
        }
    }

    async uploadPicture(formData: FormData) {
        try {
            const response = await fetch(`${config.PRODUCTION_API_URL}/users/addUserPicture`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await response.json(); 

            if(!response.ok) {
                throw new Error(data.message || "Error while uploading picture.");
            } else {
                const picture = data.data;
                return picture;
            }
        } catch (error: any) {
            console.error(error.message || "Error while uploading picture.");
            throw error;
        }
    }

    async updateUser({name, email, dob, username}: {name: string, email: string, dob: string, username: string}) {
        try {
            const response = await fetch(`${config.PRODUCTION_API_URL}/users/updateUser`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name, email, username, dob})
            });

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || 'Error while creating Account.');
            } else {
                return true;
            }   

        } catch (error) {
            console.log('Error while signing up.');
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;