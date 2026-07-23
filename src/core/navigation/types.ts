// src/navigation/types.ts
export type RootStackParamList = {
    Login: undefined;
    MainTabs: undefined;
    AdminDashboard: undefined;
    Representatives: undefined;
    TeamINSIIT: undefined;
    CourseSearch: undefined;
    MessFeedback:undefined;
    Profile:undefined;
    Settings:undefined;
};
export interface AppPermissions {
    get_admin: boolean;
    post_admin: boolean;
    put_admin: boolean;
    post_event: boolean;
    delete_event: boolean;
    put_event: boolean;
    post_mess_menu: boolean;
}

export interface UserSessionProfile {
    email: string;
    role: 'student' | 'welfare_admin' | 'event_admin' | 'guest';
    permissions: AppPermissions;
    displayName?: string | null;
    photoURL?: string | null;
}