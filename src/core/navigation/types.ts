// src/navigation/types.ts
export type RootStackParamList = {
    Login: undefined;
    MainTabs: undefined;
    AdminNavigator: undefined;
    Representatives: undefined;
    TeamINSIIT: undefined;
    CourseSearch: undefined;
    MessFeedback: undefined;
    Outlets: undefined;
    LostFound: undefined;
    Cabshare: undefined;
    BuySell: undefined;
    Profile: undefined;
    Settings: undefined;
};
export interface AppPermissions {
    get_admin: boolean;
    post_admin: boolean;
    put_admin: boolean;

    post_event: boolean;

    post_mess_menu: boolean;

    post_announcement: boolean;
}

export interface UserSessionProfile {
    email: string;
    permissions: AppPermissions;
    displayName?: string | null;
    photoURL?: string | null;
}