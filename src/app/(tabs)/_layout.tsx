import * as Haptics from 'expo-haptics';
import { Tabs } from "expo-router";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Path, Svg } from 'react-native-svg';

export const HomeIcon = (props: any) => {
    const fill = props.isFocused ? "black" : "#808080";
    return (
        <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path d="M12 2.5L2 10V21H22V10L12 2.5ZM12 4.675L20 10.45V19H4V10.45L12 4.675ZM9 12V19H15V12H9ZM11 14H13V17H11V14Z" fill={fill}/>
        </Svg>
    );
};

export const BookmarkIcon = (props: any) => {
    const fill = props.isFocused ? "black" : "#808080";
    return (
        <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path d="M6 2C4.89543 2 4 2.89543 4 4V22L12 18L20 22V4C20 2.89543 19.1046 2 18 2H6Z" fill={fill}/>
        </Svg>
    );
};

export const SparkleIcon = (props: any) => {
    const fill = props.isFocused ? "black" : "#808080";
    return (
        <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path d="M12 0L9.12 7.08L2 7.76L7.17 12.87L5.94 20L12 16.27L18.06 20L16.83 12.87L22 7.76L14.88 7.08L12 0Z" fill={fill}/>
        </Svg>
    );
};

export const GraphIcon = (props: any) => {
    const fill = props.isFocused ? "black" : "#808080";
    return (
        <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path d="M4 21H8V11H4V21ZM10 21H14V3H10V21ZM16 21H20V7H16V21Z" fill={fill}/>
        </Svg>
    );
};

export const GearIcon = (props: any) => {
    const fill = props.isFocused ? "black" : "#808080";
    return (
        <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path d="M12 2C9.79 2 8 3.79 8 6C8 8.21 9.79 10 12 10C14.21 10 16 8.21 16 6C16 3.79 14.21 2 12 2ZM6 14C3.79 14 2 15.79 2 18C2 20.21 3.79 22 6 22C8.21 22 10 20.21 10 18C10 15.79 8.21 14 6 14ZM18 14C15.79 14 14 15.79 14 18C14 20.21 15.79 22 18 22C20.21 22 22 20.21 22 18C22 15.79 20.21 14 18 14Z" fill={fill}/>
        </Svg>
    );
};

const CustomTabButton = (props: any) => {
    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        props.onPress();
    };

    return (
        <TouchableOpacity
            {...props}
            onPress={handlePress}
            activeOpacity={1}
            style={[props.style, { overflow: 'hidden' }]}
            android_ripple={null}
        />
    );
};


function TabsLayout() {
    const insets = useSafeAreaInsets();
    return (
        <>
            <Tabs
                initialRouteName="(home)"
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        ...styles.tabBar,
                        paddingBottom: insets.bottom,
                        height: 70 + insets.bottom,
                        backgroundColor: '#FFFFFF',
                        borderTopWidth: 0,
                        borderTopColor: 'transparent',
                        elevation: 8,
                        shadowOpacity: 0.15,
                        shadowColor: '#000000',
                        shadowOffset: { width: 0, height: -8 },
                        shadowRadius: 12,
                    },
                    tabBarItemStyle: {
                        backgroundColor: 'transparent',
                    },
                    tabBarLabelStyle: styles.titleStyle,
                    tabBarIconStyle: styles.icon,
                    tabBarActiveTintColor: '#A20538',
                    tabBarInactiveTintColor: '#808080',
                    tabBarButton: (props) => <CustomTabButton {...props} />,
                }}
            >
                <Tabs.Screen
                    name="(home)"
                    options={{
                        tabBarLabel: "Home",
                        title: "Home",
                        tabBarIcon: ({ focused }) => (
                            <HomeIcon isFocused={focused} />
                        ),
                        tabBarShowLabel: false,
                    }}
                />
                <Tabs.Screen
                    name="customRoutine"
                    options={{
                        tabBarLabel: "Menu",
                        title: "Menu",
                        tabBarIcon: ({ focused }) => (
                            <BookmarkIcon isFocused={focused} />
                        ),
                        tabBarShowLabel: false,
                    }}
                />
                <Tabs.Screen
                    name="dashboard"
                    options={{
                        tabBarLabel: "Dashboard",
                        title: "Dashboard",
                        tabBarIcon: ({ focused }) => (
                            <GraphIcon isFocused={focused} />
                        ),
                        tabBarShowLabel: false,
                    }}
                />
                <Tabs.Screen
                    name="saveLibrary"
                    options={{
                        tabBarLabel: "Save Library",
                        title: "Save Library",
                        tabBarIcon: ({ focused }) => (
                            <GearIcon isFocused={focused} />
                        ),
                        tabBarShowLabel: false,
                    }}
                />
            </Tabs>
        </>
    );
}

export default TabsLayout;

const styles = StyleSheet.create({
    titleStyle: {
        letterSpacing: 0.02,
        width: '100%',
        marginBottom: Platform.OS === 'android' ? 10 : 2,
    },
    icon: {
        marginTop: 10,
    },
    tabBar: {
        height: 60,
    }
});