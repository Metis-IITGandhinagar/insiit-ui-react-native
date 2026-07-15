export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    Search: undefined;
    Tools: undefined;
    Bus: undefined;
    More: undefined;
    AdminDashboard: undefined;
};
export interface AppPermissions {
    post_event: boolean;
    delete_event: boolean;
    put_bus_schedule: boolean;
}

export interface UserSessionProfile {
    email: string;
    role: 'student' | 'admin' | 'staff';
    permissions: AppPermissions;
}