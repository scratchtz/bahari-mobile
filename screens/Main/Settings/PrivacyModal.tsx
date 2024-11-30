import {ScrollView, StyleSheet} from 'react-native';
import Markdown from 'react-native-markdown-display';
import {AppTheme, spacing} from '@utils/styles';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {markdownStyles} from '@screens/Main/Settings/Components/markdownStyles';

const policy = `
# Privacy Policy for Zero Point

## 1. Introduction

At Scratch Limited, we value your privacy. This Privacy Policy outlines how Zero Point ("the App") handles your data. By using the App, you agree to the terms described in this Privacy Policy.

## 2. Data We Do Not Collect

Zero Point does **not** collect, store, or transmit any personal data, server details, or torrent usage information. All data related to your usage of the App is stored **locally** on your device. We do not use external servers to store or manage your data.

## 3. Local Data Storage

All information related to torrent management, server credentials, and usage is saved directly on your device. The App does not send any data to Scratch Limited or any third parties.

### 3.1 User Responsibility
You are responsible for the security of your device and the data stored within the App. We recommend taking necessary measures such as using secure passwords and keeping your device updated to safeguard your data.

## 4. Security

While we do not collect any data, we encourage you to secure your device. Ensure that you take appropriate steps to protect your data from unauthorized access, loss, or disclosure. Scratch Limited is not responsible for any security issues related to your device.

## 5. Third-Party Services

Zero Point does not integrate with any third-party services or analytics tools that could collect data about your activity. You can use the App without the need to connect to external platforms.

## 6. Children’s Privacy

Zero Point is not intended for use by individuals under the age of 13. We do not knowingly collect any information from children.

## 7. Changes to this Privacy Policy

We reserve the right to update this Privacy Policy from time to time. Any changes will be posted within the App or on our website. Your continued use of the App after any changes indicates your acceptance of the updated policy.

## 8. Contact Us

If you have any questions or concerns about this Privacy Policy, please contact us at:

dev@scratch.co.tz
Last updated: 2024 Oct 13

`;

const PrivacyModal = () => {
    const theme = useAppTheme();
    const styles = useThemeStyleSheetProvided(theme, dynamicStyles);

    const markDownStyles = useThemeStyleSheetProvided(theme, markdownStyles);
    return (
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.container}
            contentContainerStyle={styles.scrollView}>
            <Markdown style={markDownStyles}>{policy}</Markdown>
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

export default PrivacyModal;
