import * as Haptics from 'expo-haptics';
import { Tabs } from "expo-router";
import { useCallback } from 'react';
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { G, Mask, Path, Rect, Svg } from 'react-native-svg';

export const HomeIcon = (props: any) => {
    const fill = props.isFocused ? "black" : "#808080";
    return (
        <Svg
        width={36}
        height={36}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <Mask
          id="mask0_7_31"
          style={{
            maskType: "alpha",
          }}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={24}
          height={24}
        >
          <Rect width={24} height={24} fill={fill} />
        </Mask>
        <G mask="url(#mask0_7_31)">
          <Path
            d="M6 19H9V13H15V19H18V10L12 5.5L6 10V19ZM4 21V9L12 3L20 9V21H13V15H11V21H4Z"
            fill={fill}
          />
        </G>
      </Svg>
    );
};

export const BookmarkIcon = (props: any) => {
    const fill = props.isFocused ? "black" : "#808080";
    return (
        <Svg
        width={34}
        height={34}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <Mask
          id="mask0_7_25"
          style={{
            maskType: "alpha",
          }}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={28}
          height={28}
        >
          <Rect width={28} height={28} fill={fill} />
        </Mask>
        <G mask="url(#mask0_7_25)">
          <Path
            d="M5 21V5C5 4.45 5.19583 3.97917 5.5875 3.5875C5.97917 3.19583 6.45 3 7 3H17C17.55 3 18.0208 3.19583 18.4125 3.5875C18.8042 3.97917 19 4.45 19 5V21L12 18L5 21ZM7 17.95L12 15.8L17 17.95V5H7V17.95Z"
            fill={fill}
          />
        </G>
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
        width={34}
        height={34}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <Path
          d="M9.5 10.5C9.5 10.1022 9.65804 9.72064 9.93934 9.43934C10.2206 9.15804 10.6022 9 11 9H13C13.3978 9 13.7794 9.15804 14.0607 9.43934C14.342 9.72064 14.5 10.1022 14.5 10.5V19.5C14.5 19.8978 14.342 20.2794 14.0607 20.5607C13.7794 20.842 13.3978 21 13 21H11C10.6022 21 10.2206 20.842 9.93934 20.5607C9.65804 20.2794 9.5 19.8978 9.5 19.5V10.5ZM3 16.5C3 16.1022 3.15804 15.7206 3.43934 15.4393C3.72064 15.158 4.10218 15 4.5 15H6.5C6.89782 15 7.27936 15.158 7.56066 15.4393C7.84196 15.7206 8 16.1022 8 16.5V19.5C8 19.8978 7.84196 20.2794 7.56066 20.5607C7.27936 20.842 6.89782 21 6.5 21H4.5C4.10218 21 3.72064 20.842 3.43934 20.5607C3.15804 20.2794 3 19.8978 3 19.5V16.5Z"
          fill={fill}
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 4.5C16 4.10218 16.158 3.72064 16.4393 3.43934C16.7206 3.15804 17.1022 3 17.5 3H19.5C19.8978 3 20.2794 3.15804 20.5607 3.43934C20.842 3.72064 21 4.10218 21 4.5V19.5C21 19.8978 20.842 20.2794 20.5607 20.5607C20.2794 20.842 19.8978 21 19.5 21H17.5C17.1022 21 16.7206 20.842 16.4393 20.5607C16.158 20.2794 16 19.8978 16 19.5V4.5ZM17.5 4C17.3674 4 17.2402 4.05268 17.1464 4.14645C17.0527 4.24021 17 4.36739 17 4.5V19.5C17 19.6326 17.0527 19.7598 17.1464 19.8536C17.2402 19.9473 17.3674 20 17.5 20H19.5C19.6326 20 19.7598 19.9473 19.8536 19.8536C19.9473 19.7598 20 19.6326 20 19.5V4.5C20 4.36739 19.9473 4.24021 19.8536 4.14645C19.7598 4.05268 19.6326 4 19.5 4H17.5Z"
          fill={fill}
        />
      </Svg>
    );
};

