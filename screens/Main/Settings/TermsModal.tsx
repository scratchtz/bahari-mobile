import {ScrollView, StyleSheet} from 'react-native';
import Markdown from 'react-native-markdown-display';
import {AppTheme, spacing} from '@utils/styles';
import {useThemeStyleSheetProvided} from '@hooks/useThemeStyleSheet';
import {useAppTheme} from '@hooks/useAppTheme';
import {markdownStyles} from '@screens/Main/Settings/Components/markdownStyles';

const terms = `
# Terms & Conditions for Bahari

## 1. Acceptance of Terms

By downloading or using Bahari ("the App"), you agree to be bound by these Terms & Conditions ("Terms"). If you do not agree, you may not use the App.

## 2. Eligibility

The App is available to individuals who can legally own and manage a cryptocurrency wallet. It is your responsibility to ensure compliance with local laws and regulations.

## 3. Use of the App

You are solely responsible for:
- Securing your device and wallet credentials.
- Keeping your mnemonic phrase, private keys, and passwords safe.
- Ensuring that your use of the App complies with applicable laws.

## 4. Disclaimer of Liability

Bahari is provided "as is," and Scratch Limited disclaims all liability for:
- Loss of funds due to user errors, such as forgotten mnemonic phrases or passwords.
- Unauthorized access to your wallet caused by negligence.
- Errors or delays in blockchain transactions.
- Bugs, glitches, or other technical issues within the App.

Cryptocurrency transactions are irreversible. Use caution and verify all details before sending or receiving funds.

## 5. No Financial Advice

Bahari does not provide financial, tax, or investment advice. Use the App at your own risk and consult a professional for any financial decisions.

## 6. Third-Party Services

The App integrates with the following third-party services solely to enable push notifications:
- Apple Push Notification Service (APNs)
- Google Firebase Cloud Messaging (FCM)

If you opt out of push notifications, no data is transmitted to these services.

## 7. Prohibited Activities

You agree not to:
- Use the App for illegal activities, fraud, or money laundering.
- Exploit or reverse-engineer the App’s functionality.
- Interfere with or disrupt the operation of the App.
- Create derivative apps using Bahari’s source code while pretending to be Bahari.
- Use Bahari’s nodes for derivative apps without prior permission.

Violation of these terms may result in suspension or termination of your access to the App.

## 8. Intellectual Property

Bahari is an open-source application. While you are free to review, modify, and use the source code under the terms of its open-source license, you may not:
- Use Bahari’s branding, trademarks, or logos without written consent.
- Represent derivative apps as being affiliated with or endorsed by Bahari.
- Use Bahari’s nodes or infrastructure for derivative apps without explicit permission.

## 9. Termination of Use

Scratch Limited reserves the right to suspend or terminate your access to the App if you violate these Terms or engage in prohibited activities.

## 10. Updates to Terms

We may update these Terms from time to time. Changes will be posted within the App or on our website. Your continued use of the App after changes indicates your acceptance of the updated Terms.

## 11. Governing Law

These Terms are governed by the laws of The United Republic of Tanzania. Any disputes will be resolved in accordance with local laws.

## 12. Limitation of Liability

To the fullest extent permitted by law, Scratch Limited shall not be liable for any indirect, incidental, or consequential damages arising from your use of the App, including but not limited to bugs, glitches, or technical issues.

## 13. Contact Us

For questions or concerns about these Terms, contact us at:

dev@scratch.co.tz

Last updated: 2024 Dec 16
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
