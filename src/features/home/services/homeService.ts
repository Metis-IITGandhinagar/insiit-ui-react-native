import {
    Bus,
    Calendar,
    CalendarDays,
    Ellipsis,
    MapPinned,
    QrCode,
    Store,
    Utensils,
} from "lucide-react-native";

import { HomeData } from "../types";

export const homeService = {
    async getHomeData(): Promise<HomeData> {
        return {
            user: {
                id: "1",
                name: "Janil",
            },

            mess: {
                breakfast: {
                    title: "Breakfast",
                    items: ["Idli", "Sambar", "Coconut Chutney", "Tea", "Coconut Chutney", "Coconut Chutney", "Coconut Chutney"],
                },
                lunch: {
                    title: "Lunch",
                    items: [
                        "Dal Fry",
                        "Jeera Rice",
                        "Paneer Butter Masala",
                        "Roti",
                        "Salad",
                        "Jeera Rice",
                        "Jeera Rice", "Jeera Rice",
                        "Jeera Rice", "Jeera Rice",
                    ],
                },
                dinner: {
                    title: "Dinner",
                    items: [
                        "Rajma",
                        "Steamed Rice",
                        "Mix Veg",
                        "Chapati",
                        "Gulab Jamun",
                        "Steamed Rice",
                        "Steamed Rice",
                        "Steamed Rice",
                        "Steamed Rice",
                    ],
                },
            },

            nextBus: {
                route: "IITGN -> Dholkuva Circle -> Ahmedabad",
                departure: "15:30",
                arrival: "16:20",
                minutes: 12,
            },

            announcements: [
                {
                    id: "1",
                    title: "Midsem registration closes tomorrow.",
                    date: "Today",
                },
                {
                    id: "2",
                    title: "Hostel maintenance on Saturday (10 AM – 2 PM).",
                    date: "Yesterday",
                },
                {
                    id: "3",
                    title: "SAC election nominations are now open.",
                    date: "2 days ago",
                },
            ],

            events: [
                {
                    id: "1",
                    title: "Robotics Workshop",
                    venue: "AB 7/101",
                    time: "Today • 5:00 PM",
                },
                {
                    id: "2",
                    title: "Open Mic Night",
                    venue: "Student Activity Center",
                    time: "Tomorrow • 7:30 PM",
                },
                {
                    id: "3",
                    title: "Basketball Tournament",
                    venue: "Sports Complex",
                    time: "Sunday • 4:00 PM",
                },
            ],

            quickActions: [
                {
                    id: "mess",
                    title: "Mess",
                    icon: Utensils,
                },
                {
                    id: "bus",
                    title: "Buses",
                    icon: Bus,
                },
                {
                    id: "outlets",
                    title: "Outlets",
                    icon: Store,
                },
                {
                    id: "services",
                    title: "Services",
                    icon: MapPinned,
                },
                {
                    id: "events",
                    title: "Events",
                    icon: Calendar,
                },
                {
                    id: "qr",
                    title: "QR",
                    icon: QrCode,
                },
                {
                    id: "timetable",
                    title: "Timetable",
                    icon: CalendarDays,
                },
                {
                    id: "more",
                    title: "More",
                    icon: Ellipsis,
                },
            ],
        };
    }
};