export const GearIcon = (props: any) => {
    const fill = props.isFocused ? "black" : "#808080";
    return (
        <Svg
        width={34}
        height={34}
        viewBox="0 0 22 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <Path
          d="M15.4688 4.71875C15.4688 3.83492 15.2067 2.97093 14.7156 2.23605C14.2246 1.50117 13.5267 0.928394 12.7101 0.590165C11.8936 0.251936 10.995 0.16344 10.1282 0.335868C9.26134 0.508295 8.46508 0.933903 7.84012 1.55887C7.21515 2.18383 6.78955 2.98009 6.61712 3.84694C6.44469 4.71379 6.53319 5.61231 6.87142 6.42887C7.20964 7.24543 7.78242 7.94335 8.5173 8.43438C9.25218 8.92541 10.1162 9.1875 11 9.1875C12.1848 9.18616 13.3206 8.71491 14.1584 7.87715C14.9962 7.03939 15.4674 5.90353 15.4688 4.71875ZM11 7.5625C10.4376 7.5625 9.88775 7.39572 9.4201 7.08324C8.95245 6.77077 8.58796 6.32663 8.37272 5.80701C8.15748 5.28738 8.10117 4.7156 8.21089 4.16396C8.32062 3.61233 8.59146 3.10562 8.98917 2.70792C9.38687 2.31021 9.89358 2.03937 10.4452 1.92964C10.9968 1.81992 11.5686 1.87623 12.0883 2.09147C12.6079 2.30671 13.052 2.6712 13.3645 3.13885C13.677 3.6065 13.8438 4.15631 13.8438 4.71875C13.8438 5.47296 13.5441 6.19628 13.0108 6.72959C12.4775 7.26289 11.7542 7.5625 11 7.5625ZM17.0938 10C16.2099 10 15.3459 10.2621 14.611 10.7531C13.8762 11.2442 13.3034 11.9421 12.9652 12.7586C12.6269 13.5752 12.5384 14.4737 12.7109 15.3406C12.8833 16.2074 13.3089 17.0037 13.9339 17.6286C14.5588 18.2536 15.3551 18.6792 16.2219 18.8516C17.0888 19.0241 17.9873 18.9356 18.8039 18.5973C19.6204 18.2591 20.3183 17.6863 20.8094 16.9515C21.3004 16.2166 21.5625 15.3526 21.5625 14.4688C21.5612 13.284 21.0899 12.1481 20.2522 11.3104C19.4144 10.4726 18.2785 10.0013 17.0938 10ZM17.0938 17.3125C16.5313 17.3125 15.9815 17.1457 15.5138 16.8332C15.0462 16.5208 14.6817 16.0766 14.4665 15.557C14.2512 15.0374 14.1949 14.4656 14.3046 13.914C14.4144 13.3623 14.6852 12.8556 15.0829 12.4579C15.4806 12.0602 15.9873 11.7894 16.539 11.6796C17.0906 11.5699 17.6624 11.6262 18.182 11.8415C18.7016 12.0567 19.1458 12.4212 19.4582 12.8888C19.7707 13.3565 19.9375 13.9063 19.9375 14.4688C19.9375 15.223 19.6379 15.9463 19.1046 16.4796C18.5713 17.0129 17.848 17.3125 17.0938 17.3125ZM4.90625 10C4.02242 10 3.15843 10.2621 2.42355 10.7531C1.68867 11.2442 1.11589 11.9421 0.777665 12.7586C0.439436 13.5752 0.35094 14.4737 0.523368 15.3406C0.695795 16.2074 1.1214 17.0037 1.74637 17.6286C2.37133 18.2536 3.16759 18.6792 4.03444 18.8516C4.90129 19.0241 5.79981 18.9356 6.61637 18.5973C7.43293 18.2591 8.13085 17.6863 8.62188 16.9515C9.11291 16.2166 9.375 15.3526 9.375 14.4688C9.37366 13.284 8.90241 12.1481 8.06465 11.3104C7.22689 10.4726 6.09103 10.0013 4.90625 10ZM4.90625 17.3125C4.34381 17.3125 3.794 17.1457 3.32635 16.8332C2.8587 16.5208 2.49421 16.0766 2.27897 15.557C2.06373 15.0374 2.00742 14.4656 2.11714 13.914C2.22687 13.3623 2.49771 12.8556 2.89542 12.4579C3.29312 12.0602 3.79983 11.7894 4.35146 11.6796C4.9031 11.5699 5.47488 11.6262 5.99451 11.8415C6.51414 12.0567 6.95827 12.4212 7.27074 12.8888C7.58322 13.3565 7.75 13.9063 7.75 14.4688C7.75 15.223 7.45039 15.9463 6.91709 16.4796C6.38378 17.0129 5.66046 17.3125 4.90625 17.3125Z"
          fill={fill}  
        />
      </Svg>
    );
};

const CustomTabButton = (props: any) => {
    const handlePress = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        props.onPress();
    }, [props.onPress]);

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
                    name="saveLibrary"
                    options={{
                        tabBarLabel: "Save Library",
                        title: "Save Library",
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
                    name="customRoutine"
                    options={{
                        tabBarLabel: "Custom Routine",
                        title: "Custom Routine",
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