import { MessData } from "../types";

export const mockWeekMenu: MessData = {
    week: [
        {
            date: "2026-05-04",
            day: "Monday",
            meals: [
                {
                    id: "breakfast",
                    type: "Breakfast",

                    // TEMPORARY
                    // Remove these once the backend starts sending timings.
                    startTime: "07:45",
                    endTime: "10:00",

                    items: [
                        "Indori Poha / Kanda Poha",
                        "Onion",
                        "Sev + Lemon",
                        "Sprouts",
                        "Omelette",
                        "Brown Bread Butter + Jam",
                        "Milk + Mint Chai + Coffee",
                        "Chocos",
                        "Chocolate Powder",
                        "Chikoo",
                    ],
                },
                {
                    id: "lunch",
                    type: "Lunch",

                    startTime: "12:15",
                    endTime: "14:15",

                    items: [
                        "Kachumber Salad",
                        "Dal Tadka",
                        "White Chauli Masala",
                        "Matar Paneer",
                        "Plain Rice",
                        "Masala Buttermilk",
                        "Chapati",
                        "Mirchi + Lemon + Mix Pickle",
                        "Rice Papad",
                    ],
                },
                {
                    id: "snacks",
                    type: "Snacks",

                    startTime: "16:30",
                    endTime: "17:45",

                    items: [
                        "Dahi Vada",
                        "Green Chutney + Imli Chutney",
                        "Pineapple Crush",
                        "Adrak-Elaichi Chai + Coffee + Milk",
                    ],
                },
                {
                    id: "dinner",
                    type: "Dinner",

                    startTime: "19:30",
                    endTime: "21:30",

                    items: [
                        "Sambhara Salad",
                        "Punjabi Kadhi",
                        "Lasaniya Batata",
                        "Masala Khichdi",
                        "Puri",
                        "Fried Mirchi + Mix Veg Pickle",
                        "Aam-Ras",
                        "Chicken Tikka Masala",
                    ],
                },
            ],
        },

        {
            date: "2026-05-05",
            day: "Tuesday",
            meals: [
                {
                    id: "breakfast",
                    type: "Breakfast",

                    startTime: "07:45",
                    endTime: "10:00",

                    items: [
                        "Aloo Onion Paratha / Paneer Veg Paratha",
                        "Schezwan Chutney + Curd",
                        "Mango Pickle",
                        "Egg Bhurjee",
                        "White Bread Butter + Jam",
                        "Milk + Chai + Coffee",
                        "Cornflakes",
                        "Bournvita",
                        "Papaya",
                    ],
                },
                {
                    id: "lunch",
                    type: "Lunch",

                    startTime: "12:15",
                    endTime: "14:15",

                    items: [
                        "Mix Salad",
                        "Moong Dal Tadka",
                        "Besan Gatta",
                        "Aloo Gavar Masala",
                        "Plain Rice",
                        "Masala Buttermilk",
                        "Multigrain Chapati",
                        "Mirchi + Lemon + Garlic Pickle",
                        "Ramakada",
                    ],
                },
                {
                    id: "snacks",
                    type: "Snacks",

                    startTime: "16:30",
                    endTime: "17:45",

                    items: [
                        "Bhel / Chinese Bhel",
                        "Green Chutney + Imli Chutney / Ketchup",
                        "Guava Crush",
                        "Adrak-Elaichi Chai + Coffee + Milk",
                    ],
                },
                {
                    id: "dinner",
                    type: "Dinner",

                    startTime: "19:30",
                    endTime: "21:30",

                    items: [
                        "Onion-Tomato Salad",
                        "Dal Palak",
                        "Bhindi Do Pyaaza",
                        "Plain Rice",
                        "Chapati",
                        "Fried Mirchi + Chilli Pickle",
                        "Jalebi",
                        "Butter Chicken",
                    ],
                },
            ],
        },

        {
            date: "2026-05-06",
            day: "Wednesday",
            meals: [
                {
                    id: "breakfast",
                    type: "Breakfast",

                    startTime: "07:45",
                    endTime: "10:00",

                    items: [
                        "Idli",
                        "Sambar + Peanut Chutney",
                        "Ginger Chutney",
                        "Boiled Egg Masala",
                        "White Bread Butter + Jam",
                        "Milk + Elaichi Chai + Coffee",
                        "Chocos",
                        "Boost",
                        "Banana",
                    ],
                },
                {
                    id: "lunch",
                    type: "Lunch",

                    startTime: "12:15",
                    endTime: "14:15",

                    items: [
                        "Mix Salad",
                        "Dal Palak",
                        "Rajma Masala",
                        "Dahi Bhindi",
                        "Jeera Rice",
                        "Lemon Water",
                        "Chapati",
                        "Mirchi + Lemon + Mix Pickle",
                        "Roasted Papad",
                    ],
                },
                {
                    id: "snacks",
                    type: "Snacks",

                    startTime: "16:30",
                    endTime: "17:45",

                    items: [
                        "Bataka Vada",
                        "Green Chutney + Imli Chutney",
                        "Orange Crush",
                        "Adrak-Elaichi Chai + Coffee + Milk",
                    ],
                },
                {
                    id: "dinner",
                    type: "Dinner",

                    startTime: "19:30",
                    endTime: "21:30",

                    items: [
                        "Onion Salad",
                        "Dal Tadka",
                        "Mashroom Matar Masala",
                        "Steam Rice",
                        "Chapati",
                        "Fried Mirchi + Garlic Pickle + Chutney",
                        "Cherry Berry / American Nuts Ice Cream",
                        "Hyderabadi Chicken Dum Biryani",
                    ],
                },
            ],
        },
        {
            date: "2026-05-07",
            day: "Thursday",
            meals: [
                {
                    id: "breakfast",
                    type: "Breakfast",
                    startTime: "07:45",
                    endTime: "10:00",
                    items: [
                        "Puri",
                        "Sabji",
                        "Egg Bhurjee",
                        "Brown Bread Butter + Jam",
                        "Milk + Masala Chai + Coffee",
                        "Cornflakes",
                        "Bournvita",
                        "Watermelon",
                    ],
                },
                {
                    id: "lunch",
                    type: "Lunch",
                    startTime: "12:15",
                    endTime: "14:15",
                    items: [
                        "Sambhara Salad",
                        "Panchratna Dal",
                        "Moong Masala",
                        "Aloo Palak Dry",
                        "Jeera Rice",
                        "Plain Curd",
                        "Chapati",
                        "Mirchi + Lemon + Chilli Pickle",
                        "Fryums",
                    ],
                },
                {
                    id: "snacks",
                    type: "Snacks",
                    startTime: "16:30",
                    endTime: "17:45",
                    items: [
                        "Grilled Aloo Matar Sandwich",
                        "Ketchup",
                        "Mango Rasna",
                        "Adrak-Elaichi Chai + Coffee + Milk",
                    ],
                },
                {
                    id: "dinner",
                    type: "Dinner",
                    startTime: "19:30",
                    endTime: "21:30",
                    items: [
                        "Beetroot Cucumber Salad",
                        "Arhar Dal",
                        "Paneer Bhurjee / Egg Curry",
                        "Plain Rice",
                        "Chapati",
                        "Fried Mirchi + Mix Veg Pickle",
                        "Dry Fruit Rice Kheer",
                    ],
                },
            ],
        },

        {
            date: "2026-05-08",
            day: "Friday",
            meals: [
                {
                    id: "breakfast",
                    type: "Breakfast",
                    startTime: "07:45",
                    endTime: "10:00",
                    items: [
                        "Vermicelli Upma",
                        "Green Chutney",
                        "Steamed Sprouts",
                        "Boiled Egg Masala",
                        "White Bread Butter + Jam",
                        "Milk + Adrak Chai + Coffee",
                        "Chocos",
                        "Chocolate Powder",
                        "Mango",
                    ],
                },
                {
                    id: "lunch",
                    type: "Lunch",
                    startTime: "12:15",
                    endTime: "14:15",
                    items: [
                        "Mix Salad",
                        "Rasam",
                        "Kala Chana Masala",
                        "Cabbage Matar Masala",
                        "Plain Rice",
                        "Masala Buttermilk",
                        "Chapati",
                        "Mirchi + Lemon + Chilli Pickle",
                        "Ramakada",
                    ],
                },
                {
                    id: "snacks",
                    type: "Snacks",
                    startTime: "16:30",
                    endTime: "17:45",
                    items: [
                        "Samosa / Vada Pav",
                        "Ketchup",
                        "Lemon Water",
                        "Adrak-Elaichi Chai + Coffee + Milk",
                    ],
                },
                {
                    id: "dinner",
                    type: "Dinner",
                    startTime: "19:30",
                    endTime: "21:30",
                    items: [
                        "Onion Tomato Salad",
                        "Sambar + Peanut Chutney / Rajasthani Dal",
                        "Medu Vada / Fried Curd",
                        "Lemon Rice / Jeera Rice",
                        "Masala Dosa / Fried Bati",
                        "Lemon + Pickle / Lehsoon Chutney + Chilli Pickle",
                        "Rasagulla / Churma",
                        "Chicken Fried Rice",
                    ],
                },
            ],
        },
        {
            date: "2026-05-09",
            day: "Saturday",
            meals: [
                {
                    id: "breakfast",
                    type: "Breakfast",
                    startTime: "07:45",
                    endTime: "10:00",
                    items: [
                        "Nylon Khaman / Sandwich Dhokla",
                        "Green Chutney",
                        "Steamed Sprouts",
                        "Omelette",
                        "Brown Bread Butter + Jam",
                        "Milk + Elaichi Chai + Coffee",
                        "Chocos",
                        "Boost",
                        "Papaya",
                    ],
                },
                {
                    id: "lunch",
                    type: "Lunch",
                    startTime: "12:15",
                    endTime: "14:15",
                    items: [
                        "Onion Salad",
                        "Urad Dal",
                        "Delhi Style Chhole",
                        "Jeera Aloo",
                        "Plain Rice",
                        "Rose Lassi",
                        "Bhature",
                        "Lemon + Pickle + Mint Chutney",
                        "Rice Papad",
                    ],
                },
                {
                    id: "snacks",
                    type: "Snacks",
                    startTime: "16:30",
                    endTime: "17:45",
                    items: [
                        "Plain Maggie",
                        "Ketchup",
                        "Banana Milkshake",
                        "Adrak-Elaichi Chai",
                    ],
                },
                {
                    id: "dinner",
                    type: "Dinner",
                    startTime: "19:30",
                    endTime: "21:30",
                    items: [
                        "Carrot Cucumber Salad",
                        "Dal Fry",
                        "Aloo Tamatar Rassawala",
                        "Jeera Rice",
                        "Multigrain Chapati",
                        "Fried Mirchi + Garlic Pickle",
                        "Pineapple Halwa / Suji Ka Halwa",
                        "Fish Curry",
                    ],
                },
            ],
        },

        {
            date: "2026-05-10",
            day: "Sunday",
            meals: [
                {
                    id: "breakfast",
                    type: "Breakfast",
                    startTime: "07:45",
                    endTime: "10:00",
                    items: [
                        "Schezwan Dosa / Mysore Masala Dosa",
                        "Sambar + Peanut Chutney",
                        "Ginger Chutney",
                        "Boiled Chana",
                        "Boiled Egg Masala",
                        "White Bread Butter + Jam",
                        "Milk + Adrak-Elaichi Chai + Coffee",
                        "Cornflakes",
                        "Chocolate Powder",
                        "Banana",
                    ],
                },
                {
                    id: "lunch",
                    type: "Lunch",
                    startTime: "12:15",
                    endTime: "14:15",
                    items: [
                        "Onion Tomato Salad",
                        "Dal Fry",
                        "White Matar Masala",
                        "Ringan Masala",
                        "Plain Rice",
                        "Plain Curd",
                        "Chapati",
                        "Mirchi + Lemon + Mix Pickle",
                        "Ramakada",
                    ],
                },
                {
                    id: "snacks",
                    type: "Snacks",
                    startTime: "16:30",
                    endTime: "17:45",
                    items: [
                        "Pani Puri",
                        "Onion, Chat Masala, Aloo Chana / Ragda + Sev",
                        "Lemon Water",
                        "Adrak-Elaichi Chai + Coffee + Milk",
                    ],
                },
                {
                    id: "dinner",
                    type: "Dinner",
                    startTime: "19:30",
                    endTime: "21:30",
                    items: [
                        "Cucumber Onion Salad",
                        "Panchratna Dal",
                        "Veg Kolhapuri",
                        "Jeera Rice",
                        "Chapati",
                        "Fried Mirchi + Mix Veg Pickle",
                        "Gulab Jamun",
                        "Hyderabadi Chicken Dum Biryani",
                    ],
                },
            ],
        },
    ],
};