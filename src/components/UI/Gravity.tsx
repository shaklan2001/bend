import React from 'react';
import { Keyboard, Animated, Platform } from 'react-native';
import { UI_DIMENSIONS } from '@src/lib/constant';


interface GravityProps {
  children: React.ReactNode;
  bringOnTop?: boolean;
}

interface GravityState {
  keyboardCursor: Animated.Value;
  zIndex?: number;
}

class Gravity extends React.PureComponent<GravityProps, GravityState> {
  private keyboardDidShowListener: any;
  private keyboardWillHideSub: any;

  constructor(props: GravityProps) {
    super(props);
    this.state = {
      keyboardCursor: new Animated.Value(Platform.OS === 'ios' ? -32 : -12),
      zIndex: props.bringOnTop ? 50 : undefined
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
    this.keyboardWillHideSub && this.keyboardWillHideSub.remove();
  }

  _keyboardWillShow = (nativeEvent: any) => {
    const { duration } = nativeEvent;
    const height = nativeEvent.endCoordinates.height + 10;
    Animated.timing(this.state.keyboardCursor, {
      useNativeDriver: true,
      toValue: -height,
      duration
    }).start();
  };

  _keyboardWillHide = (nativeEvent: any) => {
    const { duration } = nativeEvent;
    Animated.timing(this.state.keyboardCursor, {
      useNativeDriver: true,
      toValue: Platform.OS === 'ios' ? -32 : -12,
      duration
    }).start();
  };

  render() {
    return (
      <Animated.View
        style={{
          position: 'absolute',
          transform: [{ translateY: this.state.keyboardCursor }],
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: this.state.zIndex,
          paddingHorizontal: UI_DIMENSIONS.PAGE_HORIZONTAL_PADDING_FOR_MOBILE,
          paddingBottom: 6
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

export default Gravity;
