import { Client, Account, Databases } from 'appwrite';
import { User } from '../../stores/AppwriteStore';
import { goto } from '$app/navigation';

const client = new Client().setEndpoint('https://appwrite.bespeak.site/v1').setProject('bespeak');

export const account = new Account(client);
export const databases = new Databases(client);

export const AppwriteAuthServices = {
	login: async (provider: 'google' | 'github', redirectUrl: string) => {
		let letFinalRedirect: string;
		if (redirectUrl.includes('localhost')) {
			letFinalRedirect = `http://${redirectUrl.split('/', 3)[2]}/profile`;
		} else {
			letFinalRedirect = `https://www.bespeak.site/profile`;
		}
		let user = await account.createOAuth2Session(provider, letFinalRedirect);
		User.set(user);
	},
	logout: async () => {
		try {
			const promise = await account.deleteSessions();
			goto('/login');
			User.set(null);
		} catch (err) {
			goto('/login');
			User.set(null);
		}
	},
	fetchAccount: async () => {
		try {
			const promise = await account.get();
			User.set(promise);
			return true;
		} catch (err) {
			User.set(null);
			return false;
		}
	}
};

export const AppwriteDocumentService = {
    createFleet: async ()=>{}
    createItem: async ()=>{}
}
