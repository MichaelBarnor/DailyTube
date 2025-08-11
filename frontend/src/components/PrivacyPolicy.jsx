export function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#161a23] flex items-center justify-center py-8">
            <div className="max-w-2xl w-full mx-auto p-6 bg-[#23283a] rounded-lg shadow-md text-white">
                <h1 className="text-3xl font-bold mb-4 text-green-600">Privacy Policy for DailyTube</h1>
                <p className="mb-2 text-sm text-gray-300">Effective Date: August 10, 2025</p>

                <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
                <ul className="list-disc ml-6 mb-4">
                    <li>
                        <strong>Google Account Information:</strong> When you sign in with Google, we collect your basic profile information (such as your name, email address, and profile picture) as permitted by Google OAuth.
                    </li>
                    <li>
                        <strong>YouTube Data:</strong> With your permission, we access your YouTube liked videos and playlists to provide app features.
                    </li>
                    <li>
                        <strong>Spotify Data:</strong> If you connect Spotify, we access your Spotify playlists and related data.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
                <ul className="list-disc ml-6 mb-4">
                    <li>Provide and improve DailyTube’s features.</li>
                    <li>Display your playlists and liked videos.</li>
                    <li>Personalize your experience.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">3. How We Share Your Information</h2>
                <p className="mb-4">
                    <strong>We do not sell or share your personal information with third parties</strong> except as required by law or to provide core app functionality (e.g., communicating with Google/YouTube/Spotify APIs).
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Security</h2>
                <p className="mb-4">
                    We use industry-standard security measures to protect your data. Your tokens and personal data are stored securely and are never shared.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Choices</h2>
                <ul className="list-disc ml-6 mb-4">
                    <li>You can disconnect your Google or Spotify account at any time.</li>
                    <li>You can request deletion of your data by contacting us at <a href="mailto:michaelbarnor69@gmail.com" className="text-green-600 underline">michaelbarnor69@gmail.com</a>.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">6. Children’s Privacy</h2>
                <p className="mb-4">
                    DailyTube is not intended for children under 13. We do not knowingly collect data from children.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">7. Changes to This Policy</h2>
                <p className="mb-4">
                    We may update this policy. We will notify you of significant changes by updating the date at the top of this page.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-2">8. Contact Us</h2>
                <p>
                    If you have questions about this policy, contact us at: <a href="mailto:michaelbarnor69@gmail.com" className="text-green-600 underline">michaelbarnor69@gmail.com</a>
                </p>
            </div>
        </div>
    );
}