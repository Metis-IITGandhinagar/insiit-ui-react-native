// src/navigation/types.ts
import type { TabName } from "./tabs";

export type RootStackParamList = {
    Login: undefined;
    /** `tab` jumps the pager to that tab; see MainTabsScreen's RequestedTabBridge. */
    MainTabs: { tab?: TabName } | undefined;
    AdminDashboard: undefined;
    AnnouncementManagement: undefined;
    MessMenuManagement: undefined;
    UserManagement: undefined;
    Representatives: undefined;
    TeamINSIIT: undefined;
    AboutInsiit: undefined;
    PrivacyPolicy: undefined;
    CourseSearch: undefined;
    MessFeedback: undefined;
    Outlets: undefined;
    Announcements: undefined;
    LostFound: undefined;
    Cabshare: undefined;
    BuySell: undefined;
    Profile: undefined;
    Settings: undefined;
    CampusMap: undefined;
    AdminEventsApproval:undefined;
    GlobalSearch: undefined;
};
/**
 * Mirrors `AdminPermissions` in the backend (src/schemas/admin_schemas.rs) and the
 * `admins` table columns. Keep the two in sync — `/admin/permissions` returns
 * exactly these keys, and `POST /admin` requires all of them.
 */
export interface AppPermissions {
    get_admin: boolean;
    post_admin: boolean;
    put_admin: boolean;

    post_bus_schedule: boolean;
    put_bus_schedule: boolean;

    post_event: boolean;

    post_mess_menu: boolean;

    post_outlet: boolean;
    delete_outlet: boolean;
    put_outlet: boolean;
    manage_events?: boolean;
    post_announcement: boolean;
}

/** Every permission off — the shape a non-admin user has. */
export const NO_PERMISSIONS: AppPermissions = {
    get_admin: false,
    post_admin: false,
    put_admin: false,
    post_bus_schedule: false,
    put_bus_schedule: false,
    post_event: false,
    post_mess_menu: false,
    post_outlet: false,
    delete_outlet: false,
    put_outlet: false,
    post_announcement: false,
    manage_events: false,
};

export interface UserSessionProfile {
    email: string;
    permissions: AppPermissions;
    displayName?: string | null;
    photoURL?: string | null;
}