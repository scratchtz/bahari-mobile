import {ScrollView, StyleSheet} from 'react-native';
import Markdown from 'react-native-markdown-display';
import {AppTheme, spacing} from '@utils/styles';
import {useThemeStyleSheet, useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {markdownStyles} from '@screens/Main/Settings/Components/markdownStyles';

const terms = `
# Terms and Conditions for Zero Point

## 1. Acceptance of Terms

By downloading, installing, or using Zero Point ("the App"), you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not use our App.

## 2. Use of the App

### 2.1 License
Scratch Limited grants you a limited, non-exclusive, non-transferable license to use Zero Point for your personal, non-commercial purposes.

### 2.2 Restrictions
You agree not to:
- Modify, distribute, or create derivative works based on the App
- Use the App for any illegal purpose
- Attempt to gain unauthorized access to any portion of the App

## 3. User Data and Privacy

### 3.1 Local Storage
All data entered into the App is stored locally on your device. We do not collect, store, or transmit any information about your server or personal data.

### 3.2 User Responsibility
You are responsible for securing your device and the data stored within the App.

## 4. Disclaimer of Warranties

The App is provided "as is" without any warranties, expressed or implied. Scratch Limited does not warrant that the App will be error-free or uninterrupted.

## 5. Limitation of Liability

Scratch Limited shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the App.

## 6. Data Collection

Zero Point does not collect any data regarding your servers, torrents, or usage. All information is stored locally on your device, and no external servers are used.

## 7. Changes to the App and Terms

We reserve the right to modify or discontinue the App at any time. We may also revise these Terms and Conditions at any time. By continuing to use the App after such changes, you agree to be bound by the revised terms.
`;

const TermsModal = () => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const markDownStyles = useThemeStyleSheetProvided(theme, markdownStyles);

    return (
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.container}
            contentContainerStyle={styles.scrollView}>
            <Markdown style={markDownStyles}>{terms}</Markdown>
        </ScrollView>
    );
};

const dynamicStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            height: '100%',
        },
        scrollView: {
            marginHorizontal: spacing.th,
        },
    });

export default TermsModal;
