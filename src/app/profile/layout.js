import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "Your Profile | Manage Your Account | Makapt",
  description:
    "Access and manage your Makapt account details, appointments, preferences, and more—all in one place.",
};

export default function ProfileLayout({ children }) {
  return <ClientLayout>{children}</ClientLayout>;
}
