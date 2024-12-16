import {ScrollView, StyleSheet} from 'react-native';
import Markdown from 'react-native-markdown-display';
import {AppTheme, spacing} from '@utils/styles';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {markdownStyles} from '@screens/Main/Settings/Components/markdownStyles';

const policy = `
# Privacy Policy for Bahari

## 1. Introduction

At Scratch Limited, we value your privacy. This Privacy Policy outlines how Bahari ("the App") handles your data. By using the App, you agree to the terms described in this Privacy Policy.

## 2. Data We Collect

Bahari collects minimal data to provide essential functionality:

- **Wallet Public Address**: We store your wallet public address solely for the purpose of sending push notifications for new transactions. If you opt out of push notifications, this data is deleted. It's stored in form of | wallet_address | push_notification_token |. Whenever a transaction occurs for that particular address we send a notification to the corresponding token.

## 3. Data We Do Not Collect

Bahari does **not** collect, store, or log:

- Personal data such as names, email addresses, or phone numbers
- IP addresses or other identifiable information
- Mnemonic phrases or private keys

All sensitive wallet data is encrypted and stored locally on your device. You are solely responsible for managing and securing your data.

## 4. Local Data Storage

### 4.1 User Responsibility
All wallet-related information, including your mnemonic phrase and private keys, is stored on your device in encrypted form. It is your responsibility to safeguard this data. We recommend using strong passwords and keeping your device secure and up-to-date.

## 5. Push Notifications

Bahari uses third-party services to send push notifications for new transactions:

- **Apple Push Notification Service (APNs)** for iOS
- **Google Firebase Cloud Messaging (FCM)** for Android

Push notifications are optional. If you disable them, no data is transmitted to these services, and your wallet address is deleted from our system.

## 6. Security

We are committed to ensuring your data remains secure. Bahari employs robust encryption to protect locally stored wallet data. However, the security of your data ultimately depends on how you manage your device and access credentials.

## 7. Third-Party Services

The App integrates only with the following third-party services:

- Apple Push Notification Service (APNs)
- Google Firebase Cloud Messaging (FCM)

These services are used exclusively for delivering push notifications. No additional data is shared or collected.

## 8. Changes to this Privacy Policy

We reserve the right to update this Privacy Policy from time to time. Any changes will be posted within the App or on our website. Your continued use of the App after any changes indicates your acceptance of the updated policy.

## 9. Contact Us

If you have any questions or concerns about this Privacy Policy, please contact us at:

dev@scratch.co.tz

Last updated: 2024 Dec 16



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
