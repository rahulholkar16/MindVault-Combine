import { Route, Routes } from "react-router";
import { lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";
import ContentCard from "../components/ContentCard";
const ForgetPassword = lazy(() => import("../pages/ForgetPassword"));
const EditProfile = lazy(() => import("../pages/EditProfile"));
const ProfileEdit = lazy(
    () => import("../components/EditProfileComponents/ProfileEdit"),
);
const EditPhoto = lazy(
    () => import("../components/EditProfileComponents/EditPhoto"),
);
const EditPrivacyAndSetting = lazy(
    () => import("../components/EditProfileComponents/EditPrivacyAndSetting"),
);
const VerifyEmail = lazy(() => import("../pages/VerifyEmail"));
const Profile = lazy(() => import("../components/Profile"));
const NoteEditor = lazy(() => import("../components/NoteEditor"));
const ShareProfileCom = lazy(() => import("../components/ShareProfileCom/ShareProfile"));
const DashboardContent = lazy(() => import("../components/DashboardContent/DashboardContent"));
const ProfileSelector = lazy(() => import("../components/ProfileSelector/ProfileSelector"));
const RegistrationForm = lazy(() => import("../components/RegistrationForm/RegistrationForm"));
const Welcome = lazy(() => import("../pages/Welcome"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Singup"));
const Dashboard = lazy(() => import("../pages/Dashboard"));

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route
                path="/forgot-password/:resetToken"
                element={<ForgetPassword />}
            />
            <Route
                path="/verify-user/:verificationToken"
                element={<VerifyEmail />}
            />
            <Route path="/register" element={<Signup />}>
                <Route index element={<RegistrationForm />} />
                <Route path="change-pic" element={<ProfileSelector />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />}>
                    <Route index element={<DashboardContent />} />
                    <Route path=":type" element={<DashboardContent />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="create" element={<NoteEditor />} />
                    <Route path="user/:token" element={<ShareProfileCom />} />
                    <Route path="content/:contentId" element={<ContentCard />} />
                </Route>

                <Route path="/edit-profile" element={<EditProfile />}>
                    <Route index element={<ProfileEdit />} />
                    <Route path="edit-photo" element={<EditPhoto />} />
                    <Route
                        path="edit-privacy-security"
                        element={<EditPrivacyAndSetting />}
                    />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;
