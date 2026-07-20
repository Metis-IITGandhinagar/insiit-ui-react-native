// src/navigation/types.ts
export type RootStackParamList = {
    Login: undefined;
    MainTabs: undefined;
    AdminDashboard: undefined;
    Representatives: undefined;
    TeamINSIIT: undefined;
    VersionNerd: undefined;
    CourseSearch: undefined;
    MessFeedback:undefined;
    Profile:undefined;
    Settings:undefined;
};
export interface AppPermissions {
    get_admin: boolean;
    post_admin: boolean;
    put_admin: boolean;
    post_bus_schedule: boolean;
    put_bus_schedule: boolean;
    post_event: boolean;
    delete_event: boolean;
    put_event: boolean;
    post_mess_menu: boolean;
    post_outlet: boolean;
    delete_outlet: boolean;
    put_outlet: boolean;
}

export interface UserSessionProfile {
    email: string;
    role: 'student' | 'admin';
    permissions: AppPermissions;
    displayName?: string | null;
    photoURL?: string | null;
}