import { ImageSourcePropType } from "react-native";

export interface RoutineCard {
    id: number;
    title: string;
    duration: string;
    image: any;
    backgroundColor: string;
    slug?: string;
}

export const recommendedData: RoutineCard[] = [
    {
        id: 1,
        title: "Lower Back 1",
        duration: "8 MINUTES",
        image: require('@assets/yoga/Gemini_Generated_Image_l6zc7cl6zc7cl6zc.png'),
        backgroundColor: '#A69B8A',
        slug: 'lower-back-1'
    },
    {
        id: 2,
        title: "Hamstrings 2",
        duration: "7 MINUTES",
        image: require('@assets/yoga/Gemini_Generated_Image_fgc5gyfgc5gyfgc5.png'),
        backgroundColor: '#A69B8A',
        slug: 'hamstrings-2'
    },
    {
        id: 3,
        title: "Shoulders 1",
        duration: "5 MINUTES",
        image: require('@assets/yoga/Gemini_Generated_Image_l6zc7cl6zc7cl6zc (2).png'),
        backgroundColor: '#A69B8A',
        slug: 'shoulders-1'
    },
    {
        id: 4,
        title: "Wake Up",
        duration: "4 MINUTES",
        image: require('@assets/yoga/Gemini_Generated_Image_l6zc7cl6zc7cl6zc (1).png'),
        backgroundColor: '#A69B8A',
        slug: 'wake-up'
    },
    {
        id: 5,
        title: "Hamstrings 1",
        duration: "5 MINUTES",
        image: require('@assets/yoga/images_1.png'),
        backgroundColor: '#A69B8A',
        slug: 'hamstrings-1'
    },
    {
        id: 6,
        title: "Morning Mobility",
        duration: "5 MINUTES",
        image: require('@assets/yoga/Gemini_Generated_Image_l6zc7cl6zc7cl6zc (3).png'),
        backgroundColor: '#A69B8A',
        slug: 'morning-mobility'
    }
];

export type ScreenType = 'info' | 'single-choice-question' | 'multi-choice-question';
export type AnswerKey = 'stretchTime' | 'painAreas' | 'activityLevel' | 'goals' | 'experienceLevel' | 'consultationType';

export interface Screen {
    type: ScreenType;
    title: string;
    subtitle?: string;
    key?: AnswerKey;
    options?: string[];
    image?: ImageSourcePropType
}

export const screens: Screen[] = [
    {
        type: 'info',
        title: 'Welcome to Bend',
        subtitle: 'Our mission is to help you stretch every day.',
    },
    {
        type: 'info',
        title: 'Stretching is important.',
        subtitle: 'Every time you stretch, you invest in your long-term health and longevity.',
        image: require('@assets/yoga/images_2.png')
    },
    {
        type: 'info',
        title: 'You\'re in the right place.',
        subtitle: 'Whether you\'re younger or older, a beginner or an expert — our simple, daily routines are designed for everyone.',
        image: require('@assets/yoga/Gemini_Generated_Image_l6zc7cl6zc7cl6zc (1).png')
    },
    {
        type: 'info',
        title: 'Consistency is key.',
        subtitle: 'It\'s important to stretch every day. Bend is a simple way to make stretching a part of your daily routine.',
        image: require('@assets/yoga/Gemini_Generated_Image_l6zc7cl6zc7cl6zc (2).png')
    },
    {
        type: 'single-choice-question',
        key: 'stretchTime',
        title: 'When is a good time for your daily stretch?',
        subtitle: 'Choose an option to continue',
        options: ['After waking up', 'After morning coffee or tea', 'After exercising', 'Before showering', 'During work break', 'Before going to bed', 'Other'],
    },
    {
        type: 'multi-choice-question',
        key: 'painAreas',
        title: 'Which areas of your body experience pain or discomfort?',
        subtitle: 'This helps us recommend safe exercises',
        options: ['Neck & Shoulders', 'Lower Back', 'Hips & Glutes', 'Knees', 'Ankles & Feet', 'Wrists & Hands', 'No pain currently'],
    },
    {
        type: 'single-choice-question',
        key: 'activityLevel',
        title: 'How active are you currently?',
        subtitle: 'Be honest - this helps us create the right routine',
        options: ['Very active (exercise 4+ times/week)', 'Moderately active (exercise 2-3 times/week)', 'Lightly active (exercise 1-2 times/week)', 'Sedentary (little to no exercise)', 'Recovering from injury'],
    },
    {
        type: 'multi-choice-question',
        key: 'goals',
        title: 'What are your main stretching goals?',
        subtitle: 'Select all that apply',
        options: ['Reduce pain & stiffness', 'Improve flexibility', 'Better posture', 'Recovery after exercise', 'Stress relief', 'Injury prevention', 'General wellness'],
    },
    {
        type: 'single-choice-question',
        key: 'experienceLevel',
        title: 'What\'s your experience with stretching?',
        subtitle: 'This helps us set the right difficulty level',
        options: ['Complete beginner', 'Some experience', 'Intermediate', 'Advanced', 'Professional athlete'],
    },
    {
        type: 'single-choice-question',
        key: 'consultationType',
        title: 'What type of recommendations would you prefer?',
        subtitle: 'Choose your consultation style',
        options: ['AI-powered personalized routines', 'Expert-curated programs', 'Community recommendations', 'Hybrid approach (AI + expert review)'],
    },
    {
        type: 'info',
        title: 'Thanks for sharing.',
        subtitle: 'We\'ll let you know which exercises to be cautious about.',
        image: require('@assets/yoga/images_1.png')
    },
];

export const UI_DIMENSIONS: {[type: string]: number} = {
    PAGE_HORIZONTAL_PADDING_FOR_MOBILE: 20,
    PAGE_HORIZONTAL_PADDING_FOR_TABLET: 32,
    PAGE_HORIZONTAL_PADDING_FOR_LARGE_TABLET: 56,
    MAX_PAGE_WIDTH: 1280,
    TABLET_BREAKPOINT: 768,
    LARGE_TABLET_BREAKPOINTT: 1024
  };