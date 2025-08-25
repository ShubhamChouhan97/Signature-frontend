// import { create } from "zustand";
// import { immer } from "zustand/middleware/immer";
// import { MainClient } from "../../client/quiz-client";
// import { MessageInstance } from "antd/es/message/interface";
// import { rolesMap } from "../../libs/statusMap";

// interface TestStoreState {
// 	session: Session | null;
// 	appLoading: boolean;
// 	messageInstance: MessageInstance | null;
// 	init: () => Promise<void>;
// 	setAppLoading: (_state: boolean) => void;
// 	getRole: (_role: number) => string;
// 	setMessageInstance: (_message: MessageInstance) => void;
// }

// export const createAppStore = (client: MainClient) => {
// 	const initialValues: TestStoreState = {
// 		session: null,
// 		appLoading: false,
// 		messageInstance: null,
// 		init: async () => {},
// 		setAppLoading: () => {},
// 		setMessageInstance: () => {},
// 		getRole: (role: number) => rolesMap[role as keyof typeof rolesMap],
// 	};

// 	return create<TestStoreState>()(
// 		immer((set, get) => ({
// 			...initialValues,
// 			async init() {
// 				const session = await client.getSession();

// 				set({
// 					session: session,
// 				});
// 			},
// 			setAppLoading(state) {
// 				set((appState) => {
// 					appState.appLoading = state;
// 					return appState;
// 				});
// 			},
// 			setMessageInstance(instance) {
// 				if (get().messageInstance) {
// 					return;
// 				}
// 				set((appStore) => {
// 					appStore.messageInstance = instance;
// 					return appStore;
// 				});
// 			},
// 		}))
// 	);
// };
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { MessageInstance } from "antd/es/message/interface";
import { rolesMap } from "../../libs/statusMap";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface Session {
	
	userId: string;
	role: number;
	email: string;
	phoneNumber: string;
	name: string;
};


interface TestStoreState {
	session: Session | null;
	appLoading: boolean;
	messageInstance: MessageInstance | null;
	init: () => Promise<void>;
	setAppLoading: (_state: boolean) => void;
	getRole: (_role: number) => string;
	setMessageInstance: (_message: MessageInstance) => void;
}

export const useAppStore = create<TestStoreState>()(
	immer((set, get) => ({
		session: null,
		appLoading: false,
		messageInstance: null,
		async init() {
			try {
				const res = await fetch(`${backendUrl}/session`, {
					method: "GET",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
				});
				if (!res.ok) throw new Error("Failed to fetch session");
				const session: Session = await res.json();
				set({ session });
			} catch (err) {
				console.error("Session fetch error:", err);
				set({ session: null });
			}
		},
		setAppLoading(state) {
			set((appState) => {
				appState.appLoading = state;
			});
		},
		setMessageInstance(instance) {
			if (get().messageInstance) return;
			set((appStore) => {
				appStore.messageInstance = instance;
			});
		},
		getRole: (role: number) => rolesMap[role as keyof typeof rolesMap],
	}))
);